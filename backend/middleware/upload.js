const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

// uploads folder na ho to bana do
const dir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `scan-${req.user._id}-${Date.now()}${ext}`);
  },
});

// sirf images allow karo
const fileFilter = (req, file, cb) => {
  const ok = /jpeg|jpg|png|webp/.test(file.mimetype);
  if (ok) return cb(null, true);
  cb(new Error("Only JPG, PNG and WEBP images are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
const licenseDir = path.join(__dirname, "..", "uploads", "licenses");
if (!fs.existsSync(licenseDir)) fs.mkdirSync(licenseDir, { recursive: true });

const licenseStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, licenseDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `license-${req.user._id}-${Date.now()}${ext}`);
  },
});

const uploadLicense = multer({
  storage: licenseStorage,
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|pdf/.test(file.mimetype);
    if (ok) return cb(null, true);
    cb(new Error("Only JPG, PNG or PDF allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});
const proofDir = path.join(__dirname, "..", "uploads", "payments");
if (!fs.existsSync(proofDir)) fs.mkdirSync(proofDir, { recursive: true });

const proofStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, proofDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `proof-${req.params.id}-${Date.now()}${ext}`);
  },
});

const uploadProof = multer({
  storage: proofStorage,
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|pdf/.test(file.mimetype);
    if (ok) return cb(null, true);
    cb(new Error("Only JPG, PNG or PDF allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});
module.exports = upload;
module.exports.upload = upload;
module.exports.uploadProof = uploadProof;
module.exports.uploadLicense = uploadLicense;