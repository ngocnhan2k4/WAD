const prisma = require("../../config/database/db.config");

const Cart = {
    getUserCart: (userId) =>
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
    getCartTotal: (userId) =>
        prisma.userCart.aggregate({
            where: { user_id: userId },
            _sum: { price: true },
        }),
    getNumOfCartItems: (userId) =>
        prisma.userCart.count({
            where: { user_id: userId },
        }),

    updateCartItemQuantity: async (userId, productId, quantity, rowSubtotal) => {
        try {
            // Cập nhật số lượng và giá của sản phẩm trong giỏ hàng
            const updatedItem = await prisma.userCart.updateMany({
                where: {
                    user_id: userId, // Điều kiện user_id
                    product_id: productId, // Điều kiện product_id
                },
                data: {
                    quantity: quantity, // Cập nhật số lượng mới
                    price: rowSubtotal, // Lưu rowSubtotal vào cột price
                },
            });
    
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
    
            // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
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
        } catch (err) {
            console.error("Error adding product to cart:", err);
            throw new Error("Error adding product to cart");
        }
    },    

    deleteProductFromCart: async (userId, productId) => {
        try {
            await prisma.userCart.deleteMany({
                where: {
                    user_id: userId,
                    product_id: productId,
                },
            });
        } catch (err) {
            console.error("Error deleting product from cart:", err);
            throw new Error("Error deleting product");
        }
    },
};



module.exports = Cart;
