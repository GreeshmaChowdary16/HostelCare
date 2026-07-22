import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    refreshToken: String,
    ip: String,
    userAgent: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: Date,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "rector", "admin"],
      default: "student",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    refreshTokens: [String],
    sessions: [sessionSchema],
    lastLoginAt: Date,
    phone: {
      type: String,
      default: "",
    },
    parentPhone: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    rollNo: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      default: "",
    },
    roomInfo: {
      type: String,
      default: "",
    },
    office: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    leaveApplications: [
      {
        startDate: Date,
        endDate: Date,
        reason: String,
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        reviewedBy: {
          type: String,
          default: "",
        },
        reviewedAt: Date,
        note: {
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

export default mongoose.model("User", userSchema);