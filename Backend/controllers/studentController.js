import User from "../models/User.js";

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
      "branch year roomInfo parentPhone"
    );

    const stats = {
      total: students.length,
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
