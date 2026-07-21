import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  getAttendance,
  upsertAttendance,
  getStudentAttendance,
  updateAttendance,
  deleteAttendance,
  attendanceAnalytics,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("student", "rector", "admin"), getAttendance);
router.get("/student/:studentId", protect, authorizeRoles("rector", "admin"), getStudentAttendance);
router.post("/", protect, authorizeRoles("student", "rector", "admin"), upsertAttendance);
router.put("/:id", protect, authorizeRoles("rector", "admin"), updateAttendance);
router.delete("/:id", protect, authorizeRoles("rector", "admin"), deleteAttendance);
router.get("/analytics", protect, authorizeRoles("rector", "admin"), attendanceAnalytics);

export default router;
