import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  updateComplaintStatus,
  escalateComplaint,
  getComplaintTimeline,
} from "../controllers/complaintController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("student"), upload.single("proof"), createComplaint);
router.get("/", protect, authorizeRoles("student", "rector", "admin"), getComplaints);
router.get("/:id", protect, authorizeRoles("student", "rector", "admin"), getComplaintById);
router.put("/:id", protect, authorizeRoles("rector", "admin"), upload.single("proof"), updateComplaint);
router.delete("/:id", protect, authorizeRoles("admin"), deleteComplaint);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("rector", "admin"),
  updateComplaintStatus
);
router.post("/:id/escalate", protect, authorizeRoles("rector", "admin"), escalateComplaint);
router.get("/:id/timeline", protect, authorizeRoles("student", "rector", "admin"), getComplaintTimeline);

export default router;
