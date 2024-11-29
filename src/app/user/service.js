const bcrypt = require("bcrypt");
const prisma = require("../../config/database/db.config");
const { DateTime } = require("luxon");
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

    createUserLocal: async (email, password, fullName, Token) => {
        const gmt7 = DateTime.now().setZone("Asia/Bangkok").toJSDate();

        const hashedPassword = bcrypt.hashSync(password, 10);

        try {
            return await prisma.User.create({
                data: {
                    username: email,
                    password: hashedPassword,
                    fullName: fullName,
                    type: "local",
                    verificationToken: Token,
                    role: "user",
                    registration_time: gmt7,
                    user_image: "/images/avatar/avatar_placeholder.png",
                    state: "noban",
                },
            });
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    },
    createUserGoogle: (fullName, socialId, email, image) => {
        const gmt7 = DateTime.now().setZone("Asia/Bangkok").toJSDate();

        return prisma.User.create({
            data: {
                fullName: fullName,
                type: "google",
                socialId: socialId,
                verified: true,
                username: email,
                role: "user",
                registration_time: gmt7,
                user_image: image || "/images/avatar/avatar_placeholder.png",
                state: "noban",
            },
        });
    },
    createUserGithub: (fullName, socialId, email, image) => {
        const gmt7 = DateTime.now().setZone("Asia/Bangkok").toJSDate();
        return prisma.User.create({
            data: {
                fullName: fullName,
                type: "github",
                socialId: socialId,
                verified: true,
                username: email,
                role: "user",
                registration_time: gmt7,
                user_image: image || "/images/avatar/avatar_placeholder.png",
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
    findUserByUsernameAndPassWord: async (username, password) => {
        const user = await prisma.User.findFirst({
            where: { username: username },
        });

        if (!user) {
            return null;
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (isMatch) {
            return user;
        }

        return null;
    },
};

module.exports = User;
