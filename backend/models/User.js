const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  // Google accounts can exist without a password until the user sets one
  password:  { type: String, required: function() { return !this.googleId; }, minlength: 6, select: false },
  googleId:  { type: String, unique: true, sparse: true },
  hasPassword: { type: Boolean, default: true },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  role:      { type: String,
               enum: ["patient","dermatologist","admin"],
               default: "patient" },
  avatar:    { type: String, default: "" },
  skinType:  { type: String, default: "" },
  phone:     { type: String, default: "" },
  age:       { type: Number },
  gender:    { type: String },
  isVerified:{ type: Boolean, default: false },

  // ---- dermatologist only ----
  
platforms: [{ type: String }],
  startTime: { type: String, default: "09:00" },
  endTime:   { type: String, default: "17:00" },

  spec:      { type: String, default: "" },
  exp:       { type: Number },
  rating:    { type: Number, default: 0, min: 0, max: 5 },
  fee:       { type: Number },
  ofee:      { type: Number },
  qual:      { type: String, default: "" },
  available: { type: Boolean, default: true },
  days:      [{ type: String }],
  bio:       { type: String, default: "" },
  termsAcceptedAt:   { type: Date },
  termsVersion:      { type: String, default: "" },
  consentImageAt:    { type: Date },

  bankName:      { type: String, default: "" },
  accountTitle:  { type: String, default: "" },
  accountNumber: { type: String, default: "" },
  iban:          { type: String, default: "" },
  jazzcash:      { type: String, default: "" },
  easypaisa:     { type: String, default: "" },
  // ---- verification (FR-12) ----
  pmdcNumber:     { type: String, default: "" },
  licenseDoc:     { type: String, default: "" },
  verifiedAt:     { type: Date },
  verifiedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rejectionReason:{ type: String, default: "" },
}, { timestamps: true });

userSchema.pre("save", async function() {
  if (!this.avatar && this.name) {
    this.avatar = this.name.charAt(0).toUpperCase();
  }
  if (!this.isModified("password") || !this.password) return;
  this.hasPassword = true;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(entered) {
  if (!this.password || typeof entered !== "string") return false;
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
