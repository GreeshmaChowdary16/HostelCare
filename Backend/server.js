import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import gatePassRoutes from "./routes/gatePassRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import messReviewRoutes from "./routes/messReviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/gatepass", gatePassRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/mess-reviews", messReviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
    console.log("Root route hit");
    res.send("HostelCare Backend Running");
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});