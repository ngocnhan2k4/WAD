const prisma = require('../../config/database/db.config');

const Product = {
    getAll: (startIndex,PRODUCTS_PER_PAGE, orderBy, where) => prisma.product.findMany({
        skip:startIndex,
        take: PRODUCTS_PER_PAGE,
        orderBy: orderBy,
        where: where,
        include: {
            Images: {
                select: {
                    directory_path: true // Chỉ lấy đường dẫn hình ảnh
                }
            }
        }
    }),
    getNumOfProduct: (where) => prisma.product.count({
        where: where
    }),
    getBrands: () => prisma.Suppliers.findMany({
        distinct: ['brand'],
        select: {
            brand: true
        }
    }),
    getCategories: () => prisma.Categories.findMany({
        distinct: ['category_name'],
        select: {
            category_name: true
        }
    }),
}

module.exports = Product;