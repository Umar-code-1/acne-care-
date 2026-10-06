const User = require("../models/User");
const jwt  = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// shared response shape — frontend reads res.data
const sendUser = (user, status, res) => {
  res.status(status).json({
    _id:      user._id,
    name:     user.name,
    email:    user.email,
    role:     user.role,
    avatar:   user.avatar,
    phone:    user.phone,
    skinType: user.skinType,
    age:      user.age,
    gender:   user.gender,
    spec:     user.spec,
    exp:      user.exp,
    rating:   user.rating,
    fee:      user.fee,
    ofee:     user.ofee,
    qual:     user.qual,
    days:     user.days,
    bio:      user.bio,

    bio:      user.bio,
    bankName:      user.bankName,
    accountTitle:  user.accountTitle,
    accountNumber: user.accountNumber,
    iban:          user.iban,
    jazzcash:      user.jazzcash,
    easypaisa:     user.easypaisa,
    isVerified: user.isVerified,
    
   isVerified: user.isVerified,
    pmdcNumber: user.pmdcNumber,
    rejectionReason: user.rejectionReason,

    platforms: user.platforms,
    startTime: user.startTime,
    endTime:   user.endTime,
        token:    generateToken(user._id),


  });
};

// @route POST /api/auth/register
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (req.body.acceptTerms !== true) {
      return res.status(400).json({ message: "You must accept the Terms of Service and Privacy Policy" });
    }

    // public signup can never create an admin
    const safeRole = role === "dermatologist" ? "dermatologist" : "patient";

    if (safeRole === "dermatologist" && !req.body.pmdcNumber?.trim()) {
      return res.status(400).json({ message: "PMDC registration number is required for dermatologists" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name, email, password, role: safeRole,
      pmdcNumber: safeRole === "dermatologist" ? req.body.pmdcNumber.trim() : "",
      termsAcceptedAt: new Date(),
      termsVersion: "1.0",
    });
    sendUser(user, 201, res);
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (role && user.role !== role) {
      return res.status(401).json({ message: `This account is not registered as ${role}` });
    }

    sendUser(user, 200, res);
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/auth/me   (protected)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/auth/profile   (protected)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

   const allowed = ["name","phone","age","gender","skinType",
                     "spec","exp","fee","ofee","qual","available","days","bio",
                     "bankName","accountTitle","accountNumber","iban","jazzcash","easypaisa","platforms","startTime","endTime"];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) user[f] = req.body[f];
    });

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      user.password = req.body.password;
    }

    const updated = await user.save();
    sendUser(updated, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Scan = require("../models/Scan");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const fs = require("fs");
const path = require("path");

// helper — ek scan ki file disk se hatao
const removeFile = (imageUrl) => {
  if (!imageUrl) return;
  const filePath = path.join(__dirname, "..", "uploads", path.basename(imageUrl));
  fs.unlink(filePath, () => {});
};

// DELETE /api/auth/my-images   — saari scan images delete karo
const deleteMyImages = async (req, res) => {
  try {
    const scans = await Scan.find({ patient: req.user._id });
    scans.forEach((s) => removeFile(s.imageUrl));
    await Scan.updateMany({ patient: req.user._id }, { $set: { imageUrl: "" } });

    res.json({
      message: `${scans.length} image(s) deleted. Your analysis results are kept.`,
      count: scans.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/auth/account   — account aur saara data delete
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required to delete your account" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin accounts cannot be self-deleted" });
    }

    // images disk se hatao
    const scans = await Scan.find({ patient: user._id });
    scans.forEach((s) => removeFile(s.imageUrl));

    // saara data delete
    await Scan.deleteMany({ patient: user._id });
    await Prescription.deleteMany({ patient: user._id });
    await Appointment.deleteMany({
      $or: [{ patient: user._id }, { doctor: user._id }],
    });
    await user.deleteOne();

    res.json({ message: "Your account and all associated data have been permanently deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { register, login, getMe, updateProfile, deleteMyImages, deleteAccount };