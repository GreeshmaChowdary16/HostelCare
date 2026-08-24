import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import gatePassRoutes from "./routes/gatePassRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import messReviewRoutes from "./routes/messReviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import rectorRoutes from "./routes/rectorRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import messMenuRoutes from "./routes/messMenuRoutes.js";

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/gatepass", gatePassRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/mess-reviews", messReviewRoutes);
app.use("/api/mess-menu", messMenuRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/rectors", rectorRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/fees", feeRoutes);

app.get("/", (req, res) => {
  console.log("Root route hit");
  res.send("HostelCare Backend Running");
});

// Centralized Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});