const prisma = require("../../config/database/db.config");


const Profile ={
    updateImage: (id, image) =>
        prisma.User.update({
            where: {
                id: id,
            },
            data: {
                user_image: image,
            },
        }),
}

module.exports = Profile;