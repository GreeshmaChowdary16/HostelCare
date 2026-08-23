import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { getStudents, getStudentStats, getStudentsByFloor, getLiveStudentStatus } from "../controllers/studentController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("rector", "admin"), getStudents);
router.get("/live-status", protect, authorizeRoles("rector", "admin"), getLiveStudentStatus);
router.get("/stats", protect, authorizeRoles("rector", "admin"), getStudentStats);
router.get("/floor/:floor", protect, authorizeRoles("rector", "admin"), getStudentsByFloor);

export default router;
