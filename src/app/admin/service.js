const prisma = require("../../config/database/db.config");
const { DateTime } = require("luxon");

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

async function countProductsBelongToCategory(category_id) {
    return prisma.Product.count({
        where: {
            category_id: category_id,
        },
    });
}

async function countProductsBelongManufacturer(manufacturer) {
    return prisma.Product.count({
        where: {
            manufacturer: manufacturer,
        },
    });
}
function formatDateSimpleDay(date) {
    if (!date) return "Invalid DateTime";

    try {
        const jsDate = new Date(date);
        const parsedDate = DateTime.fromJSDate(jsDate, { zone: "utc" });
        if (!parsedDate.isValid) {
            console.error("Invalid DateTime:", date);
            return "Invalid DateTime";
        }
        return parsedDate.toFormat("dd/MM");
    } catch (err) {
        console.error("Error parsing date:", date, err);
        return "Invalid DateTime";
    }
}
function formatWeekWithJS(date) {
    if (!date) return "Invalid DateTime";

    const jsDate = new Date(date);
    if (isNaN(jsDate)) {
        console.error("Invalid DateTime:", date);
        return "Invalid DateTime";
    }

    // Lấy tuần và năm
    const firstDayOfYear = new Date(jsDate.getFullYear(), 0, 1);
    const pastDaysOfYear = (jsDate - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil(
        (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
    );

    return `Week ${weekNumber} of ${jsDate.getFullYear()}`;
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
    getCategories: async () => {
        const categories = await prisma.Categories.findMany();
        for (let i = 0; i < categories.length; i++) {
            categories[i].count = await countProductsBelongToCategory(
                categories[i].category_id
            );
        }
        return categories;
    },
    getCategoriesWithoutCount: () => prisma.Categories.findMany(),
    getManufacturers: async () => {
        const manufacturers = await prisma.Suppliers.findMany();
        for (let i = 0; i < manufacturers.length; i++) {
            manufacturers[i].count = await countProductsBelongManufacturer(
                manufacturers[i].supplier_id
            );
        }
        return manufacturers;
    },
    getManufacturersWithoutCount: () => prisma.Suppliers.findMany(),
    updateManuOrCate: async (type, name) => {
        if (type === "category") {
            const cate = await prisma.Categories.findFirst({
                where: {
                    category_name: name,
                },
            });
            if (cate) {
                return null;
            }
            return prisma.Categories.create({
                data: {
                    category_name: name,
                },
            });
        } else if (type === "manufacturer") {
            const manu = await prisma.Suppliers.findFirst({
                where: {
                    brand: name,
                },
            });
            if (manu) {
                return null;
            }
            return prisma.Suppliers.create({
                data: {
                    brand: name,
                },
            });
        } else {
            throw new Error(`Invalid type: ${type}`);
        }
    },
    updateNameManuOrCate: async (type, name, id) => {
        id = Number(id);
        if (type === "category") {
            const cate = await prisma.Categories.findFirst({
                where: {
                    category_name: name,
                },
            });
            if (cate) {
                return null;
            }
            return prisma.Categories.update({
                where: {
                    category_id: id,
                },
                data: {
                    category_name: name,
                },
            });
        } else if (type === "manufacturer") {
            const manu = await prisma.Suppliers.findFirst({
                where: {
                    brand: name,
                },
            });
            if (manu) {
                return null;
            }
            return prisma.Suppliers.update({
                where: {
                    supplier_id: id,
                },
                data: {
                    brand: name,
                },
            });
        } else {
            throw new Error(`Invalid type: ${type}`);
        }
    },
    getCategoryById: async (id) => {
        id = Number(id);
        const category = await prisma.Categories.findUnique({
            where: {
                category_id: id,
            },
        });
        if (!category) {
            return null;
        }
        category.count = await countProductsBelongToCategory(id);
        return category;
    },
    getTotalPayCate: async (id) => {
        id = Number(id);
        let Orders = await prisma.Orders.findMany({
            where: {
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
        let total = 0;
        let count = 0;
        Orders.forEach((order) => {
            order.OrderDetail.forEach((detail) => {
                if (detail.Product.category_id === id) {
                    total += detail.quantity * detail.Product.current_price;
                    count += detail.quantity;
                }
            });
        });
        return {
            total: total,
            count: count,
        };
    },
    getUsersFavoriteCate: async (id) => {
        id = Number(id);
        const users = await prisma.User.findMany();
        const result = [];
        for (let i = 0; i < users.length; i++) {
            const orders = await prisma.Orders.findMany({
                where: {
                    user_id: users[i].id,
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
            if (favorite.length !== 0) {
                if (favorite[0].id === id) {
                    result.push(users[i]);
                }
            }
        }
        return result.length;
    },
    getProductsCate: async (id) => {
        id = Number(id);
        const products = await prisma.Product.findMany({
            where: {
                category_id: id,
            },
            include: {
                Images: true,
            },
        });
        return products;
    },
    getManufacturerById: async (id) => {
        id = Number(id);
        const manufacturer = await prisma.Suppliers.findUnique({
            where: {
                supplier_id: id,
            },
        });
        if (!manufacturer) {
            return null;
        }
        manufacturer.count = await countProductsBelongManufacturer(id);
        return manufacturer;
    },
    getTotalPayManu: async (id) => {
        id = Number(id);
        let Orders = await prisma.Orders.findMany({
            where: {
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
        let total = 0;
        let count = 0;
        Orders.forEach((order) => {
            order.OrderDetail.forEach((detail) => {
                if (detail.Product.manufacturer === id) {
                    total += detail.quantity * detail.Product.current_price;
                    count += detail.quantity;
                }
            });
        });
        return {
            total: total,
            count: count,
        };
    },
    getUsersFavoriteManu: async (id) => {
        id = Number(id);
        const users = await prisma.User.findMany();
        const result = [];
        for (let i = 0; i < users.length; i++) {
            const orders = await prisma.Orders.findMany({
                where: {
                    user_id: users[i].id,
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
            if (favorite.length !== 0) {
                if (favorite[0].id === id) {
                    result.push(users[i]);
                }
            }
        }
        return result.length;
    },
    getProductsManu: async (id) => {
        id = Number(id);
        const products = await prisma.Product.findMany({
            where: {
                manufacturer: id,
            },
            include: {
                Images: true,
            },
        });
        return products;
    },
    deleteProductsFromCategory: async (product_detele) => {
        try {
            for (let i = 0; i < product_detele.length; i++) {
                await prisma.Product.update({
                    where: {
                        product_id: product_detele[i],
                    },
                    data: {
                        category_id: 20, //Category Other
                    },
                });
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    deleteProductsFromManufacturer: async (product_detele) => {
        try {
            for (let i = 0; i < product_detele.length; i++) {
                await prisma.Product.update({
                    where: {
                        product_id: product_detele[i],
                    },
                    data: {
                        manufacturer: 20, //Manufacturer Other
                    },
                });
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    deleteCategory: async (id) => {
        id = Number(id);
        try {
            await prisma.Product.updateMany({
                where: {
                    category_id: id,
                },
                data: {
                    category_id: 20, //Category Other
                },
            });
            await prisma.Categories.delete({
                where: {
                    category_id: id,
                },
            });
            return true;
        } catch (e) {
            return false;
        }
    },
    deleteManufacturer: async (id) => {
        id = Number(id);
        try {
            await prisma.Product.updateMany({
                where: {
                    manufacturer: id,
                },
                data: {
                    manufacturer: 20, //Manufacturer Other
                },
            });
            await prisma.Suppliers.delete({
                where: {
                    supplier_id: id,
                },
            });
            return true;
        } catch (e) {
            return false;
        }
    },
    getAllProducts: () =>
        prisma.Product.findMany({
            include: {
                Images: true,
            },
        }),
    createProduct: async (
        product_name,
        product_price,
        product_quantity,
        product_description,
        category_id,
        manufacturer_id,
        filePaths
    ) => {
        try {
            const gmt7 = DateTime.now().setZone("Asia/Bangkok").toJSDate();
            const product = await prisma.Product.create({
                data: {
                    creation_time: gmt7,
                    product_name: product_name,
                    original_price: Number(product_price),
                    current_price: Number(product_price),
                    stock_quantity: Number(product_quantity),
                    description: product_description,
                    category_id: Number(category_id),
                    total_purchase: 0,
                    manufacturer: Number(manufacturer_id),
                },
            });
            for (let i = 0; i < filePaths.length; i++) {
                await prisma.Images.create({
                    data: {
                        product_id: product.product_id,
                        directory_path: filePaths[i],
                        ordinal_numbers: i + 1,
                    },
                });
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    updateProduct: async (
        product_id,
        product_name,
        original_price,
        current_price,
        product_quantity,
        product_description,
        category_id,
        manufacturer_id,
        filePaths
    ) => {
        try {
            await prisma.Product.update({
                where: {
                    product_id: Number(product_id),
                },
                data: {
                    product_name: product_name,
                    original_price: Number(original_price),
                    current_price: Number(current_price),
                    stock_quantity: Number(product_quantity),
                    description: product_description,
                    category_id: Number(category_id),
                    manufacturer: Number(manufacturer_id),
                },
            });
            await prisma.Images.deleteMany({
                where: {
                    product_id: Number(product_id),
                },
            });
            for (let i = 0; i < filePaths.length; i++) {
                await prisma.Images.create({
                    data: {
                        product_id: Number(product_id),
                        directory_path: filePaths[i],
                        ordinal_numbers: i + 1,
                    },
                });
            }
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    getProductByName: async (product_name) => {
        return prisma.Product.findFirst({
            where: {
                product_name: product_name,
            },
        });
    },
    getProductByNameIncludeImage: async (product_name) => {
        return prisma.Product.findFirst({
            where: {
                product_name: product_name,
            },
            include: {
                Images: true,
            },
        });
    },
    getProductById: async (product_id) => {
        return prisma.Product.findUnique({
            where: {
                product_id: Number(product_id),
            },
            include: {
                Images: true,
                Suppliers: true,
                Categories: true,
            },
        });
    },
    getProductByIdWithoutInclude: async (product_id) => {
        return prisma.Product.findUnique({
            where: {
                product_id: Number(product_id),
            },
        });
    },
    deleteProduct: async (product_id) => {
        try {
            const orderDetails = await prisma.OrderDetail.findMany({
                where: {
                    product_id: Number(product_id),
                },
            });
            if (orderDetails.length > 0) {
                return false;
            }
            const reviews = await prisma.Reviews.findMany({
                where: {
                    product_id: Number(product_id),
                },
            });
            if (reviews.length > 0) {
                return false;
            }
            await prisma.Images.deleteMany({
                where: {
                    product_id: Number(product_id),
                },
            });
            await prisma.Product.delete({
                where: {
                    product_id: Number(product_id),
                },
            });
            return true;
        } catch (e) {
            console.error("Error deleting product:", e);
            return false;
        }
    },
    getAllOrders: () =>
        prisma.Orders.findMany({
            orderBy: {
                creation_time: "desc",
            },
        }),
    updateOrderStatus: async (orderID, status) => {
        try {
            orderID = Number(orderID);
            await prisma.Orders.update({
                where: {
                    order_id: orderID,
                },
                data: {
                    status: status,
                },
            });
            return true;
        } catch (e) {
            return false;
        }
    },
    getOrderById: async (orderID) => {
        orderID = Number(orderID);
        return prisma.Orders.findUnique({
            where: {
                order_id: orderID,
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
                Payments: true,
                User: true,
            },
        });
    },
    getDataRevenueMonth: async () => {
        const orders = await prisma.Orders.findMany({
            where: {
                status: "Completed",
            },
        });
        const data = {};
        orders.forEach((order) => {
            const month = DateTime.fromJSDate(order.creation_time).toFormat(
                "MM"
            );
            if (data[month] === undefined) {
                data[month] = order.total_amount;
            } else {
                data[month] += order.total_amount;
            }
        });
        const keys = Object.keys(data);
        keys.sort((a, b) => (a > b ? -1 : 1));
        const result = {};
        for (let i = 0; i < 5 && i < keys.length; i++) {
            result[Number(keys[i])] = data[keys[i]];
        }
        return result;
    },
    getDataRevenueDay: async () => {
        const orders = await prisma.Orders.findMany({
            where: {
                status: "Completed",
            },
        });
        const data = {};
        orders.forEach((order) => {
            const day = formatDateSimpleDay(order.creation_time);
            if (data[day] === undefined) {
                data[day] = order.total_amount;
            } else {
                data[day] += order.total_amount;
            }
        });
        const keys = Object.keys(data);

        // Sắp xếp theo ngày/tháng
        keys.sort((a, b) => {
            const [dayA, monthA] = a.split("/").map(Number);
            const [dayB, monthB] = b.split("/").map(Number);

            const dateA = new Date(2024, monthA - 1, dayA);
            const dateB = new Date(2024, monthB - 1, dayB);

            return dateA - dateB;
        });

        const result = {};
        for (let i = 0; i < 5 && i < keys.length; i++) {
            result[keys[i]] = data[keys[i]];
        }
        return result;
    },
    getDataRevenueWeek: async () => {
        const orders = await prisma.Orders.findMany({
            where: {
                status: "Completed",
            },
        });
        const data = {};
        orders.forEach((order) => {
            const week = formatWeekWithJS(order.creation_time);
            if (data[week] === undefined) {
                data[week] = order.total_amount;
            } else {
                data[week] += order.total_amount;
            }
        });
        const keys = Object.keys(data);

        // Sắp xếp theo tuần
        keys.sort((a, b) => {
            // Tách chuỗi 'Week 52 of 2024' thành tuần và năm
            const [weekA, yearA] = a.match(/\d+/g).map(Number); // Lấy tất cả số trong chuỗi
            const [weekB, yearB] = b.match(/\d+/g).map(Number);

            // So sánh năm trước, nếu năm giống nhau thì so sánh tuần
            if (yearA === yearB) {
                return weekA - weekB; // Sắp xếp theo tuần
            } else {
                return yearA - yearB; // Sắp xếp theo năm
            }
        });

        const result = {};
        for (let i = 0; i < 5 && i < keys.length; i++) {
            result[keys[i]] = data[keys[i]];
        }
        return result;
    },
};

module.exports = User;
