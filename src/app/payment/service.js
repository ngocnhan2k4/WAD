const querystring = require('querystring');
const crypto = require('crypto');

const paymentService = {
    createPayment: async (cartData) => {
        const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        const returnUrl = 'http://localhost:3000/payment-return'; // URL trả về sau khi thanh toán
        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: process.env.VNP_TMN_CODE,
            vnp_Amount: cartData.total * 100, // Đơn vị VNPay là đồng
            vnp_CurrCode: 'VND',
            vnp_TxnRef: Date.now().toString(),
            vnp_OrderInfo: `Payment for cart ${cartData.id}`,
            vnp_Locale: 'vn',
            vnp_ReturnUrl: returnUrl,
            vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, '').slice(0, 14),
            vnp_IpAddr: '127.0.0.1', // Thay bằng IP người dùng nếu có
        };

        // Tạo chữ ký bảo mật
        const secretKey = process.env.VNP_SECRET_KEY;
        const signData = querystring.stringify(vnpParams);
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnpParams.vnp_SecureHash = signed;

        // Tạo URL thanh toán
        return `${vnpUrl}?${querystring.stringify(vnpParams)}`;
    },

    getCart: (userId) =>
        prisma.userCart.findMany({
            where: { user_id: userId },
            include: {
                Product: {
                    include: {
                        Suppliers: true, 
                        Images: true,
                    },
                },
            },
        }),
};

module.exports = paymentService;
