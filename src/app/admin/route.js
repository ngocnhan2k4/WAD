const express = require("express");
const isAdmin = require("./middleware.js");
const router = express.Router();
const adminController = require("./adminController");

// router.use(isAdmin);
router.use("/viewaccount/:id", adminController.viewDetail);
router.use("/viewaccount", adminController.viewAccount);
router.use("/sortview", adminController.sortView);
router.use("/countsearch", adminController.countSearch);
router.use("/updateuser", adminController.updateUser);
router.use("/searchproducts", adminController.searchProducts);
router.use("/cate/:id", adminController.viewCateDetail);
router.use("/manu/:id", adminController.viewManuDetail);
router.use("/viewcatemanu", adminController.viewCateManu);
router.use("/updatemanuorcate", adminController.updateManuOrCate);
router.use(
    "/deleteproductsfromcategory",
    adminController.deleteProductsFromCategory
);
router.use(
    "/deleteproductsfrommanufacturer",
    adminController.deleteProductsFromManufacturer
);

router.use("/deletecategory", adminController.deleteCategory);
router.use("/deletemanufacturer", adminController.deleteManufacturer);
module.exports = router;
