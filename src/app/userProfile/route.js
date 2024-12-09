const express = require('express');
const router = express.Router();
const userProfileController = require('./controller');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();
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
    folder: 'avatar', // Thư mục lưu trữ trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Định dạng file được phép
  },
});


const upload = multer({ storage });

router.get("/", userProfileController.getUserProfile);
router.post('/update-avatar', upload.single('avatar'), userProfileController.updateImage);
router.post("/updatepassword", userProfileController.updatePassword);
router.post("/verifyoldpassword", userProfileController.verifyOldPassword);
router.post("/updateprofile", userProfileController.updateProfile);
module.exports = router;