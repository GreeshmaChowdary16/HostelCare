import Complaint from "../models/Complaint.js";
import Worker from "../models/Worker.js";

const addHistoryEntry = (complaint, note, status, updatedBy, role) => {
  complaint.history.push({
    note,
    status: status || complaint.status,
    updatedBy,
    role,
  });
};

export const createComplaint = async (req, res) => {
  try {
    const { category, subCategory, problem, proof } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : proof || null;

    const complaint = await Complaint.create({
      student: req.user._id,
      category,
      subCategory: subCategory || null,
      problem,
      proof: filePath,
      history: [
        {
          status: "Pending",
          note: "Complaint submitted",
          updatedBy: req.user.name,
          role: req.user.role,
        },
      ],
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const { category, priority, status } = req.query;
    let filter = {};

    if (req.user.role === "student") {
      filter.student = req.user._id;
    }
    if (category) {
      filter.category = category;
    }
    if (priority) {
      filter.priority = priority;
    }
    if (status) {
      filter.status = status;
    }

    const complaints = await Complaint.find(filter)
      .populate("student", "name email role phone parentPhone rollNo branch year roomInfo bio")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "student",
      "name email role phone parentPhone rollNo branch year roomInfo bio"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.user.role === "student" && complaint.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, subCategory, problem, proof, priority, assignedWorker, status } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (category) complaint.category = category;
    if (subCategory !== undefined) complaint.subCategory = subCategory;
    if (problem) complaint.problem = problem;
    if (req.file) {
      complaint.proof = `/uploads/${req.file.filename}`;
    } else if (proof !== undefined) {
      complaint.proof = proof;
    }
    if (priority) complaint.priority = priority;
    if (status) complaint.status = status;
    if (assignedWorker) {
      complaint.assignedWorker = {
        name: assignedWorker.name || complaint.assignedWorker.name,
        phone: assignedWorker.phone || complaint.assignedWorker.phone,
        category: assignedWorker.category || complaint.assignedWorker.category,
        availability: assignedWorker.availability || complaint.assignedWorker.availability,
      };
    }

    addHistoryEntry(complaint, "Complaint updated", complaint.status, req.user.name, req.user.role);
    await complaint.save();

    res.status(200).json({ message: "Complaint updated successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await complaint.deleteOne();
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedWorker } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (status) {
      complaint.status = status;
      addHistoryEntry(complaint, `Status changed to ${status}`, status, req.user.name, req.user.role);
    }
    if (assignedWorker) {
      complaint.assignedWorker = {
        name: assignedWorker.name || complaint.assignedWorker.name,
        phone: assignedWorker.phone || complaint.assignedWorker.phone,
        category: assignedWorker.category || complaint.assignedWorker.category,
        availability: assignedWorker.availability || complaint.assignedWorker.availability,
      };
      addHistoryEntry(complaint, "Worker assignment updated", complaint.status, req.user.name, req.user.role);
    }

    await complaint.save();

    res.status(200).json({ message: "Complaint status updated successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const escalateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const { reason } = req.body;
    complaint.priority = "Urgent";
    complaint.escalationReason = reason || "Escalated by staff";
    complaint.status = "In Progress";

    addHistoryEntry(complaint, complaint.escalationReason, complaint.status, req.user.name, req.user.role);
    await complaint.save();

    res.status(200).json({ message: "Complaint escalated successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaintTimeline = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.user.role === "student" && complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(complaint.history || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
