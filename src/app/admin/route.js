const express = require("express");
const isAdmin = require("./middleware.js");
const router = express.Router();
const adminController = require("./adminController");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY,
});

// Cấu hình Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "product", // Thư mục lưu trữ trên Cloudinary
        allowed_formats: ["jpg", "png", "jpeg"], // Định dạng file được phép
    },
});

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(
//             null,
//             path.join(__dirname, "..", "..", "public", "images", "products")
//         );
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const filename = Date.now() + ext;
//         cb(null, filename);
//     },
// });

// Tạo middleware Multer
const upload = multer({ storage: storage });

router.use(isAdmin);
router.use("/viewaccount/:id", adminController.viewDetail);
router.use("/viewaccount", adminController.viewAccount);
router.use("/sortview", adminController.sortView);
router.use("/countsearch", adminController.countSearch);
router.use("/updateuser", adminController.updateUser);
router.use("/searchproducts", adminController.searchProducts);
router.use(
    "/searchproductsallattribute",
    adminController.searchProductsAllAttribute
);
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
router.use("/product", adminController.Product);
router.use(
    "/createproduct",
    upload.array("product_images", 4),
    adminController.createProduct
);
router.use(
    "/updateproduct",
    upload.array("product_images", 4),
    adminController.updateProduct
);
router.use("/getproduct/:id", adminController.getProduct);
router.use("/deleteproduct/:id", adminController.deleteProduct);
router.use("/vieworder/:id", adminController.viewOrderDetail);
router.use("/vieworder", adminController.viewOrder);
router.use("/updateorderstatus", adminController.updateOrderStatus);
router.use("/viewrevenue", adminController.viewRevenue);
router.use("/getrevenue/:date", adminController.getRevenue);
router.use("/getproductrevenue/:date", adminController.getProductRevenue);
router.use("/", adminController.index);
module.exports = router;
