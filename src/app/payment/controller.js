const paymentService = require('./service');
const moment = require('moment');

const paymentController = {
    createPayment: async (req, res) => {
        try {
            console.log(req.body);
            const reqData = req.body
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
            console.log(req.query);

            const payDate = moment(vnp_PayDate, 'YYYYMMDDHHmmss').toDate();
            console.log(payDate);
    
            // Xác thực chữ ký bảo mật
            const paymentVerification = await paymentService.verifyPayment(req.query);
    
            if (!paymentVerification.isValid) {
                console.error('Invalid signature detected.');
                return res.status(400).json({ message: 'Invalid signature' });
            }
    
            // Thông tin giao dịch
            const transactionDetails = {
                transactionId: vnp_TxnRef,
                responseCode: vnp_ResponseCode,
                orderInfo: vnp_OrderInfo,
                amount: vnp_Amount,
                payDate: payDate,
                success: paymentVerification.code === '00', // Kiểm tra giao dịch thành công
            };
    
            if (transactionDetails.success) {
                const userId = req.user.id; // Lấy `userId` từ middleware xác thực
                const orderId = await paymentService.getNextOrderId();
    
                // Chuyển dữ liệu từ UserCart sang Orders, OrderDetails, và Payments
                const newOrder = await paymentService.completeOrder(userId, orderId, transactionDetails.amount, transactionDetails.payDate);
    
                console.log('Transaction successful:', transactionDetails);
                res.render('paymentResult', { transactionDetails, page_style: "/css/paymentResult.css", notAJAX: true});
            } else {
                console.error('Transaction failed:', transactionDetails);
                res.render('paymentResult', { transactionDetails, page_style: "/css/paymentResult.css", notAJAX: true});
            }
        } catch (error) {
            console.error('Error processing payment return:', error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

module.exports = paymentController;
