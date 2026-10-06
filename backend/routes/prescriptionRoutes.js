const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createPrescription,
  getMyPrescriptions,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
} = require("../controllers/prescriptionController");

// Doctor
router.post("/",       protect, authorize("dermatologist"), createPrescription);
router.get("/doctor",  protect, authorize("dermatologist"), getDoctorPrescriptions);

// Patient
router.get("/my",      protect, authorize("patient"), getMyPrescriptions);

// Admin
router.get("/",        protect, authorize("admin"), getAllPrescriptions);

// Doctor / Admin — kisi patient ki saari prescriptions
router.get("/patient/:patientId", protect, authorize("dermatologist", "admin"), getPatientPrescriptions);

// Single (ownership check controller mein)
router.get("/:id",     protect, getPrescriptionById);
router.put("/:id",     protect, authorize("dermatologist"), updatePrescription);

module.exports = router;