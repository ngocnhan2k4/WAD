const prisma = require("../../config/database/db.config");

function funcountSearch(user_search) {
    return prisma.User.count({
        where: user_search
            ? {
                  OR: [
                      {
                          username: {
                              contains: user_search,
                              mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                          },
                      },
                      {
                          fullName: {
                              contains: user_search,
                              mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                          },
                      },
                  ],
              }
            : undefined, // Nếu `user_search` không có giá trị, bỏ qua `where`
    });
}

const User = {
    getAll: () => prisma.User.findMany(),
    getAllUser: () => prisma.User.findMany(),
    getUserById: (id) => {
        id = Number(id);
        return prisma.User.findUnique({
            where: {
                id: id,
            },
        });
    },
    getTotalPayment: async (id) => {
        id = Number(id);
        let payments = await prisma.Orders.aggregate({
            where: {
                user_id: id,
                status: "Completed",
            },
            _sum: {
                total_amount: true,
            },
        });

        payments = payments._sum.total_amount || 0;

        let total = await prisma.Orders.aggregate({
            where: {
                user_id: id,
                status: "Completed",
            },
            _count: true,
        });
        total = total._count || 0;
        const result = {
            total: total,
            payments: payments,
        };
        return result;
    },
    getCateFavorite: async (id) => {
        id = Number(id);
        const orders = await prisma.Orders.findMany({
            where: {
                user_id: id,
                status: "Completed",
            },
            include: {
                OrderDetail: {
                    include: {
                        Product: {
                            include: {
                                Categories: true,
                            },
                        },
                    },
                },
            },
        });
        const cate = {};
        orders.forEach((order) => {
            order.OrderDetail.forEach((detail) => {
                const product = detail.Product;
                if (cate[product.category_id] === undefined) {
                    cate[product.category_id] = {
                        id: product.category_id,
                        name: product.Categories.category_name,
                        count: detail.quantity,
                    };
                } else {
                    cate[product.category_id].count += detail.quantity;
                }
            });
        });

        const favorite = Object.values(cate);
        favorite.sort((a, b) => b.count - a.count);
        if (favorite.length === 0) {
            return {
                id: 0,
                category: "Haven't purchased yet",
                count: 0,
            };
        }
        return {
            id: favorite[0].id,
            category: favorite[0].name,
            count: favorite[0].count,
        };
    },
    getManufacFavorite: async (id) => {
        id = Number(id);
        const orders = await prisma.Orders.findMany({
            where: {
                user_id: id,
                status: "Completed",
            },
            include: {
                OrderDetail: {
                    include: {
                        Product: {
                            include: {
                                Suppliers: true,
                            },
                        },
                    },
                },
            },
        });
        const manufac = {};
        orders.forEach((order) => {
            order.OrderDetail.forEach((detail) => {
                const product = detail.Product;
                if (manufac[product.manufacturer] === undefined) {
                    manufac[product.manufacturer] = {
                        id: product.manufacturer,
                        name: product.Suppliers.brand,
                        count: detail.quantity,
                    };
                } else {
                    manufac[product.manufacturer].count += detail.quantity;
                }
            });
        });
        const favorite = Object.values(manufac);
        favorite.sort((a, b) => b.count - a.count);
        if (favorite.length === 0) {
            return {
                id: 0,
                manufacturer: "Haven't purchased yet",
                count: 0,
            };
        }
        return {
            id: favorite[0].id,
            manufacturer: favorite[0].name,
            count: favorite[0].count,
        };
    },
    getProductFavorite: async (id) => {
        id = Number(id);
        const orders = await prisma.Orders.findMany({
            where: {
                user_id: id,
                status: "Completed",
            },
            include: {
                OrderDetail: {
                    include: {
                        Product: true,
                    },
                },
            },
        });
        const product = {};
        orders.forEach((order) => {
            order.OrderDetail.forEach((detail) => {
                const product_id = detail.product_id;
                if (product[product_id] === undefined) {
                    product[product_id] = {
                        id: product_id,
                        name: detail.Product.product_name,
                        count: detail.quantity,
                    };
                } else {
                    product[product_id].count += detail.quantity;
                }
            });
        });
        const favorite = Object.values(product);
        favorite.sort((a, b) => b.count - a.count);
        if (favorite.length === 0) {
            return {
                id: 0,
                product: "Haven't purchased yet",
                count: 0,
            };
        }
        return {
            id: favorite[0].id,
            product: favorite[0].name,
            count: favorite[0].count,
        };
    },
    getTenUser: () =>
        prisma.User.findMany({
            take: 10,
        }),
    getCountUser: async () => {
        const count = await prisma.User.count();
        return count;
    },
    countSearch: async (user_search) => {
        return await funcountSearch(user_search);
    },
    sortUser: async (criteria) => {
        const count = await funcountSearch(criteria.user_search);
        if (criteria.page > Math.ceil(count / 10)) {
            criteria.page = Math.ceil(count / 10);
        }
        const validFields = [
            "fullName",
            "username",
            "registration_time",
            "role",
            "state",
        ];
        if (criteria.key === "") {
            return prisma.User.findMany({
                take: 10,
                skip: (criteria.page - 1) * 10,
                where: criteria.user_search
                    ? {
                          OR: [
                              {
                                  username: {
                                      contains: criteria.user_search,
                                      mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                                  },
                              },
                              {
                                  fullName: {
                                      contains: criteria.user_search,
                                      mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                                  },
                              },
                          ],
                      }
                    : undefined, // Không áp dụng điều kiện nếu `user_search` rỗng
            });
        }
        if (!validFields.includes(criteria.key)) {
            throw new Error(`Invalid sorting field: ${criteria.key}`); // Sửa "hrow" thành "throw"
        }
        const key = criteria.key;
        const order = criteria.order;
        return prisma.User.findMany({
            take: 10,
            skip: (criteria.page - 1) * 10,
            where: criteria.user_search
                ? {
                      OR: [
                          {
                              username: {
                                  contains: criteria.user_search,
                                  mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                              },
                          },
                          {
                              fullName: {
                                  contains: criteria.user_search,
                                  mode: "insensitive", // Không phân biệt chữ hoa, chữ thường
                              },
                          },
                      ],
                  }
                : undefined, // Không áp dụng điều kiện nếu không có user_search
            orderBy: {
                [key]: order,
            },
        });
    },
    updateUser: async (id, role, state) => {
        if (role !== "user" && role !== "admin") {
            throw new Error(`Invalid role: ${role}`);
        }
        return prisma.User.update({
            where: {
                id: id,
            },
            data: {
                role: role,
                state: state,
            },
        });
    },
    getBoughtProducts: async (id) => {
        id = Number(id);
        const orders = await prisma.Orders.findMany({
            where: {
                user_id: id,
                status: "Completed",
            },
            include: {
                OrderDetail: {
                    include: {
                        Product: {
                            include: {
                                Images: true,
                            },
                        },
                    },
                },
            },
        });
        const products = [];
        orders.forEach((order) => {
            order.OrderDetail.forEach((detail) => {
                if (
                    !products.some(
                        (product) =>
                            product.product_id === detail.Product.product_id
                    )
                ) {
                    products.push(detail.Product);
                }
            });
        });
        return products;
    },
    searchProducts: async (search) => {
        if (!search) search = "";
        return prisma.Product.findMany({
            where: {
                product_name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            select: {
                product_id: true,
            },
        });
    },
};

module.exports = User;
