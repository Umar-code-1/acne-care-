const Scan = require("../models/Scan");
const User = require("../models/User");
const fs   = require("fs");
const path = require("path");

// DB shape ko frontend shape mein badlo
const format = (s) => ({
  _id:      s._id,
  id:       s._id,
  pid:      s.patient?._id || s.patient,
  pname:    s.patient?.name || "",
  atype:    s.acneType,
  sev:      s.severity,
  conf:     s.confidence,
  skinType: s.skinType,
  image:    s.imageUrl,
  probs:    s.probs ? Object.fromEntries(s.probs) : {},
  notes:    s.notes,
  cystFlag: s.cystFlag,
  cystProb: s.cystProb,
  questionnaire: s.questionnaire,
  date:     s.createdAt?.toISOString().slice(0, 10),
  createdAt: s.createdAt,
});

/* =========================================================
   AI MODEL YAHAN CONNECT HOGA
  
   ========================================================= */
/* =========================================================
   REAL AI MODEL — calls the Python inference service
   ========================================================= */
const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

const predictAcne = async (imagePath) => {
  const buffer = fs.readFileSync(imagePath);

  const form = new FormData();
const ext = path.extname(imagePath).toLowerCase();
  const mime = ext === ".png"  ? "image/png"
             : ext === ".webp" ? "image/webp"
             : "image/jpeg";

  form.append("image", new Blob([buffer], { type: mime }), path.basename(imagePath));
  const res = await fetch(`${ML_URL}/predict`, { method: "POST", body: form });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body.detail || {};

    if (res.status === 422) {
      const err = new Error(detail.message || "Image validation failed");
      err.validation = true;
      throw err;
    }
    throw new Error(`AI service error: ${JSON.stringify(detail)}`);
  }
  return await res.json();
};

// POST /api/scans   (patient, image upload)
const createScan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a skin image" });
    }

    // questionnaire form-data se aata hai isliye string ho sakta hai
    let questionnaire = req.body.questionnaire || {};
    if (typeof questionnaire === "string") {
      try { questionnaire = JSON.parse(questionnaire); } catch { questionnaire = {}; }
    }

let result;
    try {
      result = await predictAcne(req.file.path);
    } catch (err) {
      fs.unlink(req.file.path, () => {});

      if (err.validation) {
        return res.status(400).json({ message: err.message });
      }

      console.error("AI service unavailable:", err.message);
      return res.status(503).json({
        message: "Analysis service is temporarily unavailable. Please try again shortly.",
      });
    }
    const cleanSkin = (req.body.skinType || "").trim();

    const scan = await Scan.create({
      patient:    req.user._id,
      imageUrl:   `/uploads/${req.file.filename}`,
      acneType:   result.acneType,
      severity:   result.severity,
      confidence: result.confidence,
      probs:      result.probs,
      cystFlag:   result.cystFlag,
      cystProb:   result.cystProb,
      skinType:   cleanSkin || req.user.skinType || "",
      questionnaire,
    });

    // patient ka skinType update kar do agar naya diya hai
    if (cleanSkin && cleanSkin !== req.user.skinType) {
      await User.findByIdAndUpdate(req.user._id, { skinType: cleanSkin });
    }

    const populated = await Scan.findById(scan._id).populate("patient", "name email");
    res.status(201).json(format(populated));
  } catch (error) {
    console.error("Scan Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/scans/my   (patient)
const getMyScans = async (req, res) => {
  try {
    const scans = await Scan.find({ patient: req.user._id })
      .populate("patient", "name email")
      .sort({ createdAt: -1 });
    res.json(scans.map(format));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/scans/:id   (owner / doctor / admin)
const getScanById = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }
    if (!scan.imageUrl) {
      return res.status(410).json({ message: "Image deleted by user" });
    }
    res.json(format(scan));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/scans/patient/:patientId   (doctor / admin)
const getPatientScans = async (req, res) => {
  try {
    const scans = await Scan.find({ patient: req.params.patientId })
      .populate("patient", "name email skinType")
      .sort({ createdAt: -1 });
    res.json(scans.map(format));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/scans   (admin)
const getAllScans = async (req, res) => {
  try {
    const scans = await Scan.find()
      .populate("patient", "name email")
      .sort({ createdAt: -1 });
    res.json(scans.map(format));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/scans/:id   (owner / admin)
const deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) return res.status(404).json({ message: "Scan not found" });

    const isOwner = scan.patient.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // file bhi delete kar do
    if (scan.imageUrl) {
      const filePath = path.join(__dirname, "..", scan.imageUrl);
      fs.unlink(filePath, () => {});
    }

    await scan.deleteOne();
    res.json({ message: "Scan deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/scans/:id/image   (owner / doctor / admin only)
const getScanImage = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan || !scan.imageUrl) {
      return res.status(404).json({ message: "Image not found" });
    }

    const isOwner = scan.patient.toString() === req.user._id.toString();
    const isStaff = ["admin", "dermatologist"].includes(req.user.role);
    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: "Not authorized to view this image" });
    }

    // basename lena zaroori hai — warna ../../ se koi bhi file mang sakta hai
    const filename = path.basename(scan.imageUrl);
    const filePath = path.join(__dirname, "..", "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Image file missing" });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE /api/scans/:id/image   — sirf photo hatao, result rakho
const deleteScanImage = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) return res.status(404).json({ message: "Scan not found" });

    const isOwner = scan.patient.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (scan.imageUrl) {
      const filePath = path.join(__dirname, "..", "uploads", path.basename(scan.imageUrl));
      fs.unlink(filePath, () => {});
      scan.imageUrl = "";
      await scan.save();
    }

    res.json({ message: "Photo deleted. Your analysis result is kept." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createScan,
  getMyScans,
  getScanById,
  getScanImage,
  deleteScanImage,
  getPatientScans,
  getAllScans,
  deleteScan,
};