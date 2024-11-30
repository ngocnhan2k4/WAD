const express = require('express');
const router = express.Router();
const userProfileController = require('./controller');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
router.get("/", userProfileController.getUserProfile);
const path = require('path');

// Cấu hình Multer để lưu file
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, path.join(__dirname,'..','..', 'public', 'images','avatar')); 
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: 'dier6msgg', // Thay bằng Cloud Name của bạn
  api_key: '495268581211382', // Thay bằng API Key của bạn
  api_secret: '5G8FPcNEmy40sj0xMXdmPCAkIiw', // Thay bằng API Secret của bạn
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

// Xử lý yêu cầu cập nhật avatar
router.post('/update-avatar', upload.single('avatar'), userProfileController.updateImage);

module.exports = router;