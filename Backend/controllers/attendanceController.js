import Attendance from "../models/Attendance.js";

export const getAttendance = async (req, res) => {
  try {
    const { monthYear } = req.query;

    if (!monthYear) {
      return res.status(400).json({ message: "monthYear query parameter is required" });
    }

    const attendance = await Attendance.findOne({
      student: req.user._id,
      monthYear,
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertAttendance = async (req, res) => {
  try {
    const { monthYear, daysInMonth, firstDay, records } = req.body;

    if (!monthYear || !daysInMonth || firstDay === undefined || !Array.isArray(records)) {
      return res.status(400).json({ message: "monthYear, daysInMonth, firstDay and records are required" });
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        student: req.user._id,
        monthYear,
      },
      {
        student: req.user._id,
        monthYear,
        daysInMonth,
        firstDay,
        records,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json({ message: "Attendance updated successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
