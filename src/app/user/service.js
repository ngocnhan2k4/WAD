const { use } = require("passport");
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
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const gmt7 = new Date(utc + 7 * 3600000);

        return prisma.User.create({
            data: {
                username: email,
                password: password,
                fullName: fullName,
                type: "local",
                verificationToken: Token,
                role: "user",
                registration_time: gmt7,
                user_image: "/images/avatar/avatar_placeholder.png",
                state: "noban",
            },
        });
    },
    createUserGoogle: (fullName, socialId, email, image) => {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const gmt7 = new Date(utc + 7 * 3600000);

        return prisma.User.create({
            data: {
                fullName: fullName,
                type: "google",
                socialId: socialId,
                verified: true,
                username: email,
                role: "user",
                registration_time: gmt7,
                user_image: image,
                state: "noban",
            },
        });
    },
    createUserGithub: (fullName, socialId, email, image) => {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const gmt7 = new Date(utc + 7 * 3600000);
        if (email == null) {
            email = "No email";
        }
        return prisma.User.create({
            data: {
                fullName: fullName,
                type: "github",
                socialId: socialId,
                verified: true,
                username: email,
                role: "user",
                registration_time: gmt7,
                user_image: image,
                state: "noban",
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
