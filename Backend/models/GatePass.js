import mongoose from "mongoose";

const gatePassSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    noOfDays: {
      type: Number,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    parentContactNo: {
      type: String,
      required: true,
    },
    timeFrom: {
      type: String,
      default: "09:00 AM",
    },
    timeTo: {
      type: String,
      default: "06:00 PM",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    isExtension: {
      type: Boolean,
      default: false,
    },
    parentMobile: {
      type: String,
      default: "",
    },
    proof: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("GatePass", gatePassSchema);
