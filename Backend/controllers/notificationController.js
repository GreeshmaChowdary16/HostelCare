import Notification from "../models/Notification.js";

export const createNotification = async (req, res) => {
  try {
    const { title, content, category, target } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const notification = await Notification.create({
      title,
      content,
      category: category || "Info",
      target: target || "All",
      author: req.user._id,
    });

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const role = req.user.role;
    let filter = {};

    if (role === "student") {
      filter.target = { $in: ["All", "Students"] };
    } else if (role === "rector") {
      filter.target = { $in: ["All", "Rectors"] };
    } else if (role === "admin") {
      filter = {};
    }

    const notifications = await Notification.find(filter)
      .populate("author", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.deleteOne();
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
