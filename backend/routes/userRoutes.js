const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { uploadLicense } = require("../middleware/upload");
const {
  getAllUsers,
  createUser,
  getPendingDoctors,
  verifyDoctor,
  setUserStatus,
  getUserById,
  uploadLicenseDoc,
  getLicenseDoc,
} = require("../controllers/userController");
router.get("/",                 protect, authorize("admin"), getAllUsers);
router.post("/",                protect, authorize("admin"), createUser);
router.get("/pending-doctors",  protect, authorize("admin"), getPendingDoctors);
router.put("/:id/verify",       protect, authorize("admin"), verifyDoctor);
router.put("/:id/status",       protect, authorize("admin"), setUserStatus);
router.get("/:id",              protect, authorize("admin", "dermatologist"), getUserById);
router.post("/license",     protect, authorize("dermatologist"), uploadLicense.single("license"), uploadLicenseDoc);
router.get("/:id/license",  protect, authorize("admin"), getLicenseDoc);


module.exports = router;
