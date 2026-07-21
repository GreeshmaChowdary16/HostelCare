import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  applyGatePass,
  getGatePasses,
  updateGatePassStatus,
} from "../controllers/gatePassController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("student"), upload.single("proof"), applyGatePass);
router.get("/", protect, authorizeRoles("student", "rector", "admin"), getGatePasses);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("rector", "admin"),
  updateGatePassStatus
);

export default router;
