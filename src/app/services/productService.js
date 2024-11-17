const prisma = require("../../config/database/db.config");

const Product = {
    getAll: (startIndex, PRODUCTS_PER_PAGE, orderBy, where) =>
        prisma.product.findMany({
            skip: startIndex,
            take: PRODUCTS_PER_PAGE,
            orderBy: orderBy,
            where: where,
            include: {
                Images: {
                    select: {
                        directory_path: true, // Chỉ lấy đường dẫn hình ảnh
                    },
                },
                
            },
        }),
    getNumOfProduct: (where) =>
        prisma.product.count({
            where: where,
        }),
    getBrands: () =>
        prisma.suppliers.findMany({
            distinct: ["brand"],
            select: {
                brand: true,
            },
        }),
    getCategories: () =>
        prisma.categories.findMany({
            distinct: ["category_name"],
            select: {
                category_name: true,
            },
        }),

    getProductById: async (id) => {
        return prisma.product.findUnique({
            where: { product_id: parseInt(id) },
            include: {
                Suppliers: {
                    select: {
                        brand: true, // Lấy tên brand từ bảng Suppliers
                    },
                },
                Categories: {
                    select: {
                        category_name: true, // Lấy tên danh mục
                    },
                },
                Images: {
                    select: {
                        directory_path: true, // Lấy danh sách hình ảnh
                    },
                },
                Reviews: {
                    select: {
                        review_detail: true, // Lấy nội dung review
                    },
                },
            },
        });
    },

    getRelatedProducts: async (category_id, product_id) => {
        if (!category_id) return [];
        return prisma.product.findMany({
            where: {
                category_id: category_id,
                NOT: { product_id: product_id }, // Loại trừ sản phẩm hiện tại
            },
            select: {
                product_id: true,
                product_name: true,
                current_price: true,
                original_price: true,
                Images: {
                    select: {
                        directory_path: true,
                    },
                },
            },
            take: 4, // Lấy tối đa 5 sản phẩm liên quan
        });
    },

    getNumOfReviews: async (productId) => {
        return prisma.reviews.count({
            where: {
                product_id: parseInt(productId), // Sử dụng giá trị productId từ tham số truyền vào
            }
        });
    },
    
    getReviews: async (productId, startIndex = 0, limit = 5) => {
        if (!productId) return [];
        return prisma.reviews.findMany({
            where: { product_id: parseInt(productId) },
            skip: startIndex,
            take: limit,
            include: {
                User: {
                    select: {
                        fullname: true, 
                    },
                },
            },
        });
    },
};

module.exports = Product;
