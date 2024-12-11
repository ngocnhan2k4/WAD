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
        try {
            // Kiểm tra nếu id bị null hoặc undefined
            if (!id) {
                console.error("Invalid ID: ID is null or undefined");
                return null;
            }
    
            // Thực hiện truy vấn với Prisma
            const userDetail = await prisma.userdetail.findUnique({
                where: {
                    user_id: id,
                },
            });
    
            if (!userDetail) {
                console.warn(`No user details found for user_id: ${id}`);
            }
    
            return userDetail;
        } catch (error) {
            console.error("Error in findUserId:", error);
            throw new Error("Database query failed");
        }
    },
    
};

module.exports = Home;