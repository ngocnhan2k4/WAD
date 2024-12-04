const express= require('express');
const router = express.Router();
const cartController = require('./controller')

router.get("/", cartController.getCart);
router.post("/update", cartController.updateCartItemQuantity);
router.post("/add", cartController.addToCart);
router.post("/delete", cartController.deleteCartItem);
router.get("/count", cartController.getCartCount);
router.get('/check', cartController.checkCart);

module.exports = router;