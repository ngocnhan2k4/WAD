const express = require("express");
const router = express.Router();
const adminController = require("./adminController");

router.use("/viewaccount", adminController.viewAccount);
router.use("/sortview", adminController.sortView);
router.use("/countsearch", adminController.countSearch);
router.use("/updateuser", adminController.updateUser);

module.exports = router;
