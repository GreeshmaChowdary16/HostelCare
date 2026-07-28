import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  createFee,
  bulkCreateFees,
  getFees,
  getMyFees,
  getFeeById,
  recordPayment,
  updateFee,
  deleteFee,
  getFeeStats,
} from "../controllers/feeController.js";

const router = express.Router();

// General & Role Specific Routes
router.get("/my-fees", protect, authorizeRoles("student"), getMyFees);
router.get("/stats", protect, authorizeRoles("admin", "rector"), getFeeStats);
router.get("/", protect, authorizeRoles("admin", "rector"), getFees);
router.get("/:id", protect, getFeeById);

// Admin & Rector Create/Update Routes
router.post("/", protect, authorizeRoles("admin", "rector"), createFee);
router.post("/bulk", protect, authorizeRoles("admin", "rector"), bulkCreateFees);

// Payment Recording
router.put("/:id/pay", protect, recordPayment);

// Admin & Rector Manage Routes
router.put("/:id", protect, authorizeRoles("admin", "rector"), updateFee);
router.delete("/:id", protect, authorizeRoles("admin", "rector"), deleteFee);

export default router;
