const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/authController");

router.use("/signuplocal", authController.signUpLocal);
router.use("/verify/:token", authController.verify);
router.use("/google/callback", authController.googleCallBack);
router.use("/google", authController.googleSignup);
router.use("/logout", authController.logout);
router.use("/login", authController.loginLocal);
router.use("/forgot", authController.forgotPassword);
router.use("/sendreset", authController.sendResetPassword);
router.use("/reset/:token", authController.resetPassword);
router.use("/updatepassword", authController.updatePassword);

module.exports = router;
