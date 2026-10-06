const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["online", "physical"], 
    required: true 
  },
  platform: {
    type: String,
    enum: ["zoom", "google_meet", "whatsapp", ""],
    default: ""
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending" 
  },
  meetingLink: { 
    type: String, 
    default: "" 
  },
  severity:  { type: String, default: "" },
  acneType:  { type: String, default: "" },
  paymentStatus: { 
    type: String, 
    enum: ["unpaid", "pending_verification", "paid", "rejected"],
    default: "unpaid" 
  },
  consultationFee: { type: Number, default: 0 },
  notes: { type: String, default: "" },

  paymentProof:  { type: String, default: "" },
  transactionRef:{ type: String, default: "" },
  paidAt:        { type: Date },
  verifiedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  paymentNote:   { type: String, default: "" },

}, { timestamps: true });

// fast lookups for "my appointments"
appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: -1 });

module.exports = mongoose.model("Appointment", appointmentSchema);