const prisma = require('../../config/database/db.config');


const User = {
    getAll: () => prisma.User.findMany(),
}

module.exports = User;