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
                Categories: true, // Bao gồm thông tin danh mục
                Suppliers: true, // Sửa lại từ 'Manufacturer' thành 'Suppliers'
                OrderDetail: true, // Nếu bạn muốn bao gồm OrderDetail, thì bỏ dấu '?' đi
                Reviews: true, // Nếu bạn muốn bao gồm Reviews, thì bỏ dấu '?' đi
                UserCart: true, // Nếu bạn muốn bao gồm UserCart, thì bỏ dấu '?' đi
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
};

module.exports = Product;
