const prisma = require("../../config/database/db.config");

const User = {
    findUserByUsername: (username) =>
        prisma.User.findUnique({
            where: {
                username: username,
            },
        }),
    getUserById: (id) =>
        prisma.User.findUnique({
            where: {
                id: id,
            },
        }),
    updatePassword: (id, password) => {
        const hashedPassword = bcrypt.hashSync(password, 10);
        return prisma.User.update({
            where: {
                id: id,
            },
            data: {
                password: hashedPassword,
            },
        });
    },
    verifyUser: (Token) => {
        return prisma.User.updateMany({
            where: {
                verificationToken: Token,
            },
            data: {
                verified: true,
            },
        });
    },
};

module.exports = User;
