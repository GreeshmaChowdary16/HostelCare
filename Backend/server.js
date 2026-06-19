import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    console.log("Root route hit");
    res.send("HostelCare Backend Running");
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});