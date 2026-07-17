import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    monthYear: {
      type: String,
      required: true,
    },
    daysInMonth: {
      type: Number,
      required: true,
    },
    firstDay: {
      type: Number,
      required: true,
    },
    records: [
      {
        day: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["present", "leave", "not_marked"],
          required: true,
        },
        method: {
          type: String,
          default: "Face Scan",
        },
        time: {
          type: String,
          default: "N/A",
        },
        details: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ student: 1, monthYear: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
