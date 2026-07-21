import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { createReport, getReports, getReportById } from "../controllers/reportController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("rector"), createReport);
router.get("/", protect, authorizeRoles("rector", "admin"), getReports);
router.get("/:id", protect, authorizeRoles("rector", "admin"), getReportById);

export default router;
