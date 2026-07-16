import GatePass from "../models/GatePass.js";

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

    const gatePass = await GatePass.create({
      student: req.user._id,
      reason,
      fromDate,
      toDate,
      noOfDays,
      destination,
      contactNo,
      parentContactNo,
      timeFrom: timeFrom || "09:00 AM",
      timeTo: timeTo || "06:00 PM",
      isExtension: isExtension || false,
      parentMobile: parentMobile || "",
      proof: proof || "",
    });

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
