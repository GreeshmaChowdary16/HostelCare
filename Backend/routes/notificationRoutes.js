import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  createNotification,
  getNotifications,
  deleteNotification,
  markNotificationRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "rector"), createNotification);
router.get("/", protect, getNotifications);
router.put("/:id/read", protect, authorizeRoles("admin", "rector", "student"), markNotificationRead);
router.delete("/:id", protect, authorizeRoles("admin"), deleteNotification);

export default router;
