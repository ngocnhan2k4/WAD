const prisma = require("../../config/database/db.config");

const Cart = {
    getUserCart: async (userId) =>{
        try {
            let cartItems;
            if (userId != null) {
                // Nếu có userId, lấy từ bảng userCart
                cartItems = await prisma.userCart.findMany({
                    where: { user_id: userId },
                    include: {
                        Product: {
                            include: {
                                Suppliers: true,
                                Images: true,
                            },
                        },
                    },
                });
            } else {
                cartItems = await prisma.TempCart.findMany({
                    include: {
                        Product: {
                            include: {
                                Suppliers: true,
                                Images: true,
                            },
                        },
                    },
                });
            }
            return cartItems;
        } catch (error) {
            console.error("Error fetching cart items:", error);
            throw error;
        }
    },

    getCartTotal: async (userId) => {
        try {
            let subtotalData;
            if (userId != null) {
                // Nếu có userId, lấy từ bảng userCart
                subtotalData = await prisma.userCart.aggregate({
                    where: { user_id: userId },
                    _sum: { price: true },
                });
            } else {
                // Nếu không có userId, lấy từ bảng TempCart
                subtotalData = await prisma.TempCart.aggregate({
                    _sum: { price: true },
                });
            }
            const subtotal = subtotalData._sum.price || 0;
            return subtotal;
        } catch (error) {
            console.error("Error calculating cart total:", error);
            throw error;
        }
    },

    getNumOfCartItems: async (userId) => {
        try {
            let totalQuantity;
    
            if (userId != null) {
                // Nếu có userId, tính tổng quantity từ bảng userCart
                const result = await prisma.userCart.aggregate({
                    where: { user_id: userId },
                    _sum: {
                        quantity: true, // Tính tổng quantity
                    },
                });
                totalQuantity = result._sum.quantity || 0; // Nếu không có sản phẩm nào, trả về 0
            } else {
                // Nếu không có userId, tính tổng quantity từ bảng TempCart
                const result = await prisma.tempCart.aggregate({
                    _sum: {
                        quantity: true, // Tính tổng quantity
                    },
                });
                totalQuantity = result._sum.quantity || 0; // Nếu không có sản phẩm nào, trả về 0
            }
    
            return totalQuantity;
        } catch (error) {
            console.error("Error calculating total quantity:", error);
            throw error;
        }
    },   

    updateCartItemQuantity: async (userId, productId, quantity, rowSubtotal) => {
        try {
            let updatedItem;
    
            if (userId != null) {
                // Nếu có userId, cập nhật trên bảng userCart
                updatedItem = await prisma.userCart.updateMany({
                    where: {
                        user_id: userId, // Điều kiện user_id
                        product_id: productId, // Điều kiện product_id
                    },
                    data: {
                        quantity: quantity, // Cập nhật số lượng mới
                        price: rowSubtotal, // Lưu rowSubtotal vào cột price
                    },
                });
            } else {
                // Nếu không có userId, cập nhật trên bảng TempCart
                updatedItem = await prisma.tempCart.updateMany({
                    where: {
                        product_id: productId, // Điều kiện product_id
                    },
                    data: {
                        quantity: quantity, // Cập nhật số lượng mới
                        price: rowSubtotal, // Lưu rowSubtotal vào cột price
                    },
                });
            }
    
            return updatedItem;
        } catch (err) {
            console.error("Error updating cart item quantity:", err);
            throw new Error("Error updating quantity");
        }
    },

    addProductToCart: async (userId, productId, quantity) => {
        try {
            // Lấy thông tin sản phẩm để lấy giá
            const product = await prisma.product.findUnique({
                where: {
                    product_id: productId,
                },
            });
    
            if (!product) {
                throw new Error("Product not found");
            }
    
            // Kiểm tra nếu có userId
            if (userId != null) {
                // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng của người dùng
                const existingItem = await prisma.userCart.findUnique({
                    where: {
                        user_id_product_id: {
                            user_id: userId,
                            product_id: productId,
                        },
                    },
                });
    
                if (existingItem) {
                    // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                    return await prisma.userCart.update({
                        where: {
                            user_id_product_id: {
                                user_id: userId,
                                product_id: productId,
                            },
                        },
                        data: {
                            quantity: existingItem.quantity + quantity,
                            price: product.current_price * (existingItem.quantity + quantity), // Cập nhật giá hiện tại
                        },
                    });
                } else {
                    // Nếu sản phẩm chưa tồn tại, thêm mới
                    return await prisma.userCart.create({
                        data: {
                            user_id: userId,
                            product_id: productId,
                            quantity: quantity,
                            price: product.current_price, // Lấy giá từ bảng sản phẩm
                        },
                    });
                }
            } else {
                // Nếu không có userId, thực hiện trên bảng TempCart
                const existingItem = await prisma.tempCart.findUnique({
                    where: {
                        product_id: productId,
                    },
                });
    
                if (existingItem) {
                    // Nếu sản phẩm đã tồn tại trong giỏ tạm, cập nhật số lượng
                    return await prisma.tempCart.update({
                        where: {
                            product_id: productId,
                        },
                        data: {
                            quantity: existingItem.quantity + quantity,
                            price: product.current_price * (existingItem.quantity + quantity), // Cập nhật giá hiện tại
                        },
                    });
                } else {
                    // Nếu sản phẩm chưa tồn tại trong giỏ tạm, thêm mới
                    return await prisma.tempCart.create({
                        data: {
                            product_id: productId,
                            quantity: quantity,
                            price: product.current_price, // Lấy giá từ bảng sản phẩm
                        },
                    });
                }
            }
        } catch (err) {
            console.error("Error adding product to cart:", err);
            throw new Error("Error adding product to cart");
        }
    },  

    deleteProductFromCart: async (userId, productId) => {
        try {
            if (userId != null) {
                // Nếu có userId, xóa sản phẩm khỏi bảng userCart
                await prisma.userCart.deleteMany({
                    where: {
                        user_id: userId,
                        product_id: productId,
                    },
                });
            } else {
                // Nếu không có userId, xóa sản phẩm khỏi bảng TempCart
                await prisma.tempCart.deleteMany({
                    where: {
                        product_id: productId,
                    },
                });
            }
        } catch (err) {
            console.error("Error deleting product from cart:", err);
            throw new Error("Error deleting product");
        }
    },    

    checkCart: async (userId) => {
        try {
            let cartItems;
    
            if (userId != null) {
                // Nếu có userId, lấy giỏ hàng từ bảng userCart
                cartItems = await prisma.userCart.findMany({
                    where: { user_id: userId },
                });
            } else {
                // Nếu không có userId, lấy giỏ hàng từ bảng TempCart
                cartItems = await prisma.tempCart.findMany();
            }
    
            return cartItems; // Trả về danh sách sản phẩm trong giỏ hàng
        } catch (error) {
            console.error('Error checking cart in service:', error.message);
            throw new Error('Error checking cart');
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
};



module.exports = Cart;
