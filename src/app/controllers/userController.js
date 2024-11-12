const User = require("../services/userService");

const userController = {
    getAllUsers: async (req, res) => {
        const users = await User.getAll();
        res.json(users);
    },
    login: (req, res) => {
        res.render("login", { page_style: "/css/login.css" });
    },
    register: (req, res) => {
        res.render("register", { page_style: "/css/signup.css" });
    },
};

module.exports = userController;
