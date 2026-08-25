import mongoose from "mongoose";
import dns from "dns";

// Resolve DNS using public DNS servers to bypass misconfigured local loopback DNS / VPN resolver issues
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;