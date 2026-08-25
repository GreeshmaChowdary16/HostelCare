import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { emitRealtimeEvent } from "../config/socket.js";
import { getRectorStudentIds } from "../utils/hostelScope.js";

const rectorCanAccessStudent = async (req, studentId) => {
  if (req.user.role !== "rector") return true;
  const studentIds = await getRectorStudentIds(req.user);
  return studentIds.some((id) => id.toString() === studentId.toString());
};

export const getAttendance = async (req, res) => {
  try {
    const { monthYear, studentId } = req.query;
    const filter = {};

    if (req.user.role === "student") {
      filter.student = req.user._id;
    } else if (studentId) {
      filter.student = studentId;
    }

    if (monthYear) {
      filter.monthYear = monthYear;
    }

    if (req.user.role === "rector") {
      filter.student = { $in: await getRectorStudentIds(req.user) };
    }

    const attendance = await Attendance.find(filter).populate("student", "name email role roomInfo gender");

    if (!attendance.length) {
      return res.status(404).json({ message: "No attendance found" });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { monthYear } = req.query;

    const query = { student: studentId };
    if (monthYear) query.monthYear = monthYear;

    if (!(await rectorCanAccessStudent(req, studentId))) {
      return res.status(403).json({ message: "You can only access attendance for your assigned hostel" });
    }

    const attendance = await Attendance.find(query).populate("student", "name email role roomInfo");

    if (!attendance.length) {
      return res.status(404).json({ message: "Attendance record not found for this student" });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertAttendance = async (req, res) => {
  try {
    const { studentId, monthYear, daysInMonth, firstDay, records } = req.body;

    if (!monthYear || !daysInMonth || firstDay === undefined || !Array.isArray(records)) {
      return res.status(400).json({ message: "monthYear, daysInMonth, firstDay and records are required" });
    }

    const targetStudent = req.user.role === "student" ? req.user._id : studentId || req.user._id;
    if (!targetStudent) {
      return res.status(400).json({ message: "Student ID is required for this operation" });
    }
    if (!(await rectorCanAccessStudent(req, targetStudent))) {
      return res.status(403).json({ message: "You can only manage attendance for your assigned hostel" });
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        student: targetStudent,
        monthYear,
      },
      {
        student: targetStudent,
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

    emitRealtimeEvent("attendance_updated", attendance);

    res.status(200).json({ message: "Attendance updated successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existingAttendance = await Attendance.findById(id);
    if (!existingAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    if (!(await rectorCanAccessStudent(req, existingAttendance.student))) {
      return res.status(403).json({ message: "You can only manage attendance for your assigned hostel" });
    }

    const attendance = await Attendance.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("student", "name email role roomInfo");

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    emitRealtimeEvent("attendance_updated", attendance);

    res.status(200).json({ message: "Attendance record updated", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const existingAttendance = await Attendance.findById(id);
    if (!existingAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    if (!(await rectorCanAccessStudent(req, existingAttendance.student))) {
      return res.status(403).json({ message: "You can only manage attendance for your assigned hostel" });
    }

    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    emitRealtimeEvent("attendance_deleted", { id: attendance._id });

    res.status(200).json({ message: "Attendance record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const attendanceAnalytics = async (req, res) => {
  try {
    const { monthYear } = req.query;
    const query = {};

    if (monthYear) {
      query.monthYear = monthYear;
    }

    if (req.user.role === "rector") {
      query.student = { $in: await getRectorStudentIds(req.user) };
    }

    const records = await Attendance.find(query).populate("student", "name email role roomInfo gender");

    if (!records.length) {
      return res.status(404).json({ message: "No attendance records available for analytics" });
    }

    const analytics = records.map((record) => {
      const totalDays = record.records.length;
      const presentDays = record.records.filter((item) => item.status === "present").length;
      const percentage = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;
      return {
        student: record.student,
        monthYear: record.monthYear,
        totalDays,
        presentDays,
        percentage,
      };
    });

    const overall = analytics.reduce(
      (acc, item) => {
        acc.total += item.totalDays;
        acc.present += item.presentDays;
        return acc;
      },
      { total: 0, present: 0 }
    );

    const overallAttendance = overall.total ? Math.round((overall.present / overall.total) * 100) : 0;

    res.status(200).json({ overallAttendance, details: analytics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
