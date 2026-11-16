const User = require("../models/User");
const jwt  = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { getFirebaseAuth } = require("../config/firebaseAdmin");

const PMDC_PATTERN = /^\d{4,6}-[a-z]$/i;

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
    hasPassword: user.hasPassword !== false,
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
      return res.status(400).json({ message: "Please accept the Terms and Conditions." });
    }

    // public signup can never create an admin
    const safeRole = role === "dermatologist" ? "dermatologist" : "patient";

    if (safeRole === "dermatologist" && !req.body.pmdcNumber?.trim()) {
      return res.status(400).json({ message: "PMDC registration number is required for dermatologists" });
    }
    if (safeRole === "dermatologist" && !/^\d{4,6}-[a-z]$/i.test(req.body.pmdcNumber.trim())) {
      return res.status(400).json({ message: "Enter a valid PMDC number: 4–6 digits, a hyphen, and one letter (for example, 12345-P)." });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name, email, password, role: safeRole,
      pmdcNumber: safeRole === "dermatologist" ? req.body.pmdcNumber.trim().toUpperCase() : "",
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

    if (!user) {
      return res.status(401).json({ message: "No account found with this email address." });
    }
    if (!user.password) {
      return res.status(401).json({ message: "This account uses Google sign-in. Use Continue with Google, or set a password with Forgot password." });
    }
    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
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

// @route POST /api/auth/google
// body: { idToken, mode: "signin" | "signup", role, pmdcNumber?, acceptTerms? }
const googleAuth = async (req, res) => {
  try {
    const { idToken, mode, role } = req.body;
    if (!idToken || typeof idToken !== "string") {
      return res.status(400).json({ message: "Google sign-in failed. Please try again." });
    }

    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) {
      return res.status(503).json({ message: "Google sign-in is not configured on the server." });
    }

    // token Firebase se verify karo — frontend ki bheji email par kabhi trust nahi
    let decoded;
    try {
      decoded = await firebaseAuth.verifyIdToken(idToken);
    } catch {
      return res.status(401).json({ message: "Google sign-in failed or expired. Please try again." });
    }
    if (decoded.firebase?.sign_in_provider !== "google.com") {
      return res.status(401).json({ message: "Please sign in with a Google account." });
    }
    if (!decoded.email || !decoded.email_verified) {
      return res.status(401).json({ message: "Your Google email address is not verified." });
    }

    const email = decoded.email.toLowerCase();
    const googleId = decoded.uid;

    // pehle Google ID se, phir email se (email/password wala account link ho jaye)
    let user = await User.findOne({ googleId }) || await User.findOne({ email });

    if (user) {
      if (role && user.role !== role) {
        return res.status(401).json({ message: `This account is not registered as ${role}` });
      }
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      return sendUser(user, 200, res);
    }

    // naya user: patient Sign In se bhi ban sakta hai, doctor ko PMDC ke liye Sign Up chahiye
    if (role === "admin") {
      return res.status(404).json({ message: "No admin account found for this Google email." });
    }
    if (mode !== "signup" && role === "dermatologist") {
      return res.status(404).json({ message: "No doctor account found for this Google email. Switch to Sign Up to enter your PMDC number." });
    }
    if (req.body.acceptTerms !== true) {
      return res.status(400).json({ message: "Please accept the Terms and Conditions." });
    }

    // public signup can never create an admin
    const safeRole = role === "dermatologist" ? "dermatologist" : "patient";
    const pmdcNumber = String(req.body.pmdcNumber || "").trim();
    if (safeRole === "dermatologist" && !PMDC_PATTERN.test(pmdcNumber)) {
      return res.status(400).json({ message: "Enter a valid PMDC number: 4–6 digits, a hyphen, and one letter (for example, 12345-P)." });
    }

    user = await User.create({
      name: (decoded.name || email.split("@")[0]).trim(),
      email,
      googleId,
      hasPassword: false,
      role: safeRole,
      pmdcNumber: safeRole === "dermatologist" ? pmdcNumber.toUpperCase() : "",
      termsAcceptedAt: new Date(),
      termsVersion: "1.0",
    });
    sendUser(user, 201, res);
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(500).json({ message: "Google sign-in failed. Please try again." });
  }
};

const requestPasswordReset = async (req, res) => {
  const genericMessage = "If an account exists for this email, a password reset link has been sent. Check your inbox and spam folder.";
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: genericMessage });

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl.replace(/\/$/, "")}/?resetToken=${token}`;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: "Reset your AcneCare AI password",
        text: `Use this link to reset your password within one hour: ${resetUrl}`,
        html: `<p>We received a request to reset your AcneCare AI password.</p><p><a href="${resetUrl}">Choose a new password</a></p><p>This link expires in one hour. If you didn't request this, you can ignore this email.</p>`,
      });
      return res.json({ message: genericMessage });
    }

    if (process.env.NODE_ENV !== "production") {
      return res.json({ message: "SMTP is not configured. Use this development reset link:", resetUrl });
    }
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(503).json({ message: "Password reset email is temporarily unavailable. Please try again later." });
  } catch (error) {
    console.error("Password Reset Request Error:", error.message);
    return res.status(500).json({ message: "Could not send a password reset link. Please try again." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "Use a valid reset link and a password of at least 6 characters." });
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires");
    if (!user) return res.status(400).json({ message: "This password reset link is invalid or has expired. Request a new one." });

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return res.json({ message: "Your password has been reset. You can now sign in." });
  } catch (error) {
    console.error("Password Reset Error:", error.message);
    return res.status(500).json({ message: "Could not reset your password. Please try again." });
  }
};

// @route GET /api/auth/me   (protected)
const getMe = (req, res) => {
  res.json(req.user);
};

// @route PUT /api/auth/profile   (protected)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.avatar !== undefined) {
      const avatar = String(req.body.avatar);
      if (avatar.length > 3 * 1024 * 1024) {
        return res.status(400).json({ message: "Profile photo is too large. Maximum size is 2 MB." });
      }
      if (avatar.startsWith("data:image/") && !/^data:image\/(jpeg|png|webp);base64,/i.test(avatar)) {
        return res.status(400).json({ message: "Use a JPG, PNG, or WEBP profile photo." });
      }
    }

   const allowed = ["name","email","avatar","phone","age","gender","skinType",
                     "spec","exp","fee","ofee","qual","available","days","bio",
                     "bankName","accountTitle","accountNumber","iban","jazzcash","easypaisa","platforms","startTime","endTime"];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) user[f] = req.body[f];
    });

    if (req.body.email !== undefined) {
      const email = String(req.body.email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Enter a valid email address" });
      }
      const existing = await User.findOne({ email, _id: { $ne: user._id } });
      if (existing) return res.status(409).json({ message: "That email is already in use" });
      user.email = email;
    }

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
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const { deleteFile } = require("../services/fileStorage");

// DELETE /api/auth/my-images   — saari scan images delete karo
const deleteMyImages = async (req, res) => {
  try {
    const scans = await Scan.find({ patient: req.user._id, imageUrl: { $ne: "" } });
    await Promise.all(scans.map((s) => deleteFile(s.imageUrl)));
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
    const { password, confirm } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password) {
      if (!password) {
        return res.status(400).json({ message: "Password is required to delete your account" });
      }
      if (!(await user.matchPassword(password))) {
        return res.status(401).json({ message: "Incorrect password" });
      }
    } else if (confirm !== "DELETE") {
      // Google-only account: koi password nahi, isliye DELETE type karwao
      return res.status(400).json({ message: "Type DELETE to confirm account deletion" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin accounts cannot be self-deleted" });
    }

    // saari files hatao: scan photos, licence, payment receipts
    const scans = await Scan.find({ patient: user._id, imageUrl: { $ne: "" } });
    const appts = await Appointment.find({
      $or: [{ patient: user._id }, { doctor: user._id }],
      paymentProof: { $nin: [null, ""] },
    });
    await Promise.all([
      ...scans.map((s) => deleteFile(s.imageUrl)),
      ...appts.map((a) => deleteFile(a.paymentProof)),
      deleteFile(user.licenseDoc),
    ]);

    // saara data delete
    await Scan.deleteMany({ patient: user._id });
    await Prescription.deleteMany({ patient: user._id });
    await Message.deleteMany({ $or: [{ sender: user._id }, { recipient: user._id }] });
    await Notification.deleteMany({ $or: [{ recipient: user._id }, { actor: user._id }] });
    await Appointment.deleteMany({
      $or: [{ patient: user._id }, { doctor: user._id }],
    });
    await user.deleteOne();

    res.json({ message: "Your account and all associated data have been permanently deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { register, login, googleAuth, requestPasswordReset, resetPassword, getMe, updateProfile, deleteMyImages, deleteAccount };
