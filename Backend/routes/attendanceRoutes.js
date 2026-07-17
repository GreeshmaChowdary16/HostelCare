import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { getAttendance, upsertAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("student", "rector", "admin"), getAttendance);
router.post("/", protect, authorizeRoles("student", "rector", "admin"), upsertAttendance);

export default router;
