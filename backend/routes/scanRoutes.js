const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const upload  = require("../middleware/upload");
const { scanLimiter } = require("../middleware/rateLimit");
const {
  createScan,
  getMyScans,
  getScanById,
  getScanImage,
  deleteScanImage,
  getPatientScans,
  getAllScans,
  deleteScan,
} = require("../controllers/scanController");

// Patient
router.post("/", protect, authorize("patient"), scanLimiter, upload.single("image"), createScan);
router.get("/my",    protect, authorize("patient"), getMyScans);

// Admin — saare scans
router.get("/",      protect, authorize("admin"), getAllScans);

// Doctor / Admin — kisi patient ke scans
router.get("/patient/:patientId", protect, authorize("dermatologist", "admin"), getPatientScans);

// Single scan
router.get("/:id",           protect, getScanById);
router.get("/:id/image",     protect, getScanImage);
router.delete("/:id/image",  protect, deleteScanImage);
router.delete("/:id",        protect, deleteScan);

module.exports = router;