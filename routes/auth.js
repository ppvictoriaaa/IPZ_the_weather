const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();
const multer = require("multer");
const { upload } = require("../middleware/upload");
router.post("/register", authController.register);
router.post("/login", authController.login);

router.post(
  "/upload-photo",
  upload.single("profile_photo"),
  authController.uploadPhoto
);
module.exports = router;
