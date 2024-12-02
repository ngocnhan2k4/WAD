const express = require("express");
const router = express.Router();
const paymentController = require('./controller')

router.post('/checkout', paymentController.createPayment);
//router.get("/vnpay_return", paymentController.paymentReturn); // Xử lý callback

module.exports = router;
