const User = require("../admin/service");

function formatDateSimple(date) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-US", options);
}
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}
function standardizeDate(label_and_data, type) {
    if (type === "month") {
        const arrayofDate = Object.entries(label_and_data);
        arrayofDate.sort((a, b) => {
            return a[0] - b[0];
        });
        const labels = [];
        const data = [];
        arrayofDate.forEach((date) => {
            if (Number(date[0]) === 1) labels.push("January");
            if (Number(date[0]) === 2) labels.push("February");
            if (Number(date[0]) === 3) labels.push("March");
            if (Number(date[0]) === 4) labels.push("April");
            if (Number(date[0]) === 5) labels.push("May");
            if (Number(date[0]) === 6) labels.push("June");
            if (Number(date[0]) === 7) labels.push("July");
            if (Number(date[0]) === 8) labels.push("August");
            if (Number(date[0]) === 9) labels.push("September");
            if (Number(date[0]) === 10) labels.push("October");
            if (Number(date[0]) === 11) labels.push("November");
            if (Number(date[0]) === 12) labels.push("December");
            data.push(date[1]);
        });
        return { labels: labels, data: data };
    }
}
function createDataNormal(label_and_data, type) {
    if (type === "month") {
        const data = standardizeDate(label_and_data, "month");
        const raw_data = [];
        for (let i = 0; i < data.labels.length; i++) {
            raw_data.push({
                month: data.labels[i],
                revenue: data.data[i],
            });
        }
        return raw_data;
    }
}
function createDataForChart(dataDate, type) {
    if (type === "month") {
        let label = "Monthly Revenue ($)";

        const data = {
            labels: dataDate.labels,
            datasets: [
                {
                    label: label,
                    data: dataDate.data,
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    borderColor: "rgba(76, 175, 80, 1)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
        return data;
    }
    if (type === "day" || type === "week") {
        let label = "Daily Revenue ($)";
        const data = {
            labels: Object.keys(dataDate),
            datasets: [
                {
                    label: label,
                    data: Object.values(dataDate),
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    borderColor: "rgba(76, 175, 80, 1)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
        return data;
    }
}
const Admin = {
    viewAccount: async (req, res) => {
        const user_search = req.query.search ? req.query.search : "";
        let currentPage = req.query.page ? req.query.page : 1;
        if (Number.isNaN(currentPage) || currentPage < 1) {
            currentPage = 1;
        }
        let sort = req.query.sort ? req.query.sort : "";
        let name_sort = sort;
        if (sort === "user_name") {
            sort = "fullName";
        } else if (sort === "user_email") {
            sort = "username";
        } else if (sort === "user_reg") {
            sort = "registration_time";
        } else if (sort === "user_role") {
            sort = "role";
        } else if (sort === "user_state") {
            sort = "state";
        } else {
            sort = "";
        }
        let order = req.query.order;
        if (order === "false") {
            order = "desc";
        } else {
            order = "asc";
        }
        const field = {
            key: sort,
            order: order,
            page: currentPage,
            user_search: user_search,
        };
        const users = await User.sortUser(field);
        const count = await User.countSearch(user_search);
        users.forEach((user) => {
            user.registration_time = formatDateSimple(user.registration_time);
            if (user.username === null && user.type === "github") {
                user.username = "Github account";
            }
            if (user.username === null && user.type === "google") {
                user.username = "Google account";
            }
        });

        const pages = Math.ceil(count / 10);
        const length = users.length;
        for (let i = 0; i < 10 - length; i++) {
            //thêm 1 user rỗng để hiển thị
            users.push({
                id: 0,
                fullName: "",
                username: "",
                registration_time: "",
                role: "",
                state: "",
            });
        }
        res.render("view_account", {
            page_style: "/css/view_account.css",
            notAJAX: true,
            users: users,
            pages: pages,
            currentPage: currentPage,
            user_search: user_search,
            sort: name_sort,
            order: order === "asc",
        });
    },
    sortView: async (req, res) => {
        const criteria = req.body.criteria;
        const user_search = req.body.user_search;
        let page = req.body.currentPage;
        if (page === undefined) {
            page = 1;
        }
        let field = {};
        if (criteria === undefined || isEmptyObject(criteria)) {
            field = {
                user_search: user_search,
                key: "",
                order: "",
                page: page,
            };
        } else if (criteria.user_name !== undefined) {
            field = {
                key: "fullName",
                user_search: user_search,
                order: criteria.user_name ? "asc" : "desc",
                page: page,
            };
        } else if (criteria.user_email !== undefined) {
            field = {
                key: "username",
                user_search: user_search,
                order: criteria.user_email ? "asc" : "desc",
                page: page,
            };
        } else if (criteria.user_reg !== undefined) {
            field = {
                key: "registration_time",
                user_search: user_search,
                order: criteria.user_reg ? "asc" : "desc",
                page: page,
            };
        } else if (criteria.user_role !== undefined) {
            field = {
                key: "role",
                user_search: user_search,
                order: criteria.user_role ? "asc" : "desc",
                page: page,
            };
        } else if (criteria.user_state !== undefined) {
            field = {
                key: "state",
                user_search: user_search,
                order: criteria.user_state ? "asc" : "desc",
                page: page,
            };
        }

        const users = await User.sortUser(field);
        users.forEach((user) => {
            user.registration_time = formatDateSimple(user.registration_time);
            if (user.username === null && user.type === "github") {
                user.username = "Github account";
            }
            if (user.username === null && user.type === "google") {
                user.username = "Google account";
            }
        });
        res.json(users);
    },
    countSearch: async (req, res) => {
        const user_search = req.body.user_search;
        const count_users = await User.countSearch(user_search);
        const pages = Math.ceil(count_users / 10);
        res.json(pages);
    },
    updateUser: async (req, res) => {
        let { id, role, state } = req.body;
        if (role === undefined || state === undefined) {
            res.json({ message: "Invalid data" });
            return;
        }
        if (role == "customer") role = "user";
        id = Number(id);
        if (id === undefined || id === 0) {
            res.json();
            return;
        }
        if (id == req.user.id) {
            res.json("Can't update your account");
            return;
        }
        const result = await User.updateUser(id, role, state);
        res.json("success");
    },
    viewDetail: async (req, res) => {
        let id = req.params.id;
        id = Number(id);
        if (isNaN(id) || id < 1) {
            res.redirect("/admin/viewaccount");
            return;
        }
        const user = await User.getUserById(id);
        if (user === null) {
            res.redirect("/admin/viewaccount");
            return;
        }
        if (user.username === null && user.type === "github") {
            user.username = "Github account";
        }
        if (user.username === null && user.type === "google") {
            user.username = "Google account";
        }
        const total_pay = await User.getTotalPayment(id);
        const categories_favorite = await User.getCateFavorite(id);
        const products_favorite = await User.getProductFavorite(id);
        const manufac_favorite = await User.getManufacFavorite(id);
        const bought_products = await User.getBoughtProducts(id);
        user.categories_favorite = categories_favorite;
        user.manufac_favorite = manufac_favorite;
        user.products_favorite = products_favorite;
        user.total_pay = total_pay;

        user.registration_time = formatDateSimple(user.registration_time);
        res.render("view_detail", {
            page_style: "/css/view_detail.css",
            notAJAX: true,
            user: user,
            products: bought_products,
        });
    },
    searchProducts: async (req, res) => {
        const search = req.body.search;
        const id = Number(req.body.id);
        if (search === undefined || id === undefined) {
            res.json([]);
            return;
        }
        const products = await User.searchProducts(search);
        const products_Id = products.map((product) => product.product_id);
        res.json(products_Id);
    },
    searchProductsAllAttribute: async (req, res) => {
        const search = req.body.search;
        const id = Number(req.body.id);
        if (search === undefined || id === undefined) {
            res.json([]);
            return;
        }
        const products = await User.searchProductsAllAttribute(search);
        res.json(products);
    },
    viewCateManu: async (req, res) => {
        const categories = await User.getCategories();
        const manufacturers = await User.getManufacturers();
        categories.forEach((cate, index) => {
            const i = index % 3;
            cate.img = `/images/img/cate0${i + 1}.png`;
        });
        manufacturers.forEach((manu, index) => {
            const i = index % 3;
            manu.img = `/images/img/manu0${i + 1}.png`;
        });
        res.render("view_cate_manu", {
            page_style: "/css/cate_manu.css",
            manufacturers: manufacturers,
            categories: categories,
        });
    },
    updateManuOrCate: async (req, res) => {
        const { type, name } = req.body;
        if (
            type === undefined ||
            name === undefined ||
            name === "" ||
            type === ""
        ) {
            const message = {
                status: "fail",
            };
            res.status(200).json(message);
            return;
        }
        try {
            const result = await User.updateManuOrCate(type, name);
            if (result) {
                if (type === "category") {
                    const message = {
                        id: result.category_id,
                        status: "success",
                    };
                    res.status(200).json(message);
                } else {
                    const message = {
                        id: result.supplier_id,
                        status: "success",
                    };
                    res.status(200).json(message);
                }
            } else {
                const message = {
                    status: "fail",
                };
                res.status(200).json(message);
            }
        } catch (err) {
            console.log(err);
            const message = {
                status: "fail",
            };
            res.status(200).json(message);
        }
    },
    viewCateDetail: async (req, res) => {
        const id = req.params.id;
        if (isNaN(id) || id < 1) {
            res.redirect("/admin/viewcatemanu");
            return;
        }
        const category = await User.getCategoryById(id);
        if (category === null) {
            res.redirect("/admin/viewcatemanu");
            return;
        }
        const CM = {
            id: category.category_id,
            name: category.category_name,
            count: category.count,
            img: "/images/img/cate01.png",
            type: "category",
        };

        const total_pay = await User.getTotalPayCate(id);
        const users_favorite = await User.getUsersFavoriteCate(id);
        const products = await User.getProductsCate(id);
        CM.total_pay = total_pay;
        CM.users_favorite = users_favorite;
        res.render("view_cate_manu_detail", {
            page_style: "/css/cate_manu_detail.css",
            CM: CM,
            products: products,
        });
    },
    viewManuDetail: async (req, res) => {
        const id = req.params.id;
        if (isNaN(id) || id < 1) {
            res.redirect("/admin/viewcatemanu");
            return;
        }
        const manufacturer = await User.getManufacturerById(id);
        if (manufacturer === null) {
            res.redirect("/admin/viewcatemanu");
            return;
        }
        const CM = {
            id: manufacturer.supplier_id,
            name: manufacturer.brand,
            count: manufacturer.count,
            img: "/images/img/manu01.png",
            type: "manufacturer",
        };

        const total_pay = await User.getTotalPayManu(id);
        const users_favorite = await User.getUsersFavoriteManu(id);
        const products = await User.getProductsManu(id);
        CM.total_pay = total_pay;
        CM.users_favorite = users_favorite;
        res.render("view_cate_manu_detail", {
            page_style: "/css/cate_manu_detail.css",
            CM: CM,
            products: products,
        });
    },
    deleteProductsFromCategory: async (req, res) => {
        const { product_detele, id, name } = req.body;
        try {
            if (
                product_detele === undefined ||
                id === undefined ||
                name === undefined ||
                Number(id) < 1 ||
                isNaN(Number(id)) ||
                Number(id) === 20
            ) {
                console.log("undefined");
                res.json({ status: "fail" });
                return;
            }
            const updateName = await User.updateNameManuOrCate(
                "category",
                name,
                id
            );
            if (updateName === null) {
                res.json({ status: "fail" });
                return;
            }
            const result = await User.deleteProductsFromCategory(
                product_detele
            );
            if (result) {
                res.json({ status: "success" });
            } else {
                res.json({ status: "fail" });
            }
        } catch (err) {
            console.log(err);
            res.json({ status: "fail" });
        }
    },
    deleteProductsFromManufacturer: async (req, res) => {
        const { product_detele, id, name } = req.body;
        if (
            product_detele === undefined ||
            id === undefined ||
            name === undefined ||
            Number(id) < 1 ||
            isNaN(Number(id)) ||
            Number(id) === 20
        ) {
            res.json({ status: "fail" });
            return;
        }
        const updateName = await User.updateNameManuOrCate(
            "manufacturer",
            name,
            id
        );
        if (updateName === null) {
            res.json({ status: "fail" });
            return;
        }
        const result = await User.deleteProductsFromManufacturer(
            product_detele
        );
        if (result) {
            res.json({ status: "success" });
        } else {
            res.json({ status: "fail" });
        }
    },
    deleteCategory: async (req, res) => {
        let { id } = req.body;
        if (id === undefined || Number(id) === 20) {
            res.json({ status: "fail" });
            return;
        }
        id = Number(id);
        if (isNaN(id) || id < 1) {
            res.json({ status: "fail" });
            return;
        }
        const result = await User.deleteCategory(id);
        if (result) {
            res.json({ status: "success" });
        } else {
            res.json({ status: "fail" });
        }
    },
    deleteManufacturer: async (req, res) => {
        let { id } = req.body;
        if (id === undefined || Number(id) === 20) {
            res.json({ status: "fail" });
            return;
        }
        id = Number(id);
        if (isNaN(id) || id < 1) {
            res.json({ status: "fail" });
            return;
        }
        const result = await User.deleteManufacturer(id);
        if (result) {
            res.json({ status: "success" });
        } else {
            res.json({ status: "fail" });
        }
    },
    Product: async (req, res) => {
        let page = req.query.page ? req.query.page : 1;
        const countPage = await User.countProductsPage();
        if (Number.isNaN(page) || page < 1 || page > countPage) {
            page = 1;
        }
        const products = await User.getProducts(page);
        const pages = Math.ceil(countPage / 9);
        const categories = await User.getCategoriesWithoutCount();
        const manufacturers = await User.getManufacturersWithoutCount();

        res.render("update_create_product", {
            page_style: "/css/update_create_product.css",
            products: products,
            categories: categories,
            manufacturers: manufacturers,
            currentPage: page,
            pages: pages,
        });
    },
    createProduct: async (req, res) => {
        const {
            product_name,
            product_price,
            product_quantity,
            product_description,
            category_id,
            manufacturer_id,
        } = req.body;
        if (
            product_name === undefined ||
            product_price === undefined ||
            product_quantity === undefined ||
            product_description === undefined ||
            category_id === undefined ||
            manufacturer_id === undefined
        ) {
            res.json({ status: "fail" });
            return;
        }
        if (
            product_name === "" ||
            isNaN(Number(product_price)) ||
            isNaN(Number(product_quantity)) ||
            Number(product_quantity) < 0 ||
            Number(product_price) < 0 ||
            !Number.isInteger(Number(product_quantity)) ||
            product_description === "" ||
            isNaN(Number(category_id)) ||
            isNaN(Number(manufacturer_id)) ||
            Number(category_id) < 1 ||
            Number(manufacturer_id) < 1
        ) {
            res.json({ status: "fail" });
            return;
        }
        const product = await User.getProductByName(product_name);
        if (product !== null) {
            res.json({
                status: "fail",
                message: "Name product already exists",
            });
            return;
        }

        const product_images = req.files;
        if (product_images === undefined || product_images.length === 0) {
            res.json({ status: "fail" });
            return;
        }
        const filePaths = [];
        for (let i = 0; i < product_images.length; i++) {
            const filePath = `/images/products/${product_images[i].filename}`;
            filePaths.push(filePath);
        }
        try {
            const result = await User.createProduct(
                product_name,
                product_price,
                product_quantity,
                product_description,
                category_id,
                manufacturer_id,
                filePaths
            );
            if (result) {
                const productInsert = await User.getProductByNameIncludeImage(
                    product_name
                );
                res.json({ status: "success", product: productInsert });
            } else {
                res.json({ status: "fail" });
            }
        } catch (err) {
            console.log(err);
            res.json({ status: "fail" });
            return;
        }
    },
    getProduct: async (req, res) => {
        const id = Number(req.params.id);
        if (isNaN(id) || id < 1) {
            res.json({ status: "fail" });
            return;
        }
        const product = await User.getProductById(id);
        if (product === null) {
            res.json({ status: "fail" });
            return;
        }
        res.json({ status: "success", product: product });
    },
    updateProduct: async (req, res) => {
        const {
            product_id,
            product_name,
            original_price,
            current_price,
            product_quantity,
            product_description,
            category_id,
            manufacturer_id,
        } = req.body;
        if (
            product_id === undefined ||
            product_name === undefined ||
            original_price === undefined ||
            current_price === undefined ||
            product_quantity === undefined ||
            product_description === undefined ||
            category_id === undefined ||
            manufacturer_id === undefined
        ) {
            console.log("undefined");
            res.json({ status: "fail" });
            return;
        }
        if (
            isNaN(Number(product_id)) ||
            Number(product_id) < 1 ||
            product_name === "" ||
            isNaN(Number(original_price)) ||
            isNaN(Number(current_price)) ||
            isNaN(Number(product_quantity)) ||
            Number(product_quantity) < 0 ||
            !Number.isInteger(Number(product_quantity)) ||
            product_description === "" ||
            isNaN(Number(category_id)) ||
            isNaN(Number(manufacturer_id)) ||
            Number(category_id) < 1 ||
            Number(manufacturer_id) < 1
        ) {
            res.json({ status: "fail" });
            return;
        }
        const product = await User.getProductByIdWithoutInclude(
            Number(product_id)
        );
        if (product === null) {
            console.log("null");
            res.json({ status: "fail" });
            return;
        }
        const product_images = req.files;
        if (product_images === undefined) {
            console.log("undefined");
            res.json({ status: "fail" });
            return;
        }
        const filePaths = [];
        for (let i = 0; i < product_images.length; i++) {
            const filePath = `/images/products/${product_images[i].filename}`;
            filePaths.push(filePath);
        }
        try {
            const result = await User.updateProduct(
                product_id,
                product_name,
                original_price,
                current_price,
                product_quantity,
                product_description,
                category_id,
                manufacturer_id,
                filePaths
            );
            if (result) {
                const productUpdate = await User.getProductById(product_id);
                res.json({ status: "success", product: productUpdate });
            } else {
                console.log("fail");
                res.json({ status: "fail" });
            }
        } catch (err) {
            console.log(err);
            res.json({ status: "fail" });
            return;
        }
    },
    deleteProduct: async (req, res) => {
        const id = Number(req.params.id);
        if (isNaN(id) || id < 1) {
            res.json({ status: "fail" });
            return;
        }
        const result = await User.deleteProduct(id);
        if (result) {
            res.json({ status: "success" });
        } else {
            res.json({ status: "fail" });
        }
    },
    viewOrder: async (req, res) => {
        let page = req.query.page ? req.query.page : 1;

        if (Number.isNaN(page) || page < 1) {
            page = 1;
        }
        let filter = req.query.filter ? req.query.filter : "";
        const filters = [
            "Completed",
            "Processing",
            "Pending",
            "Cancelled",
            "Shipped",
            "No Filter",
        ];
        if (!filters.includes(filter)) {
            filter = "No Filter";
        }
        const countPage = await User.countOrders(filter);
        if (page > Math.ceil(countPage / 10)) {
            page = Math.ceil(countPage / 10);
        }
        const orders = await User.getOrders(Number(page), filter);
        orders.forEach((order) => {
            order.creation_time = formatDateSimple(order.creation_time);
        });
        res.render("view_order", {
            page_style: "/css/view_order.css",
            orders: orders,
            currentPage: page,
            pages: Math.ceil(countPage / 10),
            filter: filter,
        });
    },
    updateOrderStatus: async (req, res) => {
        let { orderID, status } = req.body;

        if (orderID === undefined || status === undefined) {
            res.json({ status: "fail" });
            return;
        }
        orderID = Number(orderID);
        if (isNaN(orderID) || orderID < 1) {
            res.json({ status: "fail" });
            return;
        }
        const filter = [
            "Completed",
            "Processing",
            "Pending",
            "Cancelled",
            "Shipped",
        ];
        if (!filter.includes(status)) {
            res.json({ status: "fail" });
            return;
        }
        const result = await User.updateOrderStatus(orderID, status);
        if (result) {
            res.json({ status: "success" });
        } else {
            res.json({ status: "fail" });
        }
    },
    viewOrderDetail: async (req, res) => {
        const id = req.params.id;
        if (isNaN(id) || id < 1) {
            res.redirect("/admin/vieworder");
            return;
        }
        const order = await User.getOrderById(id);
        let count_number_product = 0;
        order.OrderDetail.forEach((OD) => {
            count_number_product += OD.quantity;
        });
        order.count_number_product = count_number_product;
        const products = [];
        order.OrderDetail.forEach((OD) => {
            const product = OD.Product;
            product.quantity = OD.quantity;
            products.push(product);
        });
        order.creation_time = formatDateSimple(order.creation_time);
        if (order === null) {
            res.redirect("/admin/vieworder");
            return;
        }
        order.creation_time = formatDateSimple(order.creation_time);
        const Payments = order.Payments[0];
        order.Payments = Payments;
        res.render("order_detail", {
            page_style: "/css/order_detail.css",
            order: order,
            products: products,
        });
    },
    viewRevenue: async (req, res) => {
        const label_and_data = await User.getDataRevenueMonth();
        const raw_data = createDataNormal(label_and_data, "month");
        const data = createDataForChart(
            standardizeDate(label_and_data, "month"),
            "month"
        );
        const products = await User.getTopProductsByMonth();
        res.render("view_revenue", {
            page_style: "/css/view_revenue.css",
            dataChart: JSON.stringify(data),
            data: raw_data,
            products: products,
        });
    },
    getRevenue: async (req, res) => {
        const time = req.params.date;
        if (time === "month") {
            const label_and_data = await User.getDataRevenueMonth();
            const data = createDataForChart(
                standardizeDate(label_and_data, "month"),
                "month"
            );
            res.json(data);
            return;
        } else if (time === "day") {
            const label_and_data = await User.getDataRevenueDay();
            //{ '23/12': 200, '23/11': 650, '21/12': 150 }
            const data = createDataForChart(label_and_data, "day");
            res.json(data);
            return;
        } else if (time === "week") {
            const label_and_data = await User.getDataRevenueWeek();

            const data = createDataForChart(label_and_data, "week");
            res.json(data);
            return;
        } else {
            res.json({ status: "fail" });
        }
    },
    getProductRevenue: async (req, res) => {
        const time = req.params.date;
        if (time === "month") {
            const data = await User.getTopProductsByMonth();
            res.json(data);
        } else if (time === "day") {
            const data = await User.getTopProductByDay();
            res.json(data);
        } else if (time === "week") {
            const data = await User.getTopProductsByWeek();
            res.json(data);
        } else {
            res.json({ status: "fail" });
        }
    },
    index: async (req, res) => {
        res.render("admin", { page_style: "/css/admin.css" });
    },
};

module.exports = Admin;
