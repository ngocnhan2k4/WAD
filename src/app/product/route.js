const express= require('express');
const router = express.Router();
const productController = require('./controller')


router.get('/', productController.getAllProducts)
router.get('/productDetail', productController.getProductDetail)
router.post("/api/review/add", productController.addReview);

module.exports = router;