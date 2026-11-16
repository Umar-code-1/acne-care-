const Notification = require("../models/Notification");
const User = require("../models/User");

const getAdminIds = async () => {
  try {
    return await User.find({ role: "admin" }).distinct("_id");
  } catch (error) {
    console.error("Could not load notification admins:", error.message);
    return [];
  }
};

const createNotifications = async ({ recipients, actor, appointment, prescription, type, title, message }) => {
  const uniqueRecipients = [...new Map(
    recipients.filter((item) => item?.id).map((item) => [String(item.id), item])
  ).values()];
  if (!uniqueRecipients.length) return;

  try {
    await Notification.insertMany(uniqueRecipients.map(({ id, targetPage }) => ({
      recipient: id,
      actor,
      appointment,
      prescription,
      type,
      title,
      message: String(message).slice(0, 400),
      targetPage,
    })));
  } catch (error) {
    console.error("Could not create notifications:", error.message);
  }
};

module.exports = { createNotifications, getAdminIds };
