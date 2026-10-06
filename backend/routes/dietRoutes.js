const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getMyDiet } = require("../controllers/dietController");

router.get("/my", protect, authorize("patient"), getMyDiet);

module.exports = router;