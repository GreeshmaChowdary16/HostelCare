import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Food Wastage", "Infrastructure", "Attendance", "Other"],
      default: "Other",
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [String],
    reportDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Open", "Reviewed", "Closed"],
      default: "Open",
    },
    comments: [
      {
        by: String,
        message: String,
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

export default mongoose.model("Report", reportSchema);
