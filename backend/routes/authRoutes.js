// routes/authRoutes.js
const express = require("express");
const router  = express.Router();
const { register, login, googleAuth, requestPasswordReset, resetPassword, getMe, updateProfile, deleteMyImages, deleteAccount } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter, passwordResetLimiter } = require("../middleware/rateLimit");


router.get("/me",       protect, getMe);
router.put("/profile",  protect, updateProfile);

router.delete("/my-images", protect, deleteMyImages);
router.delete("/account",   protect, deleteAccount);

router.post("/register", authLimiter, register);
router.post("/login",    authLimiter, login);
router.post("/google",   authLimiter, googleAuth);
router.post("/forgot-password", passwordResetLimiter, requestPasswordReset);
router.post("/reset-password", passwordResetLimiter, resetPassword);

module.exports = router;
