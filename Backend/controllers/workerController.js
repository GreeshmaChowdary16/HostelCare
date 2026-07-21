import Worker from "../models/Worker.js";

export const createWorker = async (req, res) => {
  try {
    const { name, category, phone, availability } = req.body;
    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }

    const worker = await Worker.create({
      name,
      category,
      phone: phone || "",
      availability: availability || "Available",
    });

    res.status(201).json({ message: "Worker created successfully", worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const { category, availability } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (availability) filter.availability = availability;

    const workers = await Worker.find(filter).sort({ createdAt: -1 });
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate("assignedComplaints");
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWorker = async (req, res) => {
  try {
    const { name, category, phone, availability, performanceScore } = req.body;
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    if (name !== undefined) worker.name = name;
    if (category !== undefined) worker.category = category;
    if (phone !== undefined) worker.phone = phone;
    if (availability !== undefined) worker.availability = availability;
    if (performanceScore !== undefined) worker.performanceScore = performanceScore;

    await worker.save();
    res.status(200).json({ message: "Worker updated successfully", worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    await worker.deleteOne();
    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignWorker = async (req, res) => {
  try {
    const { workerId, complaintId } = req.body;

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    if (!worker.assignedComplaints.includes(complaintId)) {
      worker.assignedComplaints.push(complaintId);
    }

    if (worker.availability === "Available") {
      worker.availability = "Busy";
    }

    await worker.save();
    res.status(200).json({ message: "Worker assigned successfully", worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addWorkerAttendance = async (req, res) => {
  try {
    const { status, date } = req.body;
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    worker.attendance.push({ date: date ? new Date(date) : undefined, status: status || "Present" });
    await worker.save();

    res.status(200).json({ message: "Worker attendance recorded", worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
