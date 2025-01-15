const prisma = require("../../config/database/db.config");

const Home = {
    getNewArrival: async () => {
        try {
            const products = await prisma.product.findMany({
                take: 4, 
                orderBy: {
                    creation_time: 'desc',
                },
                include: {
                    Images: true, 
                    Reviews: true,
                },
            });
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    },

    getRecomended: async () => {
        try {
            const products = await prisma.product.findMany({
                take: 8, 
                orderBy: {
                    creation_time: 'asc', // Có thể sắp xếp ngẫu nhiên hoặc theo thời gian tạo
                },
                include: {
                    Images: true,
                    Reviews: true, 
                },
            });
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    },
    findUserId: async (id) => {
            const userDetail = await prisma.userdetail.findUnique({
                where: {
                    user_id: id,
                },
            });
    
            if (!userDetail) {
                console.warn(`No user details found for user_id: ${id}`);
            }
            return userDetail;
    },
    moveCartItems: async (userId, cartCookie) => {
        try {    
            console.log(cartCookie);
            
            // Dùng map để xử lý từng sản phẩm trong giỏ hàng
            const promises = cartCookie.map(async (item) => {
                const productId = Number(item.product_id);
    
                const existingItem = await prisma.userCart.findUnique({
                    where: {
                        user_id_product_id: {
                            user_id: userId,
                            product_id: productId,  // Sử dụng productId đã chuyển thành kiểu số
                        },
                    },
                });
    
                if (existingItem) {
                    // Nếu sản phẩm đã có, cập nhật số lượng và giá
                    await prisma.userCart.update({
                        where: {
                            user_id_product_id: {
                                user_id: userId,
                                product_id: productId,
                            },
                        },
                        data: {
                            quantity: existingItem.quantity + item.quantity,
                            price: existingItem.price + (item.price * item.quantity),
                        },
                    });
                } else {
                    // Nếu sản phẩm chưa có, thêm mới vào userCart
                    await prisma.userCart.create({
                        data: {
                            user_id: userId,
                            product_id: productId,
                            quantity: item.quantity,
                            price: item.price * item.quantity,
                        },
                    });
                }
            });
    
            // Đợi tất cả các promises hoàn thành trước khi kết thúc
            await Promise.all(promises);
        } catch (error) {
            console.error("Error moving cart items:", error);
            throw new Error("Error moving cart items");
        }
    },    
};

module.exports = Home;