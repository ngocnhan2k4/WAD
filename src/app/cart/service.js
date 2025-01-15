const prisma = require("../../config/database/db.config");

const Cart = {
    getUserCart: async (userId, cartCookie) => {
        try {
            if (userId != null) {
                // Nếu có userId, lấy từ bảng userCart
                return await prisma.userCart.findMany({
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
                // Xử lý cho dữ liệu từ cookies
                const productIds = cartCookie.map(item => item.product_id);
    
                // Truy vấn thông tin sản phẩm từ database
                const products = await prisma.Product.findMany({
                    where: { product_id: { in: productIds } },
                    include: {
                        Suppliers: true,
                        Images: true,
                    },
                });
    
                // Map cookies với thông tin sản phẩm
                cartItems = cartCookie.map(item => {
                    const product = products.find(p => p.product_id === item.product_id);
                    return {
                        ...item,
                        Product: product || null, // Gắn dữ liệu sản phẩm
                    };
                });
            }

            console.log(cartItems)
    
            return cartItems;
        } catch (error) {
            console.error("Error fetching cart items:", error);
            throw error;
        }
    },

    getCartTotal: async (userId, cartCookie) => {
        try {
            if (userId != null) {
                // Nếu có userId, lấy từ bảng userCart
                const subtotalData = await prisma.userCart.aggregate({
                    where: { user_id: userId },
                    _sum: { price: true },
                });
                return subtotalData._sum.price || 0;
            } else {
                // Nếu không có userId, tính từ cookies
                const subtotal = cartCookie.reduce((sum, item) => sum + item.price, 0);
                return subtotal;
            }
        } catch (error) {
            console.error("Error calculating cart total:", error);
            throw error;
        }
    },

    getNumOfCartItems: async (userId, cartCookie) => {
        try {
            let totalQuantity = 0;
    
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
                // Nếu không có userId, tính tổng quantity từ cookies
                totalQuantity = cartCookie.reduce((sum, item) => sum + item.quantity, 0);
            }
    
            return totalQuantity;
        } catch (error) {
            console.error("Error calculating total quantity:", error);
            throw error;
        }
    }, 

    updateCartItemQuantity: async (userId, productId, quantity, rowSubtotal, cartCookie) => {
        try {
            if (userId != null) {
                // Nếu có userId, cập nhật trên bảng userCart
                await prisma.userCart.updateMany({
                    where: {
                        user_id: userId,
                        product_id: productId,
                    },
                    data: {
                        quantity: quantity,
                        price: rowSubtotal,
                    },
                });
                return null; // Không cần cập nhật cookies
            } else {
                // Nếu không có userId, cập nhật trong cookies
                const updatedCart = cartCookie.map(item =>
                    item.product_id === productId
                        ? { ...item, quantity, price: rowSubtotal }
                        : item
                );
                return updatedCart;
            }
        } catch (err) {
            console.error("Error updating cart item quantity:", err);
            throw new Error("Error updating quantity");
        }
    },

    addProductToCart: async (userId, productId, quantity, cartCookie) => {
        try {
            const product = await prisma.product.findUnique({
                where: {
                    product_id: productId,
                },
            });
    
            if (!product) {
                throw new Error("Product not found");
            }
    
            if (userId != null) {
                // Logic khi người dùng đã đăng nhập
                const existingItem = await prisma.userCart.findUnique({
                    where: {
                        user_id_product_id: {
                            user_id: userId,
                            product_id: productId,
                        },
                    },
                });
    
                if (existingItem) {
                    return await prisma.userCart.update({
                        where: {
                            user_id_product_id: {
                                user_id: userId,
                                product_id: productId,
                            },
                        },
                        data: {
                            quantity: existingItem.quantity + quantity,
                            price: product.current_price * (existingItem.quantity + quantity),
                        },
                    });
                } else {
                    return await prisma.userCart.create({
                        data: {
                            user_id: userId,
                            product_id: productId,
                            quantity: quantity,
                            price: product.current_price,
                        },
                    });
                }
            } else {
                // Logic khi người dùng chưa đăng nhập
                const existingItemIndex = cartCookie.findIndex(item => item.product_id === productId);
    
                if (existingItemIndex !== -1) {
                    cartCookie[existingItemIndex].quantity += quantity;
                    cartCookie[existingItemIndex].price = product.current_price * cartCookie[existingItemIndex].quantity;
                } else {
                    cartCookie.push({
                        product_id: productId,
                        quantity: quantity,
                        price: product.current_price,
                    });
                }
    
                return cartCookie; // Trả về giỏ hàng đã cập nhật
            }
        } catch (err) {
            console.error("Error adding product to cart:", err);
            throw new Error("Error adding product to cart");
        }
    }, 

    deleteProductFromCart: async (userId, productId, cartCookie) => {
        try {
            if (userId != null) {
                // Nếu có userId, xóa sản phẩm khỏi bảng userCart
                await prisma.userCart.deleteMany({
                    where: {
                        user_id: userId,
                        product_id: productId,
                    },
                });
                return null; // Trả về null vì không cần cập nhật cookies
            } else {
                // Nếu không có userId, xóa sản phẩm khỏi cookies
                const updatedCart = cartCookie.filter(item => item.product_id !== productId);
                return updatedCart;
            }
        } catch (err) {
            console.error("Error deleting product from cart:", err);
            throw new Error("Error deleting product");
        }
    },  

    checkCart: async (userId, cartCookie) => {
        try {
            let cartItems;
    
            if (userId != null) {
                // Nếu có userId, lấy giỏ hàng từ bảng userCart
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
                // Nếu không có userId, xử lý dữ liệu từ cookies
                const productIds = cartCookie.map(item => item.product_id);
    
                // Truy vấn dữ liệu sản phẩm từ cơ sở dữ liệu
                const products = await prisma.product.findMany({
                    where: { product_id: { in: productIds } },
                    include: {
                        Suppliers: true,
                        Images: true,
                    },
                });
    
                // Gắn thông tin sản phẩm vào dữ liệu từ cookies
                cartItems = cartCookie.map(item => {
                    const product = products.find(p => p.product_id === item.product_id);
                    return {
                        ...item,
                        Product: product || null, // Gắn dữ liệu sản phẩm nếu tìm thấy
                    };
                });
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
