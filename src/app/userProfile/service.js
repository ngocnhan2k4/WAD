const prisma = require("../../config/database/db.config");
const bcrypt = require("bcrypt");

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
    getNumOfOrders: (id)=>
        prisma.Orders.count({
            where: {
                user_id: id,
            },
        }),

    getNumOfProducts: (userID) =>
        prisma.OrderDetail.count({
            where: {
                Orders: {
                    user_id: userID, // Điều kiện lọc theo user_id
                    status:'Completed',
                },
            },
            
        }),

    getProducts: (startIndex, PRODUCTS_PER_PAGE,userID) =>
        prisma.OrderDetail.findMany({
            skip: startIndex,
            take: PRODUCTS_PER_PAGE,
            where: {
                Orders: {
                    user_id: userID, 
                    status:'Completed',
                },
            },
            include: {
                Product:{
                    include:{
                        Images:true,
                    },
                },
                Orders: true,
            },
        }),
    getOrders: (startIndex, ORDERS_PER_PAGE, id) =>
        prisma.Orders.findMany({
            skip: startIndex,
            take: ORDERS_PER_PAGE,
            where: {
                user_id: id,
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
    findUserId: (id) =>
        prisma.userdetail.findUnique({
            where: {
                user_id: id,
            },
        }),
    updateProfile:(userid,name, gender, phone, addr, birthday) =>
        prisma.userdetail.update({
            where: {
                user_id: userid,
            },
            data: {
                full_name: name,
                gender:gender,
                phone:phone,
                address:addr,
                birthday:new Date(birthday)
            },}),
    createProfile:(userid,name, gender, phone, addr, birthday) =>
        prisma.userdetail.create({
            data: {
                user_id: userid,
                full_name: name,
                gender:gender,
                phone:phone,
                address:addr,
                birthday:new Date(birthday)
            },}),
    getUserDetail: (userid) =>
        prisma.userdetail.findFirst({
            where: {
                user_id: userid,
            },
        })

}

module.exports = Profile;