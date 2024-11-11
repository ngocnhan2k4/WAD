const User = require("../services/userService");

const userController = {
    getAllUsers: async (req, res) => {
        const users = await User.getAll();
        res.json(users);
    },
    login: (req, res) => {
        res.render("login");
    },
    register: (req, res) => {
        console.log("Register", req.session);
        if (req.Authenticated) {
            res.redirect("/user");
        } else {
            console.log("Chưa login");
        }
        res.render("register");
    },
};

module.exports = userController;
