import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Electrician", "Plumber", "Carpenter", "Cleaning", "Security", "IT Support"],
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    availability: {
      type: String,
      enum: ["Available", "Busy", "Off"],
      default: "Available",
    },
    performanceScore: {
      type: Number,
      default: 0,
    },
    attendance: [
      {
        date: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["Present", "Absent", "Leave"],
          default: "Present",
        },
      },
    ],
    assignedComplaints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Worker", workerSchema);
