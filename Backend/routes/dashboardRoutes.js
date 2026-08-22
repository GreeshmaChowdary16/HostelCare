import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  getStudentDashboard,
  getRectorDashboard,
  getAdminDashboard,
  getDashboardAnalytics,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", protect, getDashboardAnalytics);
router.get("/analytics", protect, getDashboardAnalytics);

router.get("/student", protect, authorizeRoles("student"), getStudentDashboard);
router.get("/rector", protect, authorizeRoles("rector"), getRectorDashboard);
router.get("/admin", protect, authorizeRoles("admin"), getAdminDashboard);

export default router;