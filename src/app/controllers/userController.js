const User = require('../services/userService')


const userController = {
    getAllUsers: async (req,res)=>{
        const users = await User.getAll();
        res.json(users);
    },
    login: (req, res) => {
        res.render("login");
    },
    register: (req, res) => {
        res.render("register");
    },
};

module.exports = userController;