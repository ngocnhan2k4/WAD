const express= require('express');
const router = express.Router();
const productController = require('./controller')


router.get('/', productController.getAllProducts)
router.get('/productDetail', productController.getProductDetail)

module.exports = router;