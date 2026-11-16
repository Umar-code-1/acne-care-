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

const createUser = async (req, res) => {
  const { name, email, password, role, pmdcNumber } = req.body || {};
  if (role !== "patient" && role !== "dermatologist") {
    return res.status(400).json({ message: "Choose Patient or Dermatologist." });
  }
  if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ message: "Enter a full name and a valid email address." });
  }
  if (typeof password !== "string" || password.length < 6 || Buffer.byteLength(password, "utf8") > 72) {
    return res.status(400).json({ message: "Enter a password of at least 6 characters and no more than 72 bytes." });
  }
  const pmdc = typeof pmdcNumber === "string" ? pmdcNumber.trim().toUpperCase() : "";
  if (role === "dermatologist" && !/^\d{4,6}-[A-Z]$/.test(pmdc)) {
    return res.status(400).json({ message: "Enter a valid PMDC registration number, such as 12345-P." });
  }

  try {
    const user = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password, role,
      pmdcNumber: role === "dermatologist" ? pmdc : "" });
    return res.status(201).json(clean(user));
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Email already registered." });
    return res.status(500).json({ message: "Could not create the account. Please try again." });
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
const { saveFile, deleteFile, sendStoredFile } = require("../services/fileStorage");

// POST /api/users/license   (doctor uploads licence)
const uploadLicenseDoc = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please upload your licence document" });

    const user = await User.findById(req.user._id);
    if (user.role !== "dermatologist") {
      return res.status(403).json({ message: "Only dermatologists upload licences" });
    }

    // naya licence aaya to purana hata do
    const oldLicense = user.licenseDoc;
    user.licenseDoc = await saveFile(req.file, { kind: "licenses", name: `license-${user._id}` });
    if (oldLicense) await deleteFile(oldLicense);
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
    await sendStoredFile(res, user.licenseDoc, "Licence file missing");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllUsers,
  createUser,
  getPendingDoctors,
  verifyDoctor,
  setUserStatus,
  getUserById,
  uploadLicenseDoc,
  getLicenseDoc,
};
