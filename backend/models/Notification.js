const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
  type: {
    type: String,
    enum: ["appointment_booked", "payment_proof", "payment_verified", "payment_rejected", "meeting_link", "appointment_status", "chat_message", "doctor_instructions",
           "platform_fee_submitted", "platform_fee_verified", "platform_fee_rejected"],
    required: true,
  },
  title: { type: String, required: true, maxlength: 120 },
  message: { type: String, required: true, maxlength: 400 },
  targetPage: { type: String, default: "dashboard" },
  read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
