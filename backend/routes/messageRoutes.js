const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getConversation, sendMessage, getInstructions, sendInstruction, getUnreadCounts } = require("../controllers/messageController");

router.get("/unread-counts", protect, authorize("patient", "dermatologist"), getUnreadCounts);
router.get("/prescriptions/:prescriptionId", protect, authorize("patient", "dermatologist"), getConversation);
router.post("/prescriptions/:prescriptionId", protect, authorize("patient", "dermatologist"), sendMessage);
router.get("/prescriptions/:prescriptionId/instructions", protect, authorize("patient", "dermatologist"), getInstructions);
router.post("/prescriptions/:prescriptionId/instructions", protect, authorize("patient", "dermatologist"), sendInstruction);

module.exports = router;
