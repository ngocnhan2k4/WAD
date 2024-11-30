const User = require("../admin/service");

function formatDateSimple(date) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-US", options);
}
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
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
        const { product_detele, id } = req.body;
        if (
            product_detele === undefined ||
            id === undefined ||
            Number(id) < 1 ||
            isNaN(Number(id)) ||
            Number(id) === 20
        ) {
            res.json({ status: "fail" });
            return;
        }
        const result = await User.deleteProductsFromCategory(product_detele);
        if (result) {
            res.json({ status: "success" });
        } else {
            res.json({ status: "fail" });
        }
    },
    deleteProductsFromManufacturer: async (req, res) => {
        const { product_detele, id } = req.body;
        if (
            product_detele === undefined ||
            id === undefined ||
            Number(id) < 1 ||
            isNaN(Number(id)) ||
            Number(id) === 20
        ) {
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
        const products = await User.getAllProducts();
        const categories = await User.getCategoriesWithoutCount();
        const manufacturers = await User.getManufacturersWithoutCount();

        res.render("update_create_product", {
            page_style: "/css/update_create_product.css",
            products: products,
            categories: categories,
            manufacturers: manufacturers,
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
            console.log("id", product_id);
            console.log("product_name", product_name);
            console.log("original_price", original_price);
            console.log("current_price", current_price);
            console.log("product_quantity", product_quantity);
            console.log("product_description", product_description);
            console.log("category_id", category_id);
            console.log("manufacturer_id", manufacturer_id);

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
};

module.exports = Admin;
