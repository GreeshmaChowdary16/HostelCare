import Complaint from "../models/Complaint.js";

// Create Complaint (Student only)
export const createComplaint = async (req, res) => {
  try {
    const { category, subCategory, problem, proof } = req.body;
    
    const complaint = await Complaint.create({
      student: req.user._id,
      category,
      subCategory: subCategory || null,
      problem,
      proof: proof || null,
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Complaints (Student: own complaints; Rector/Admin: all complaints)
export const getComplaints = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "student") {
      filter = { student: req.user._id };
    }

    const complaints = await Complaint.find(filter)
      .populate("student", "name email role phone parentPhone rollNo branch year roomInfo bio")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Complaint Status (Rector/Admin only)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedWorker } = req.body;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (status) {
      complaint.status = status;
    }
    if (assignedWorker) {
      complaint.assignedWorker = {
        name: assignedWorker.name || complaint.assignedWorker.name,
        phone: assignedWorker.phone || complaint.assignedWorker.phone,
        role: assignedWorker.role || complaint.assignedWorker.role,
      };
    }

    await complaint.save();

    res.status(200).json({
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
