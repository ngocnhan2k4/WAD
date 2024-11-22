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
        const order = req.query.order ? "asc" : "desc";
        const field = {
            key: sort,
            order: order,
            page: currentPage,
            user_search: user_search,
        };
        console.log(field);
        const users = await User.sortUser(field);
        const count = await User.countSearch(user_search);
        users.forEach((user) => {
            user.registration_time = formatDateSimple(user.registration_time);
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
        const result = await User.updateUser(id, role, state);
        res.json(result);
    },
};

module.exports = Admin;
