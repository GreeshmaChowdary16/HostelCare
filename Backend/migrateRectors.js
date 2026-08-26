import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config({ path: "../.env" });
dotenv.config();

const rectorUpdates = [
  {
    oldEmail: "rector@hostelcare.com",
    email: "rectorf@hostelcare.com",
    gender: "girls",
    office: "Girls Hostel A - Room 101",
  },
  {
    oldEmail: "rector2@hostelcare.com",
    email: "rectorm@hostelcare.com",
    gender: "boys",
    office: "Boys Hostel B - Room 102",
  },
];

try {
  await mongoose.connect(process.env.MONGO_URI);

  for (const update of rectorUpdates) {
    const oldRector = await User.findOne({ email: update.oldEmail, role: "rector" });
    const newRector = await User.findOne({ email: update.email, role: "rector" });

    if (oldRector && newRector && oldRector._id.toString() !== newRector._id.toString()) {
      throw new Error(`Cannot rename ${update.oldEmail}: ${update.email} is already in use`);
    }

    const rector = oldRector || newRector;

    if (!rector) {
      console.log(`Rector not found: ${update.oldEmail}`);
      continue;
    }

    rector.email = update.email;
    rector.gender = update.gender;
    rector.office = update.office;
    await rector.save();
    console.log(`Updated ${update.oldEmail} -> ${update.email}`);
  }
} finally {
  await mongoose.disconnect();
}