import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  getRectors,
  createRector,
  updateRector,
  deleteRector,
  getRectorLeaveApplications,
  applyRectorLeave,
  updateRectorLeaveStatus,
} from "../controllers/rectorController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "rector"), getRectors);
router.post("/", protect, authorizeRoles("admin"), createRector);
router.put("/:id", protect, authorizeRoles("admin"), updateRector);
router.delete("/:id", protect, authorizeRoles("admin"), deleteRector);

router.get("/:id/leaves", protect, authorizeRoles("admin", "rector"), getRectorLeaveApplications);
router.post("/:id/leaves", protect, authorizeRoles("admin", "rector"), applyRectorLeave);
router.put("/:id/leaves/:leaveId", protect, authorizeRoles("admin"), updateRectorLeaveStatus);

export default router;
