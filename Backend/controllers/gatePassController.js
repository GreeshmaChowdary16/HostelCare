import GatePass from "../models/GatePass.js";
import { emitRealtimeEvent } from "../config/socket.js";

// Apply Gate Pass (Student only)
export const applyGatePass = async (req, res) => {
  try {
    const {
      reason,
      fromDate,
      toDate,
      noOfDays,
      destination,
      contactNo,
      parentContactNo,
      timeFrom,
      timeTo,
      isExtension,
      parentMobile,
      proof,
    } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : proof || "";

    const calculatedDays = noOfDays || (fromDate && toDate ? Math.max(1, Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24))) : 1);
    const dest = destination || "Hometown";
    const contact = contactNo || req.user.phone || "+91 99887 76655";
    const parentContact = parentContactNo || parentMobile || req.user.parentPhone || "+91 94444 55555";

    const gatePass = await GatePass.create({
      student: req.user._id,
      reason: reason || "Personal Work",
      fromDate: fromDate ? new Date(fromDate) : new Date(),
      toDate: toDate ? new Date(toDate) : new Date(Date.now() + 86400000),
      noOfDays: calculatedDays,
      destination: dest,
      contactNo: contact,
      parentContactNo: parentContact,
      timeFrom: timeFrom || "09:00 AM",
      timeTo: timeTo || "06:00 PM",
      isExtension: isExtension || false,
      parentMobile: parentContact,
      proof: filePath,
    });

    emitRealtimeEvent("gatepass_created", gatePass);

    res.status(201).json({
      message: "Gate pass application submitted successfully",
      gatePass,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Gate Passes (Student: own passes; Rector/Admin: all passes)
export const getGatePasses = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "student") {
      filter = { student: req.user._id };
    }

    const gatePasses = await GatePass.find(filter)
      .populate("student", "name email role phone parentPhone rollNo branch year roomInfo bio")
      .sort({ createdAt: -1 });

    res.status(200).json(gatePasses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Gate Pass Status (Rector/Admin only)
export const updateGatePassStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const gatePass = await GatePass.findById(id);

    if (!gatePass) {
      return res.status(404).json({
        message: "Gate pass request not found",
      });
    }

    if (status) {
      gatePass.status = status;
    }
    if (rejectionReason !== undefined) {
      gatePass.rejectionReason = rejectionReason;
    }

    await gatePass.save();
    emitRealtimeEvent("gatepass_updated", gatePass);

    res.status(200).json({
      message: `Gate pass request ${status.toLowerCase()} successfully`,
      gatePass,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
