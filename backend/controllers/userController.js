const User = require("../models/User");

const clean = (u) => ({
  _id: u._id, id: u._id,
  name: u.name, email: u.email, role: u.role,
  avatar: u.avatar, phone: u.phone,
  age: u.age, gender: u.gender, skinType: u.skinType,
  spec: u.spec, exp: u.exp, rating: u.rating,
  fee: u.fee, ofee: u.ofee, qual: u.qual,
  available: u.available, days: u.days, bio: u.bio,
  isVerified: u.isVerified, active: u.active,
  joined: u.createdAt?.toISOString().slice(0, 10),
  createdAt: u.createdAt,
  pmdcNumber: u.pmdcNumber,
  licenseDoc: u.licenseDoc ? true : false,
  verifiedAt: u.verifiedAt,
  rejectionReason: u.rejectionReason,
});

// GET /api/users   (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map(clean));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/pending-doctors   (admin) — FR-12
const getPendingDoctors = async (req, res) => {
  try {
    const docs = await User.find({ role: "dermatologist", isVerified: false })
      .sort({ createdAt: -1 });
    res.json(docs.map(clean));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/:id/verify   (admin) — approve / reject doctor
const verifyDoctor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "dermatologist") {
      return res.status(400).json({ message: "Only dermatologists require verification" });
    }

    const approve = req.body.approve === true;
    user.isVerified = approve;
    user.verifiedAt = approve ? new Date() : undefined;
    user.verifiedBy = approve ? req.user._id : undefined;
    user.rejectionReason = approve ? "" : (req.body.reason || "Credentials could not be verified");
    await user.save();

    res.json({
      message: approve ? "Doctor approved" : "Doctor rejected",
      user: clean(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/:id/status   (admin) — enable / disable account
const setUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot disable your own account" });
    }

    user.active = req.body.active !== false;
    await user.save();
    res.json(clean(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:id   (admin / doctor)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(clean(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const path = require("path");
const fs = require("fs");

// POST /api/users/license   (doctor uploads licence)
const uploadLicenseDoc = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please upload your licence document" });

    const user = await User.findById(req.user._id);
    if (user.role !== "dermatologist") {
      return res.status(403).json({ message: "Only dermatologists upload licences" });
    }

    user.licenseDoc = `/uploads/licenses/${req.file.filename}`;
    if (req.body.pmdcNumber) user.pmdcNumber = req.body.pmdcNumber.trim();
    user.rejectionReason = "";
    await user.save();

    res.json({ message: "Licence uploaded. Awaiting admin review.", user: clean(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:id/license   (admin views licence)
const getLicenseDoc = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.licenseDoc) {
      return res.status(404).json({ message: "No licence on file" });
    }
    const filePath = path.join(__dirname, "..", "uploads", "licenses", path.basename(user.licenseDoc));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Licence file missing" });
    }
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllUsers,
  getPendingDoctors,
  verifyDoctor,
  setUserStatus,
  getUserById,
  uploadLicenseDoc,
  getLicenseDoc,
};