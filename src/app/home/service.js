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
};

module.exports = Home;