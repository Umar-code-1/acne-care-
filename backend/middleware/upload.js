const multer = require("multer");

// Files memory mein aati hain; controller unhein services/fileStorage se
// Cloudinary (ya local uploads/ folder) mein save karta hai.
const storage = multer.memoryStorage();

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

// scan: sirf images allow karo
const upload = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|webp/.test(file.mimetype);
    if (ok) return cb(null, true);
    cb(new Error("Only JPG, PNG and WEBP images are allowed"));
  },
});

// licence / payment receipt: image ya PDF
const docFilter = (req, file, cb) => {
  const ok = /jpeg|jpg|png|pdf/.test(file.mimetype);
  if (ok) return cb(null, true);
  cb(new Error("Only JPG, PNG or PDF allowed"));
};

const uploadLicense = multer({ storage, limits, fileFilter: docFilter });
const uploadProof   = multer({ storage, limits, fileFilter: docFilter });

module.exports = upload;
module.exports.upload = upload;
module.exports.uploadProof = uploadProof;
module.exports.uploadLicense = uploadLicense;
