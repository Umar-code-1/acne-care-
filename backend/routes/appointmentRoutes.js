const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getDoctors,
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointment,
  getAllAppointments,
} = require("../controllers/appointmentController");

// Booking ke liye doctors ki list (sab logged-in users)
router.get("/doctors",    protect, getDoctors);

// Patient routes
router.post("/",          protect, authorize("patient"), bookAppointment);
router.get("/my",         protect, authorize("patient"), getMyAppointments);

// Doctor routes
router.get("/doctor",     protect, authorize("dermatologist"), getDoctorAppointments);

// Admin routes
router.get("/all",        protect, authorize("admin"), getAllAppointments);

// Update appointment (ownership check controller ke andar hai)
router.put("/:id",        protect, updateAppointment);

module.exports = router;