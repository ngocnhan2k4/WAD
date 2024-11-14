const prisma = require('../../config/database/db.config');

const Product = {
    getAll: (startIndex,PRODUCTS_PER_PAGE, orderBy, where) => prisma.product.findMany({
        skip:startIndex,
        take: PRODUCTS_PER_PAGE,
        orderBy: orderBy,
        where: where
    }),
    getNumOfProduct: (where) => prisma.product.count({
        where: where
    }),
    getBrands: () => prisma.product.findMany({
        distinct: ['brand'],
        select: {
            brand: true
        }
    }),
    getCategories: () => prisma.product.findMany({
        distinct: ['category'],
        select: {
            category: true
        }
    }),
}

module.exports = Product;