const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const recipient = req.user._id;
    const notificationQuery = Notification.find({ recipient }).sort({ createdAt: -1 });
    if (req.query.all !== "true") notificationQuery.limit(40);
    const [notifications, unreadCount] = await Promise.all([
      notificationQuery.lean(),
      Notification.countDocuments({ recipient, read: false }),
    ]);
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Could not load notifications" });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Notification not found" });
    }
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { $set: { read: true } },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Could not update notification" });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { $set: { read: true } });
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Could not update notifications" });
  }
};

module.exports = { getNotifications, markNotificationRead, markAllNotificationsRead };
