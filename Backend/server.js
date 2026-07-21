import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import gatePassRoutes from "./routes/gatePassRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import messReviewRoutes from "./routes/messReviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import rectorRoutes from "./routes/rectorRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/gatepass", gatePassRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/mess-reviews", messReviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/rectors", rectorRoutes);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
    console.log("Root route hit");
    res.send("HostelCare Backend Running");
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});