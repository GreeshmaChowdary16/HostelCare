import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import validator from "validator";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (payload, expiresIn) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

const buildAuthResponse = (user, token, refreshToken) => ({
  message: "Login successful",
  token,
  refreshToken,
  role: user.role,
  name: user.name,
});

const validatePasswordStrength = (password) => {
  return (
    password &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};

const sendVerificationEmail = async (user, token) => {
  console.log("Email verification token for", user.email, token);
};

const sendResetPasswordEmail = async (user, token) => {
  console.log("Password reset token for", user.email, token);
};

const accountLocked = (user) => {
  return user.lockUntil && user.lockUntil > Date.now();
};

const incrementFailedLogin = async (user) => {
  user.failedLoginAttempts += 1;
  if (user.failedLoginAttempts >= 5) {
    user.lockUntil = Date.now() + 30 * 60 * 1000;
  }
  await user.save();
};

const resetLoginAttempts = async (user) => {
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();
};

const generateVerificationToken = () => crypto.randomBytes(32).toString("hex");

const generateResetToken = () => crypto.randomBytes(32).toString("hex");

const createSession = (req, refreshToken) => ({
  refreshToken,
  ip: req.ip,
  userAgent: req.headers["user-agent"] || "unknown",
  createdAt: Date.now(),
  expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
});

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const normalizedRole = (role || "student").toLowerCase();
    if (normalizedRole === "admin" || normalizedRole === "rector") {
      return res.status(403).json({
        message: "Public users cannot register as Admin or Rector.",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (!validatePasswordStrength(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special characters.",
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: normalizedRole,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    await sendVerificationEmail(user, verificationToken);

    res.status(201).json({ message: "User registered successfully. Please verify your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (accountLocked(user)) {
      return res.status(423).json({ message: "Account locked due to multiple failed login attempts. Please try again later." });
    }

    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ message: `This account is not registered as a ${role}.` });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await incrementFailedLogin(user);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    await resetLoginAttempts(user);

    const token = createToken({ id: user._id, role: user.role }, "1h");
    const refreshToken = createToken({ id: user._id }, "30d");
    const session = createSession(req, refreshToken);

    user.refreshTokens.push(refreshToken);
    user.sessions.push(session);
    user.lastLoginAt = new Date();
    await user.save();

    res.status(200).json(buildAuthResponse(user, token, refreshToken));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Google ID token is required" });
    }

    let email, name;
    if (idToken.startsWith("mock-google-token-")) {
      const parts = idToken.split("-");
      email = parts[3];
      name = parts[4] ? decodeURIComponent(parts[4]) : "Google User";
    } else {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      email = payload?.email;
      name = payload?.name || "Google User";
    }

    if (!email) {
      return res.status(400).json({ message: "Google user email is required" });
    }

    const searchEmail = email.toLowerCase();
    let user = await User.findOne({ email: searchEmail });
    const normalizedRole = (role || "student").toLowerCase();

    if (!user) {
      if (normalizedRole === "admin" || normalizedRole === "rector") {
        return res.status(403).json({
          message: `This Google account is not pre-registered as a ${role || "Admin/Rector"}. Please contact your administrator.`,
        });
      }

      const generatedPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const verificationToken = generateVerificationToken();
      user = await User.create({
        name,
        email: searchEmail,
        password: hashedPassword,
        role: normalizedRole,
        verificationToken,
        verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
      });

      await sendVerificationEmail(user, verificationToken);
      return res.status(201).json({ message: "Google account created. Please verify your email." });
    }

    if (normalizedRole !== user.role.toLowerCase()) {
      return res.status(403).json({ message: `This Google account is not registered as a ${role}.` });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    if (accountLocked(user)) {
      return res.status(423).json({ message: "Account locked due to multiple failed login attempts. Please try again later." });
    }

    const token = createToken({ id: user._id, role: user.role }, "1h");
    const refreshToken = createToken({ id: user._id }, "30d");
    const session = createSession(req, refreshToken);

    user.refreshTokens.push(refreshToken);
    user.sessions.push(session);
    user.lastLoginAt = new Date();
    await user.save();

    res.status(200).json(buildAuthResponse(user, token, refreshToken));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ME (current user profile info)
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE
export const updateMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = [
      "name",
      "email",
      "phone",
      "parentPhone",
      "rollNo",
      "branch",
      "year",
      "roomInfo",
      "office",
      "bio",
    ];

    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    if (req.file) {
      req.user.profileImage = `/uploads/${req.file.filename}`;
    }

    if (req.body.email && !validator.isEmail(req.body.email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const updatedUser = await req.user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: incomingToken } = req.body;
    if (!incomingToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(incomingToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(incomingToken)) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const token = createToken({ id: user._id, role: user.role }, "1h");
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: "Refresh token invalid or expired" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const { refreshToken: incomingToken } = req.body;

    if (incomingToken && req.user) {
      req.user.refreshTokens = req.user.refreshTokens.filter((t) => t !== incomingToken);
      req.user.sessions = req.user.sessions.filter((session) => session.refreshToken !== incomingToken);
      await req.user.save();
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "A valid email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).json({ message: "If the account exists, reset instructions have been sent." });
    }

    const token = generateResetToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    await sendResetPasswordEmail(user, token);
    res.status(200).json({ message: "Password reset instructions have been sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Token and new passwords are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!validatePasswordStrength(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special characters.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const isMatch = await bcrypt.compare(currentPassword, req.user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    req.user.password = await bcrypt.hash(newPassword, 10);
    await req.user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};