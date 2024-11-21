const User = require("./service");

const userController = {
    getAllUsers: async (req, res) => {
        const users = await User.getAll();
        res.json(users);
    },
    login: (req, res) => {
        res.render("login", { page_style: "/css/login.css",notAJAX:true });
    },
    register: (req, res) => {
        res.render("register", { page_style: "/css/signup.css",notAJAX:true });
    },
};

module.exports = userController;
