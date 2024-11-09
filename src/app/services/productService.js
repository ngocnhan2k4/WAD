const prisma = require('../../config/database/db.config');


const Product = {
    getAll: () => prisma.Product.findMany(),
}

module.exports = Product;