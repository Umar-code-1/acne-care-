// routes/platformFeeRoutes.js — doctor ki monthly platform fee
const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { uploadProof } = require("../middleware/upload");
const { uploadLimiter } = require("../middleware/rateLimit");
const {
  getCompanyDetails,
  getMyFees,
  submitFeeProof,
  getFeeProof,
  getAllFees,
  verifyFee,
} = require("../controllers/platformFeeController");

router.get("/my",              protect, authorize("dermatologist"), getMyFees);
router.get("/company-details", protect, authorize("dermatologist", "admin"), getCompanyDetails);
router.get("/",                protect, authorize("admin"), getAllFees);

router.post("/:month/proof", protect, authorize("dermatologist"), uploadLimiter, uploadProof.single("proof"), submitFeeProof);
router.get("/:id/proof",     protect, authorize("dermatologist", "admin"), getFeeProof);
router.put("/:id/verify",    protect, authorize("admin"), verifyFee);

module.exports = router;
