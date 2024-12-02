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
    // getOrders: (id) =>
    //     prisma.Orders.findMany({
    //         where: {
    //             user_id: id,
    //         },
    //     }),

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
                },
            },
            
        }),

    getProducts: (startIndex, PRODUCTS_PER_PAGE,userID) =>
        prisma.OrderDetail.findMany({
            skip: startIndex,
            take: PRODUCTS_PER_PAGE,
            where: {
                Orders: {
                    user_id: userID, // Điều kiện lọc theo user_id
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
      
}

module.exports = Profile;