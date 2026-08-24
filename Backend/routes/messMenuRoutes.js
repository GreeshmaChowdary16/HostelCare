import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { getMessMenu, updateMessMenu } from "../controllers/messMenuController.js";

const router = express.Router();

router.get("/", protect, getMessMenu);
router.put("/", protect, authorizeRoles("admin", "rector"), updateMessMenu);

export default router;
