const mongoose = require("mongoose");

const medSchema = new mongoose.Schema({
  n: { type: String, required: true },   // medicine name
  t: { type: String, required: true },   // Topical / Oral
  u: { type: String, required: true },   // usage instructions
  d: { type: String, required: true },   // duration
}, { _id: false });

const skincareSchema = new mongoose.Schema({
  product: { type: String, required: true },
  step:    { type: String, required: true },
  tip:     { type: String, default: "" },
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  patient:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  meds:        [medSchema],
  skincare:    [skincareSchema],
  instructions: { type: String, default: "" },
  dietAdvice:   { type: String, default: "" },
  followUp:     { type: String, default: "" },
}, { timestamps: true });

prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ doctor: 1, createdAt: -1 });

module.exports = mongoose.model("Prescription", prescriptionSchema);