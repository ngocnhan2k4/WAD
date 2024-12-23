const paymentService = require('./service');
const moment = require('moment');

const paymentController = {
    createPayment: async (req, res) => {
        try {
            const reqData = req.body
            //console.log("reqData");
            console.log(reqData);

            req.session.shippingAddress = reqData.shippingAddress;

            const clientIp =
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            // Lấy URL trang chọn phương thức thanh toán
            const paymentUrl = await paymentService.createPayment(clientIp, reqData);
            res.json({ paymentUrl });
        } catch (error) {
            console.error('Error creating VNPay payment:', error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    paymentReturn: async (req, res) => {
        try {
            const { vnp_TxnRef, vnp_ResponseCode, vnp_OrderInfo, vnp_Amount, vnp_PayDate } = req.query;
            // console.log(req.query);

            let payDate = moment(vnp_PayDate, 'YYYYMMDDHHmmss').toDate();
            // console.log(payDate);
    
            // Xác thực chữ ký bảo mật
            const paymentVerification = await paymentService.verifyPayment(req.query);
    
            if (!paymentVerification.isValid) {
                console.error('Invalid signature detected.');
                return res.status(400).json({ message: 'Invalid signature' });
            }
            
            const shippingAddress = req.session.shippingAddress; // Lấy từ session

            // Thông tin giao dịch
            const transactionDetails = {
                transactionId: vnp_TxnRef,
                responseCode: vnp_ResponseCode,
                orderInfo: vnp_OrderInfo,
                amount: vnp_Amount,
                payDate: payDate,
                success: paymentVerification.code === '00', // Kiểm tra giao dịch thành công
            };
            
            const userId = req.user.id; // Lấy `userId` từ middleware xác thực
            const orderId = await paymentService.getNextOrderId();

            transactionDetails.amount = parseInt(transactionDetails.amount, 10)

            if (transactionDetails.success) {
                // Chuyển dữ liệu từ UserCart sang Orders, OrderDetails, và Payments
                const newOrder = await paymentService.completeOrder(userId, orderId, transactionDetails.amount, transactionDetails.payDate, transactionDetails.success, shippingAddress);
                transactionDetails.payDate = moment(vnp_PayDate, 'YYYYMMDDHHmmss').format('DD/MM/YYYY');
                console.log('Transaction successful:', transactionDetails);
                res.render('paymentResult', { transactionDetails, page_style: "/css/paymentResult.css", notAJAX: true});
            } else {
                const newOrder = await paymentService.completeOrder(userId, orderId, transactionDetails.amount, transactionDetails.payDate, transactionDetails.success, shippingAddress);
                transactionDetails.payDate = moment(vnp_PayDate, 'YYYYMMDDHHmmss').format('DD/MM/YYYY');
                console.error('Transaction failed:', transactionDetails);
                res.render('paymentResult', { transactionDetails, page_style: "/css/paymentResult.css", notAJAX: true});
            }

            delete req.session.shippingAddress;
        } catch (error) {
            console.error('Error processing payment return:', error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

module.exports = paymentController;
