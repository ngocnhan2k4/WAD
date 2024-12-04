const querystring = require('qs');
const crypto = require('crypto');
const moment = require('moment');
const vnpayConfig = require("../../config/vnpayConfig");
const prisma = require("../../config/database/db.config");
const axios = require('axios');

const paymentService = {
    createPayment: async (totalAmount, clientIp, bankCode) => {
        const date = new Date();
        const orderId = moment(date).format('DDHHmmss'); // Định dạng orderId
        const ipv4Address = clientIp.includes(':') ? '127.0.0.1' : clientIp;

        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_Amount: totalAmount * 100 * 25400, // VNPay yêu cầu đơn vị là đồng
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Payment for order: ${orderId}`, // Mô tả đơn hàng
            vnp_Locale: 'vn',
            vnp_OrderType: 'other',
            vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl, // URL trả về sau thanh toán
            vnp_IpAddr: ipv4Address,
            vnp_CreateDate: moment(date).format('YYYYMMDDHHmmss'),
            vnp_BankCode: 'NCB', // Thêm mã ngân hàng NCB
        };
        // if(bankCode !== null && bankCode !== ''){
        //     vnpParams['vnp_BankCode'] = bankCode;
        // }
    
        // Sắp xếp tham số
        const sortedParams = sortObject(vnpParams);
    
        // Tạo chuỗi ký hiệu
        const signData = querystring.stringify(sortedParams, { encode: false });
    
        // Tạo chữ ký bảo mật
        const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        sortedParams.vnp_SecureHash = signed;
        console.log(sortedParams);

        let vnpUrl = vnpayConfig.vnp_Url; // Đảm bảo vnp_Url đã có cấu hình đúng
        vnpUrl += '?' + querystring.stringify(sortedParams, { encode: false });
        
        return vnpUrl;
    
        // // Gửi yêu cầu đến VNPay để tạo token
        // try {
        //     // Gửi yêu cầu POST đến VNPay API
        //     const response = await axios.post(
        //         vnpayConfig.vnp_TokenApiUrl,  // Đảm bảo URL là đúng
        //         querystring.stringify(sortedParams),  // Đảm bảo sortedParams là chuỗi tham số đúng định dạng
        //         { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        //     );
    
        //     // Kiểm tra nếu phản hồi trả về có token
        //     if (response && response.data && response.data.token) {
        //         console.log(response);
        //         const paymentUrl = `${vnpayConfig.vnp_Url}/Transaction/PaymentMethod.html?token=${response.data.token}`;
        //         return paymentUrl;
        //     } else {
        //         throw new Error('Failed to create payment token');
        //     }
        // } catch (error) {
        //     // Kiểm tra nếu có lỗi và in thông báo lỗi chi tiết
        //     // Xử lý lỗi và in thông báo chi tiết
        //     if (error.response) {
        //         console.error('Error from VNPay API:', error.response.data);
        //     } else {
        //         console.error('Error creating VNPay payment:', error.message);
        //     }
        //     throw error; // Ném lỗi để xử lý ở controller
        // }
    },

    getCartTotal: (userId) =>
        prisma.userCart.aggregate({
            where: { user_id: userId },
            _sum: { price: true },
        }),

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

    verifyPayment: async (vnpParams) => {
        const secureHash = vnpParams['vnp_SecureHash'];

        // Loại bỏ các tham số không cần thiết
        delete vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHashType'];

        // Sắp xếp tham số
        const sortedParams = Object.keys(vnpParams)
            .sort()
            .reduce((acc, key) => {
                acc[key] = vnpParams[key];
                return acc;
            }, {});

        // Tạo chữ ký bảo mật
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        // So sánh chữ ký
        if (secureHash === signed) {
            const responseCode = vnpParams['vnp_ResponseCode'];
            return { isValid: true, code: responseCode };
        } else {
            return { isValid: false, code: '97' };
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

    createOrder: async (userId, orderId, totalAmount) => {
        return prisma.orders.create({
            data: {
                order_id: orderId,
                user_id: userId,
                total_amount: totalAmount,
                status: 'Completed',
                creation_time: new Date(),
                // mising shipping address
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

    completeOrder: async (userId, orderId, amount, payDate) => {
        try {
            // 1. Lấy danh sách sản phẩm trong giỏ hàng
            const cartItems = await paymentService.fetchCartItems(userId);
    
            if (!cartItems || cartItems.length === 0) {
                throw new Error('Cart is empty');
            }
    
            // 2. Tính tổng tiền từ giỏ hàng
            const totalAmountResult = await paymentService.getCartTotal(userId);
            const totalAmount = totalAmountResult._sum.price || 0;
    
            // 3. Tạo đơn hàng
            const newOrder = await paymentService.createOrder(userId, orderId, totalAmount);
    
            // 4. Tạo chi tiết đơn hàng
            await paymentService.createOrderDetails(newOrder.order_id, cartItems);
    
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
