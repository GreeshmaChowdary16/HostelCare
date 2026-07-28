import Announcement from "../models/Announcement.js";
import { emitRealtimeEvent } from "../config/socket.js";

// Create Announcement (Rector/Admin only)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, color } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      category: category || "Event",
      color: color || "#4e73df",
      author: req.user._id,
    });

    emitRealtimeEvent("announcement_created", announcement);

    res.status(201).json({
      message: "Announcement posted successfully",
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Announcements (All authenticated users)
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("author", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Announcement (Rector/Admin only)
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
      });
    }

    await announcement.deleteOne();
    emitRealtimeEvent("announcement_deleted", { id });

    res.status(200).json({
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
