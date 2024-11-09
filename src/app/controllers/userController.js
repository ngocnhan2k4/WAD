const User = require('../services/userService')


const userController = {
    getAllUsers: async (req,res)=>{
        const users = await User.getAll();
        res.json(users);
    }
};

module.exports = userController;