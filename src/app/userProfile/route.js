const express = require('express');
const router = express.Router();
const userProfileController = require('./controller');
const multer = require("multer");
router.get("/", userProfileController.getUserProfile);
const path = require('path');

// Cấu hình Multer để lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname,'..','..', 'public', 'images','avatar')); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
});


const upload = multer({ storage });

router.get("/", userProfileController.getUserProfile);

// Xử lý yêu cầu cập nhật avatar
router.post('/update-avatar', upload.single('avatar'), userProfileController.updateImage);

module.exports = router;