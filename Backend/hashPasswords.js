import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const isBcryptHash = (str) => {
  return typeof str === "string" && /^\$2[aby]\$/.test(str);
};

const run = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const users = await User.find({});
    console.log(`Found ${users.length} user(s)`);

    let updated = 0;
    for (const user of users) {
      const pwd = user.password;
      if (!pwd || isBcryptHash(pwd)) continue;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pwd, salt);
      user.password = hash;
      await user.save();
      updated++;
      console.log(`Hashed password for user: ${user.email}`);
    }

    console.log(`Completed. Updated ${updated} user(s).`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

run();
