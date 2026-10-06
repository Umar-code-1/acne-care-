// routes/authRoutes.js
const express = require("express");
const router  = express.Router();
const { register, login, getMe, updateProfile, deleteMyImages, deleteAccount } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimit");


router.get("/me",       protect, getMe);
router.put("/profile",  protect, updateProfile);

router.delete("/my-images", protect, deleteMyImages);
router.delete("/account",   protect, deleteAccount);

router.post("/register", authLimiter, register);
router.post("/login",    authLimiter, login);

module.exports = router;