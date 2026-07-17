import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  createNotification,
  getNotifications,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createNotification);
router.get("/", protect, getNotifications);
router.delete("/:id", protect, authorizeRoles("admin"), deleteNotification);

export default router;
