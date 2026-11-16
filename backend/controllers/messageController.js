const mongoose = require("mongoose");
const Message = require("../models/Message");
const Prescription = require("../models/Prescription");
const { createNotifications } = require("../services/notifications");

const getConversationForChannel = async (req, res, channel) => {
  try {
    const { prescriptionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(prescriptionId)) {
      return res.status(404).json({ message: "Skincare plan not found" });
    }

    const prescription = await Prescription.findById(prescriptionId).select("patient doctor appointment");
    if (!prescription) return res.status(404).json({ message: "Skincare plan not found" });

    const currentUserId = req.user._id.toString();
    const patientId = prescription.patient.toString();
    const doctorId = prescription.doctor.toString();
    if (currentUserId !== patientId && currentUserId !== doctorId) {
      return res.status(403).json({ message: "You cannot view this conversation" });
    }

    if (channel === "chat") {
      await Message.updateMany(
        { prescription: prescription._id, recipient: req.user._id, read: { $ne: true }, channel: { $ne: "instruction" } },
        { $set: { read: true } }
      );
    }

    const channelFilter = channel === "chat"
      ? { $or: [{ channel: "chat" }, { channel: { $exists: false } }] }
      : { channel };
    const recentMessages = await Message.find({ prescription: prescription._id, ...channelFilter })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("sender", "name role")
      .lean();

    return res.json({
      currentUserId: req.user._id,
      messages: recentMessages.reverse().map((message) => ({
        id: message._id,
        senderId: message.sender?._id,
        senderName: message.sender?.name || "User",
        senderRole: message.sender?.role,
        text: message.text,
        createdAt: message.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not load messages" });
  }
};

const getConversation = (req, res) => getConversationForChannel(req, res, "chat");
const getInstructions = (req, res) => getConversationForChannel(req, res, "instruction");

const getUnreadCounts = async (req, res) => {
  try {
    const counts = await Message.aggregate([
      {
        $match: {
          recipient: req.user._id,
          channel: { $ne: "instruction" },
          read: { $ne: true },
        },
      },
      { $group: { _id: "$prescription", count: { $sum: 1 } } },
    ]);
    res.json(Object.fromEntries(counts.map(({ _id, count }) => [String(_id), count])));
  } catch (error) {
    res.status(500).json({ message: "Could not load unread message counts" });
  }
};

const sendMessageToChannel = async (req, res, channel) => {
  try {
    const { prescriptionId } = req.params;
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
    if (!mongoose.Types.ObjectId.isValid(prescriptionId)) {
      return res.status(404).json({ message: "Skincare plan not found" });
    }
    if (!text) return res.status(400).json({ message: "Write a message before sending" });
    if (text.length > 2000) return res.status(400).json({ message: "Messages can be up to 2,000 characters" });

    const prescription = await Prescription.findById(prescriptionId).select("patient doctor appointment");
    if (!prescription) return res.status(404).json({ message: "Skincare plan not found" });

    if (channel === "instruction" && req.user.role !== "dermatologist") {
      return res.status(403).json({ message: "Only the dermatologist can send plan instructions" });
    }

    const senderId = req.user._id.toString();
    const doctorId = prescription.doctor.toString();
    if (channel === "instruction" && senderId !== doctorId) {
      return res.status(403).json({ message: "You cannot send messages in this conversation" });
    }

    if (channel === "chat" && senderId !== doctorId && senderId !== prescription.patient.toString()) {
      return res.status(403).json({ message: "You cannot send messages in this conversation" });
    }

    const recipient = channel === "instruction"
      ? prescription.patient
      : senderId === doctorId ? prescription.patient : prescription.doctor;
    const message = await Message.create({
      prescription: prescription._id,
      sender: req.user._id,
      recipient,
      text,
      channel,
    });

    const notificationType = channel === "instruction" ? "doctor_instructions" : "chat_message";
    const actorName = req.user.role === "dermatologist"
      ? (req.user.name?.startsWith("Dr.") ? req.user.name : `Dr. ${req.user.name || "Dermatologist"}`)
      : req.user.name || "Your patient";
    await createNotifications({
      recipients: [{ id: recipient, targetPage: "prescriptions" }],
      actor: req.user._id,
      appointment: prescription.appointment,
      prescription: prescription._id,
      type: notificationType,
      title: channel === "instruction"
        ? `New instructions from ${actorName}`
        : `New message from ${actorName}`,
      message: channel === "instruction"
        ? "Your dermatologist sent you new skincare instructions."
        : "You have a new message about a skincare plan.",
    });

    return res.status(201).json({
      message: {
        id: message._id,
        senderId: req.user._id,
        senderName: req.user.name,
        senderRole: req.user.role,
        text: message.text,
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    console.error("Prescription chat message send failed", {
      prescriptionId: req.params.prescriptionId,
      userId: req.user?._id?.toString(),
      name: error.name,
      message: error.message,
    });
    return res.status(500).json({ message: "Could not send message" });
  }
};

const sendMessage = (req, res) => sendMessageToChannel(req, res, "chat");
const sendInstruction = (req, res) => sendMessageToChannel(req, res, "instruction");

module.exports = { getConversation, sendMessage, getInstructions, sendInstruction, getUnreadCounts };
