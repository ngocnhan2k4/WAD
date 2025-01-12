const querystring = require('qs');
const crypto = require('crypto');
const moment = require('moment-timezone');
const vnpayConfig = require("../../config/vnpayConfig");
const prisma = require("../../config/database/db.config");
const axios = require('axios');

const paymentService = {
    createPayment: async (clientIp, reqData) => {

        const date = new Date();
        const orderId = moment.tz(date, 'Asia/Ho_Chi_Minh').format('DDHHmmss'); // Định dạng orderId
        const ipv4Address = clientIp.includes(':') ? '127.0.0.1' : clientIp;
        let createDate = moment.tz(date, 'Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
        let expiredDate = moment.tz(date, 'Asia/Ho_Chi_Minh').add(5, 'minutes').format('YYYYMMDDHHmmss');

        let amountNumber = reqData.amount.replace(/[^\d]/g, '');  // Loại bỏ mọi ký tự không phải số
        let amount = parseInt(amountNumber, 10);

        const vnpParams = {
            vnp_Version: '2.1.1',
            vnp_Command: 'pay',
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_Amount: amount * 100, // VNPay yêu cầu đơn vị là đồng
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: reqData.paymentDescription, // Mô tả đơn hàng
            vnp_Locale: reqData.language,
            vnp_OrderType: 'topup',
            vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
            vnp_IpAddr: ipv4Address,
            vnp_CreateDate: createDate,
            vnp_ExpireDate: expiredDate,
        };   
        if(reqData.paymentMethod !== null && reqData.paymentMethod !== ''){
            vnpParams['vnp_BankCode'] = reqData.paymentMethod;
        }
    
        // Sắp xếp tham số
        const sortedParams = sortObject(vnpParams);
    
        // Tạo chuỗi ký hiệu
        const signData = querystring.stringify(sortedParams, { encode: false });
    
        // Tạo chữ ký bảo mật
        const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        sortedParams.vnp_SecureHash = signed;

        console.log("sent");
        console.log(sortedParams);

        let vnpUrl = vnpayConfig.vnp_Url;
        vnpUrl += '?' + querystring.stringify(sortedParams, { encode: false });
        // console.log(vnpUrl);
        
        return vnpUrl;
    },

    verifyPayment: async (vnpParams) => {
        const secureHash = vnpParams['vnp_SecureHash'];

        // Loại bỏ các tham số không cần thiết
        delete vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHashType'];

        // Sắp xếp tham số
        const sortedParams = sortObject(vnpParams);
        console.log("sortedParams");
        console.log(sortedParams);

        // Tạo chữ ký bảo mật
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        //console.log(signed);

        // So sánh chữ ký
        if (secureHash === signed) {
            const responseCode = vnpParams['vnp_ResponseCode'];
            return { isValid: true, code: responseCode };
        } else {
            return { isValid: false, code: '97' };
        }
    },
    
    getNextOrderId: async () => {
        try {
            const maxOrder = await prisma.orders.findFirst({
                orderBy: {
                    order_id: 'desc',
                },
                select: {
                    order_id: true,
                },
            });

            // Nếu không có bản ghi nào trong bảng Orders, bắt đầu từ 1
            return maxOrder ? maxOrder.order_id + 1 : 1;
        } catch (error) {
            console.error('Error fetching max order_id:', error);
            throw new Error('Failed to fetch next order_id');
        }
    },

    fetchCartItems: async (userId) => {
        const cartItems = await prisma.userCart.findMany({
            where: { user_id: userId },
            include: { Product: true }, // Bao gồm thông tin sản phẩm nếu cần
        });

        if (!cartItems || cartItems.length === 0) {
            throw new Error('Cart is empty');
        }

        return cartItems;
    },

    createOrder: async (userId, orderId, totalAmount, success, shippingAddress) => {
        if (success){
            stat = 'Processing';
        }
        else{
            stat = 'Cancelled';
        }
        return prisma.orders.create({
            data: {
                order_id: orderId,
                user_id: userId,
                total_amount: totalAmount,
                status: stat,
                creation_time: new Date(),
                shipping_address: shippingAddress,
            },
        });
    },

    createOrderDetails: async (orderId, cartItems) => {
        const orderDetailsData = cartItems.map(item => ({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
        }));

        await prisma.orderDetail.createMany({
            data: orderDetailsData,
        });
    },

    clearCart: async (userId) => {
        await prisma.userCart.deleteMany({
            where: { user_id: userId },
        });
    },

    completeOrder: async (userId, orderId, amount, payDate, success, shippingAddress) => {
        try {
            // 1. Lấy danh sách sản phẩm trong giỏ hàng
            const cartItems = await paymentService.fetchCartItems(userId);
            amount = amount / 25400;
    
            if (!cartItems || cartItems.length === 0) {
                throw new Error('Cart is empty');
            }
    
            // 3. Tạo đơn hàng
            const newOrder = await paymentService.createOrder(userId, orderId, amount, success, shippingAddress);
    
            // 4. Tạo chi tiết đơn hàng
            await paymentService.createOrderDetails(newOrder.order_id, cartItems);
    
            if (success){
                // 5. Thêm thông tin thanh toán
                await prisma.payments.create({
                    data: {
                        order_id: newOrder.order_id,
                        payment_date: payDate,
                        amount: amount,
                        payment_method: 'VNPay', // Hoặc phương thức thanh toán phù hợp
                    },
                });

                // 6. Xóa giỏ hàng
                await paymentService.clearCart(userId);
            }

            return newOrder; // Trả về thông tin đơn hàng
        } catch (error) {
            console.error('Error completing order:', error.message);
            throw new Error('Failed to complete order');
        }
    },
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;

    // Lấy tất cả các khóa của đối tượng
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(key); // Lưu trữ khóa chưa mã hóa
        }
    }

    // Sắp xếp các khóa
    str.sort();

    // Tạo đối tượng đã sắp xếp với giá trị đã mã hóa
    for (key = 0; key < str.length; key++) {
        // Mã hóa giá trị của tham số, thay %20 bằng dấu cộng
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }

    return sorted;
}

module.exports = paymentService;
