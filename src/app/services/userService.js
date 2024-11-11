const prisma = require("../../config/database/db.config");

const User = {
    getAll: () => prisma.User.findMany(),
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
    createUserLocal: (email, password, fullName, Token) => {
        return prisma.User.create({
            data: {
                username: email,
                password: password,
                fullName: fullName,
                type: "local",
                verificationToken: Token,
            },
        });
    },
    createUserGoogle: (fullName, socialId) => {
        return prisma.User.create({
            data: {
                fullName: fullName,
                type: "google",
                socialId: socialId,
                verified: true,
            },
        });
    },
    findUserBySocialId: (id) =>
        prisma.User.findUnique({
            where: {
                socialId: id,
            },
        }),
    updatePassword: (id, password) =>
        prisma.User.update({
            where: {
                id: id,
            },
            data: {
                password: password,
            },
        }),
    findUserById: (id) =>
        prisma.User.findUnique({
            where: {
                id: id,
            },
        }),

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
    findUserByUsernameAndPassWord: (username, password) =>
        prisma.User.findUnique({
            where: {
                username: username,
                password: password,
            },
        }),
};

module.exports = User;
