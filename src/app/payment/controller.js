const paymentService = require('./service');
const moment = require('moment');

const paymentController = {
    createPayment: async (req, res) => {
        try {
            const bankCode = req.body.bankCode;
            const clientIp =
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            const totalAmount = await paymentService.getCartTotal(req.user.id);
            const totalPrice = totalAmount._sum.price;
            console.log(totalPrice);

            // Lấy URL trang chọn phương thức thanh toán
            const paymentUrl = await paymentService.createPayment(totalPrice, clientIp, bankCode);
            res.json({ paymentUrl });
            //res.redirect(paymentUrl)
        } catch (error) {
            console.error('Error creating VNPay payment:', error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    paymentReturn: async (req, res) => {
        try {
            const { vnp_TxnRef, vnp_ResponseCode, vnp_OrderInfo, vnp_Amount, vnp_PayDate } = req.query;

            const payDate = moment(vnp_PayDate, 'YYYYMMDDHHmmss').toDate();
            console.log(payDate);
    
            // Xác thực chữ ký bảo mật
            // const paymentVerification = await paymentService.verifyPayment(req.query);
    
            // if (!paymentVerification.isValid) {
            //     console.error('Invalid signature detected.');
            //     return res.status(400).json({ message: 'Invalid signature' });
            // }
    
            // Thông tin giao dịch
            const transactionDetails = {
                transactionId: vnp_TxnRef,
                responseCode: vnp_ResponseCode,
                orderInfo: vnp_OrderInfo,
                amount: vnp_Amount / 100, // Chuyển đổi từ đồng sang VNĐ
                payDate: payDate,
                success: vnp_ResponseCode === '00', // Kiểm tra giao dịch thành công
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
