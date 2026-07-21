import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  createWorker,
  getWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
  assignWorker,
  addWorkerAttendance,
} from "../controllers/workerController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createWorker);
router.get("/", protect, authorizeRoles("admin", "rector"), getWorkers);
router.get("/:id", protect, authorizeRoles("admin", "rector"), getWorkerById);
router.put("/:id", protect, authorizeRoles("admin"), updateWorker);
router.delete("/:id", protect, authorizeRoles("admin"), deleteWorker);
router.post("/assign", protect, authorizeRoles("admin", "rector"), assignWorker);
router.post("/:id/attendance", protect, authorizeRoles("admin", "rector"), addWorkerAttendance);

export default router;
