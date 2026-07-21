import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["Electrician", "Plumber", "Carpenter", "Cleaning", "Security", "IT Support"],
      required: true,
    },
    subCategory: {
      type: String,
      default: null,
    },
    problem: {
      type: String,
      required: true,
    },
    proof: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Urgent"],
      default: "Normal",
    },
    escalationReason: {
      type: String,
      default: "",
    },
    assignedWorker: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      category: { type: String, default: "" },
      availability: { type: String, default: "" },
    },
    history: [
      {
        status: { type: String, default: "Pending" },
        note: { type: String, default: "Complaint created" },
        updatedBy: { type: String, default: "System" },
        role: { type: String, default: "System" },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Complaint", complaintSchema);
