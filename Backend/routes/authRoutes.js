import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  refreshToken,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
  changePassword,
} from "../controllers/authController.js";
import protect, { protectWithPassword } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", authRateLimiter, registerUser);
router.post("/login", authRateLimiter, loginUser);
router.post("/google-login", authRateLimiter, googleLogin);
router.post("/refresh-token", refreshToken);
router.post("/logout", protect, logoutUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", authRateLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.put("/me", protect, upload.single("profileImage"), updateMe);
router.post("/change-password", protectWithPassword, changePassword);

export default router;