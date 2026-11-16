const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription", required: true, index: true },
  sender:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text:        { type: String, required: true, trim: true, maxlength: 2000 },
  channel:     { type: String, enum: ["chat", "instruction"], default: "chat", index: true },
  read:        { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ prescription: 1, createdAt: 1 });
messageSchema.index({ prescription: 1, channel: 1, createdAt: -1 });
messageSchema.index({ prescription: 1, recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
