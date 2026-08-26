import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
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
  email: user.email,
  profileImage: user.profileImage || "",
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

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: { user, pass },
  });
};

const sendVerificationEmail = async (user, token) => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || 'no-reply@hostelcare.local';
  const subject = 'HostelCare — Email Verification';
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email`;
  const text = `Hello ${user.name || ''},\n\nUse the following verification token to verify your email for HostelCare:\n\n${token}\n\nOr visit: ${verifyUrl}\n\nThis token expires in 24 hours.`;

  if (!transporter) {
    console.log('Email verification token for', user.email, token);
    return;
  }

  await transporter.sendMail({
    from,
    to: user.email,
    subject,
    text,
    html: `<p>Hello ${user.name || ''},</p><p>Use the following verification token to verify your email for HostelCare:</p><pre>${token}</pre><p>Or click <a href="${verifyUrl}">${verifyUrl}</a></p><p>This token expires in 24 hours.</p>`,
  });
};

const sendResetPasswordEmail = async (user, token) => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || 'no-reply@hostelcare.local';
  const subject = 'HostelCare — Password Reset';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
  const directResetUrl = `${frontendUrl}/reset-password/${token}`;
  const text = `Hello ${user.name || ''},\n\nUse the following token to reset your HostelCare password:\n\n${token}\n\nOr click here to reset directly: ${directResetUrl}\n\nThis token expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`;

  if (!transporter) {
    console.log('Password reset token for', user.email, token);
    return;
  }

  await transporter.sendMail({
    from,
    to: user.email,
    subject,
    text,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #2e384d; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #858796;">Hello ${user.name || 'User'},</p>
          <p style="color: #858796;">You requested a password reset for your HostelCare account. Use the code below or click the button to reset your password.</p>
        </div>

        <div style="background-color: #e3f2fd; padding: 15px; border-left: 4px solid #1976d2; margin: 20px 0; border-radius: 3px;">
          <p style="color: #2e384d; margin: 0; font-size: 18px; font-weight: bold; word-break: break-all;">${token}</p>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${directResetUrl}" style="display: inline-block; background-color: #1cc88a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>

        <p style="color: #858796; font-size: 13px;">Token expires in <strong>1 hour</strong>.</p>
        <p style="color: #858796; font-size: 13px;">If you didn't request this email, you can safely ignore it.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #858796; font-size: 12px; text-align: center;">© HostelCare. All rights reserved.</p>
      </div>
    `,
  });
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
    const {
      name,
      email,
      password,
      role,
      phone,
      parentPhone,
      rollNo,
      branch,
      year,
      state,
      roomInfo,
      gender,
      bio,
    } = req.body;

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
      phone: phone || "",
      parentPhone: parentPhone || "",
      rollNo: rollNo || "",
      branch: branch || "",
      year: year || "",
      state: state || "",
      roomInfo: roomInfo || "",
      gender: gender || "",
      nativePlace: req.body.nativePlace || "",
      bio: bio || "",
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

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const user = await User.findOne({ email: cleanEmail });
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
      user = await User.create({
        name,
        email: searchEmail,
        password: hashedPassword,
        role: normalizedRole,
        isEmailVerified: true,
      });
    }

    if (normalizedRole !== user.role.toLowerCase()) {
      return res.status(403).json({ message: `This Google account is not registered as a ${role}.` });
    }

    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
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
      "state",
      "roomInfo",
      "nativePlace",
      "office",
      "staffId",
      "shift",
      "bio",
    ];

    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    if (req.file) {
      req.user.profileImage = `/uploads/${req.file.filename}`;
    } else if (req.body.removeProfileImage === "true" || req.body.removeProfileImage === true || req.body.profileImage === "") {
      req.user.profileImage = "";
    } else if (req.body.profileImage && typeof req.body.profileImage === "string") {
      req.user.profileImage = req.body.profileImage;
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

export const requestEmailVerification = async (req, res) => {
  try {
    const { email, name, role } = req.body;
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "A valid email is required" });
    }

    const searchEmail = email.toLowerCase();
    let user = await User.findOne({ email: searchEmail });
    const normalizedRole = (role || "student").toLowerCase();

    if (user && user.isEmailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    if (normalizedRole === "admin" || normalizedRole === "rector") {
      return res.status(403).json({ message: "Cannot request verification for Admin/Rector via this flow." });
    }

    const verificationToken = generateVerificationToken();

    if (!user) {
      const generatedPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      user = await User.create({
        name: name || "Google User",
        email: searchEmail,
        password: hashedPassword,
        role: normalizedRole,
        verificationToken,
        verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
      });
    } else {
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
      await user.save();
    }

    await sendVerificationEmail(user, verificationToken);

    res.status(200).json({ message: "Verification token generated and sent (check server logs in development)." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};