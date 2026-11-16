const mongoose = require("mongoose");

// Doctor ki monthly platform fee (12% of paid appointments).
// Amount hamesha live appointments se calculate hota hai; yeh record sirf
// payment / receipt / verification ka hisaab rakhta hai.
const platformFeeSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month:  { type: String, required: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ }, // "YYYY-MM"

  // snapshot at the last receipt submission
  appointmentCount: { type: Number, default: 0 },
  grossAmount:      { type: Number, default: 0 },
  rate:             { type: Number, default: 12 },
  feeAmount:        { type: Number, default: 0 },

  amountSubmitted: { type: Number, default: 0 }, // waiting for admin
  paidAmount:      { type: Number, default: 0 }, // verified total

  status: {
    type: String,
    enum: ["unpaid", "pending_verification", "paid", "rejected"],
    default: "unpaid",
  },
  proof:          { type: String, default: "" },
  transactionRef: { type: String, default: "" },
  submittedAt:    { type: Date },
  verifiedAt:     { type: Date },
  verifiedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note:           { type: String, default: "" }, // rejection reason
}, { timestamps: true });

platformFeeSchema.index({ doctor: 1, month: 1 }, { unique: true });
platformFeeSchema.index({ status: 1 });

module.exports = mongoose.model("PlatformFee", platformFeeSchema);
