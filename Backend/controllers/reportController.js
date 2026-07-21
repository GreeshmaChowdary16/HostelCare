import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  try {
    const { title, type, content, attachments } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const report = await Report.create({
      author: req.user._id,
      title,
      type: type || "Other",
      content,
      attachments: attachments || [],
    });

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "rector") {
      filter.author = req.user._id;
    }

    const reports = await Report.find(filter)
      .populate("author", "name email role phone office bio")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate(
      "author",
      "name email role phone office bio"
    );

    if (!report) return res.status(404).json({ message: "Report not found" });

    if (req.user.role === "rector" && report.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
