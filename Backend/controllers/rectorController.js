import bcrypt from "bcryptjs";
import User from "../models/User.js";

const rectorFields = [
  "name",
  "email",
  "phone",
  "office",
  "bio",
];

export const getRectors = async (req, res) => {
  try {
    const rectors = await User.find({ role: "rector" }).select(
      "name email phone office bio profileImage leaveApplications"
    );
    res.status(200).json(rectors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRector = async (req, res) => {
  try {
    const { name, email, password, phone, office, bio } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Rector with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password || "HostelCare@123", 10);

    const rector = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "rector",
      phone: phone || "",
      office: office || "",
      bio: bio || "",
    });

    res.status(201).json({ message: "Rector created successfully", rector });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRector = async (req, res) => {
  try {
    const rector = await User.findById(req.params.id);
    if (!rector || rector.role !== "rector") {
      return res.status(404).json({ message: "Rector not found" });
    }

    rectorFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        rector[field] = req.body[field];
      }
    });

    if (req.body.email) {
      rector.email = req.body.email.toLowerCase();
    }

    if (req.body.password) {
      rector.password = await bcrypt.hash(req.body.password, 10);
    }

    await rector.save();
    res.status(200).json({ message: "Rector updated successfully", rector });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRector = async (req, res) => {
  try {
    const rector = await User.findById(req.params.id);
    if (!rector || rector.role !== "rector") {
      return res.status(404).json({ message: "Rector not found" });
    }

    await rector.deleteOne();
    res.status(200).json({ message: "Rector deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRectorLeaveApplications = async (req, res) => {
  try {
    const rector = await User.findById(req.params.id).select("leaveApplications role");
    if (!rector || rector.role !== "rector") {
      return res.status(404).json({ message: "Rector not found" });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(rector.leaveApplications || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyRectorLeave = async (req, res) => {
  try {
    const rector = await User.findById(req.params.id);
    if (!rector || rector.role !== "rector") {
      return res.status(404).json({ message: "Rector not found" });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { startDate, endDate, reason } = req.body;
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: "startDate, endDate, and reason are required" });
    }

    rector.leaveApplications.push({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "Pending",
      appliedAt: new Date(),
    });

    await rector.save();
    res.status(201).json({ message: "Leave application submitted", leaveApplications: rector.leaveApplications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRectorLeaveStatus = async (req, res) => {
  try {
    const { id, leaveId } = req.params;
    const { status, note } = req.body;

    if (!status || !["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid leave status" });
    }

    const rector = await User.findById(id);
    if (!rector || rector.role !== "rector") {
      return res.status(404).json({ message: "Rector not found" });
    }

    const leave = rector.leaveApplications.id(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave application not found" });
    }

    leave.status = status;
    leave.reviewedBy = req.user.name;
    leave.reviewedAt = new Date();
    if (note !== undefined) leave.note = note;

    await rector.save();
    res.status(200).json({ message: "Leave application updated", leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
