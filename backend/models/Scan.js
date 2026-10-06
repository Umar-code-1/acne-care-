const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
  patient:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl:   { type: String, default: "" },
  acneType:   { type: String, default: "" },
  severity:   { type: String, enum: ["Clear","Mild","Moderate","Severe"], default: "Clear" },
  confidence: { type: Number, default: 0, min: 0, max: 100 },
  skinType:   { type: String, default: "" },
  probs:      { type: Map, of: Number, default: {} },
  notes:      { type: String, default: "" },
  questionnaire: {
    waterIntake: { type: Number, default: 0 },
    sleep:       { type: Number, default: 0 },
    stress:      { type: Number, default: 0 },
    diet:        { type: String, default: "" },
    exercise:    { type: String, default: "" },
  
    cystFlag:   { type: Boolean, default: false },
  cystProb:   { type: Number, default: 0 },
  }
  
}, { timestamps: true });

scanSchema.index({ patient: 1, createdAt: -1 });

module.exports = mongoose.model("Scan", scanSchema);