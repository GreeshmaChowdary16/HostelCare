import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feeType: {
      type: String,
      enum: ["Hostel Fee", "Mess Fee", "Maintenance Fee", "Caution Deposit", "Other"],
      required: true,
      default: "Hostel Fee",
    },
    academicYear: {
      type: String,
      required: true,
      default: "2025-2026",
    },
    semester: {
      type: String,
      required: true,
      default: "Semester 1",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Partial", "Overdue"],
      default: "Pending",
    },
    paymentDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Net Banking", "Card", "Cash", "Bank Transfer", "N/A"],
      default: "N/A",
    },
    transactionId: {
      type: String,
      default: "",
    },
    receiptNo: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Fee", feeSchema);
