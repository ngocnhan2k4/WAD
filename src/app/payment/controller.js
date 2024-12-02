const paymentService = require("./service");

const paymentController = {
    createPayment: async (req, res) => {
        try {
            // Lấy thông tin giỏ hàng từ DB
            const cartData = await paymentService.getCart(req.user.id); // Giả sử `req.user.id` chứa thông tin người dùng

            if (!cartData || cartData.items.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }

            // Chuyển đổi thông tin giỏ hàng sang URL thanh toán VNPay
            const paymentUrl = await paymentService.createPayment(cartData);

            res.json({ paymentUrl });
        } catch (error) {
            console.error('Error creating VNPay payment:', error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};


module.exports = paymentController;
