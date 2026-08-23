import User from "../models/User.js";
import GatePass from "../models/GatePass.js";
import Complaint from "../models/Complaint.js";

const parseFloorFromRoom = (roomInfo) => {
  if (!roomInfo) return null;
  const m = roomInfo.match(/Room\s*(\d+)/i);
  if (m) {
    const roomNum = parseInt(m[1], 10);
    if (Number.isNaN(roomNum)) return null;
    return Math.floor(roomNum / 100);
  }
  // fallback: look for trailing three-digit number
  const trailing = roomInfo.match(/(\d{3})$/);
  if (trailing) {
    const roomNum = parseInt(trailing[1], 10);
    return Math.floor(roomNum / 100);
  }
  return null;
};

export const getStudents = async (req, res) => {
  try {
    const { search, branch, year, floor } = req.query;
    let filter = { role: "student" };

    if (branch) filter.branch = branch;
    if (year) filter.year = year;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { rollNo: regex },
        { phone: regex },
      ];
    }

    const students = await User.find(filter).select(
      "name email role phone parentPhone rollNo branch year roomInfo bio profileImage"
    );

    // if floor filter is provided, filter in-memory using roomInfo parsing
    let results = students;
    if (floor) {
      const floorNum = parseInt(floor, 10);
      results = students.filter((s) => parseFloorFromRoom(s.roomInfo) === floorNum);
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentStats = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "branch year state roomInfo parentPhone"
    );

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    const [onLeave, activeComplaints] = await Promise.all([
      GatePass.countDocuments({
        status: "Approved",
        fromDate: { $lte: endOfToday },
        toDate: { $gte: startOfToday },
      }),
      Complaint.countDocuments({ status: { $in: ["Pending", "In Progress"] } }),
    ]);

    const stats = {
      total: students.length,
      onLeave,
      presentInHostel: Math.max(0, students.length - onLeave),
      activeComplaints,
      byBranch: {},
      byYear: {},
      byFloor: {},
      guardianCount: 0,
      stateWise: {},
    };

    students.forEach((s) => {
      // branch
      const b = s.branch || "Unknown";
      stats.byBranch[b] = (stats.byBranch[b] || 0) + 1;

      // year
      const y = s.year || "Unknown";
      stats.byYear[y] = (stats.byYear[y] || 0) + 1;

      const state = s.state || "Unknown";
      stats.stateWise[state] = (stats.stateWise[state] || 0) + 1;

      // floor
      const f = parseFloorFromRoom(s.roomInfo) || "Unknown";
      stats.byFloor[f] = (stats.byFloor[f] || 0) + 1;

      // guardian info
      if (s.parentPhone) stats.guardianCount += 1;

      // state-wise: the User model doesn't have `state`; leave empty or derived if available
    });

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentsByFloor = async (req, res) => {
  try {
    const floor = parseInt(req.params.floor, 10);
    if (Number.isNaN(floor)) return res.status(400).json({ message: "Invalid floor" });

    const students = await User.find({ role: "student" }).select(
      "name email role phone parentPhone rollNo branch year roomInfo bio profileImage"
    );

    const results = students.filter((s) => parseFloorFromRoom(s.roomInfo) === floor);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLiveStudentStatus = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const [students, approvedGatePasses] = await Promise.all([
      User.find({ role: "student" }).select(
        "name email phone rollNo branch year state roomInfo profileImage"
      ).sort({ name: 1 }),
      GatePass.find({
        status: "Approved",
        fromDate: { $lte: endOfToday },
        toDate: { $gte: startOfToday },
      }).select("student fromDate toDate reason"),
    ]);

    const leaveByStudent = new Map(
      approvedGatePasses.map((pass) => [String(pass.student), pass])
    );

    const results = students.map((student) => {
      const leave = leaveByStudent.get(String(student._id));
      return {
        ...student.toObject(),
        status: leave ? "on_leave" : "present",
        leave: leave
          ? { fromDate: leave.fromDate, toDate: leave.toDate, reason: leave.reason }
          : null,
      };
    });

    res.status(200).json({
      updatedAt: new Date().toISOString(),
      total: results.length,
      present: results.filter((student) => student.status === "present").length,
      onLeave: results.filter((student) => student.status === "on_leave").length,
      students: results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
