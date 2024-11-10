const express= require('express');
const router = express.Router();
const userController = require('../app/controllers/userController')


router.get('/', userController.getAllUsers)
router.get('/login', userController.login)
router.get('/register', userController.register)

module.exports = router;