const vnpayConfig = {
    vnp_TmnCode: 'CGI1PK93', // Mã terminal
    vnp_HashSecret: 'KBQBSSJRVOVOLR7WPO7JZ5RG31KFUI14', // Chuỗi bí mật
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // URL VNPay
    // vnp_ReturnUrl: process.env.PUBLIC_ROUTE + 'payment/vnpay_return', // URL xử lý kết quả
    vnp_ReturnUrl: 'http://localhost:4000/payment/vnpay_return', // URL xử lý kết quả
};

module.exports = vnpayConfig;