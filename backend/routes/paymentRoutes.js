const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { uploadProof } = require("../middleware/upload");
const { uploadLimiter } = require("../middleware/rateLimit");
const {
  getPaymentDetails,
  submitProof,
  getPendingPayments,
  getProofImage,
  verifyPayment,
} = require("../controllers/paymentController");

router.get("/pending",     protect, authorize("admin", "dermatologist"), getPendingPayments);
router.get("/:id/details", protect, getPaymentDetails);

router.post("/:id/proof",  protect, authorize("patient"), uploadLimiter, uploadProof.single("proof"), submitProof);
router.get("/:id/proof",   protect, getProofImage);
router.put("/:id/verify",  protect, authorize("admin", "dermatologist"), verifyPayment);

module.exports = router;