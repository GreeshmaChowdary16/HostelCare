import express from "express";
import { registerUser, loginUser, googleLogin, getMe, updateMe, changePassword } from "../controllers/authController.js";
import protect, { protectWithPassword } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/change-password", protectWithPassword, changePassword);

export default router;