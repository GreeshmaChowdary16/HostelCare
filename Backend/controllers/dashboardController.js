import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import GatePass from "../models/GatePass.js";
import Attendance from "../models/Attendance.js";

/**
 * Get unified dashboard analytics (Students, Complaints, GatePasses, Attendance)
 */
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
    const monthYearStr = `${currentYear}-${currentMonth}`;
    const todayDay = today.getDate();

    // 1. Students Stats
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalRectors = await User.countDocuments({ role: "rector" });

    // 2. Complaints Stats
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });
    const inProgressComplaints = await Complaint.countDocuments({ status: "In Progress" });
    const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved" });
    const rejectedComplaints = await Complaint.countDocuments({ status: "Rejected" });

    const complaintsByCategoryRaw = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    const complaintsByCategory = {};
    complaintsByCategoryRaw.forEach(item => {
      if (item._id) complaintsByCategory[item._id] = item.count;
    });

    // 3. Gate Pass Stats
    const totalGatePasses = await GatePass.countDocuments();
    const pendingGatePasses = await GatePass.countDocuments({ status: "Pending" });
    const approvedGatePasses = await GatePass.countDocuments({ status: "Approved" });
    const rejectedGatePasses = await GatePass.countDocuments({ status: "Rejected" });

    // Active leaves today: Approved gate passes covering today
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    const activeLeavesToday = await GatePass.countDocuments({
      status: "Approved",
      fromDate: { $lte: endOfToday },
      toDate: { $gte: startOfToday }
    });

    // 4. Attendance Stats for current month
    const monthAttendances = await Attendance.find({ monthYear: monthYearStr });
    let presentToday = 0;
    let leaveToday = 0;
    let notMarkedToday = 0;
    let totalPresentRecords = 0;
    let totalTotalRecords = 0;

    monthAttendances.forEach(att => {
      att.records.forEach(rec => {
        totalTotalRecords++;
        if (rec.status === "present") totalPresentRecords++;
        if (rec.day === todayDay) {
          if (rec.status === "present") presentToday++;
          else if (rec.status === "leave") leaveToday++;
          else notMarkedToday++;
        }
      });
    });

    const presentInHostelToday = Math.max(0, totalStudents - activeLeavesToday);
    const attendancePercentage = totalTotalRecords > 0 
      ? Math.round((totalPresentRecords / totalTotalRecords) * 100) 
      : 100;

    res.status(200).json({
      success: true,
      students: {
        total: totalStudents,
        rectorsCount: totalRectors,
        presentToday: presentInHostelToday,
        onLeaveToday: activeLeavesToday,
      },
      complaints: {
        total: totalComplaints,
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
        rejected: rejectedComplaints,
        byCategory: complaintsByCategory,
      },
      gatePasses: {
        total: totalGatePasses,
        pending: pendingGatePasses,
        approved: approvedGatePasses,
        rejected: rejectedGatePasses,
        activeLeavesToday,
      },
      attendance: {
        monthYear: monthYearStr,
        presentToday,
        leaveToday,
        notMarkedToday,
        attendancePercentage,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Student Dashboard Data
 */
export const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
    const monthYearStr = `${currentYear}-${currentMonth}`;

    const [
      myComplaints,
      pendingComplaintsCount,
      resolvedComplaintsCount,
      myGatePasses,
      pendingGatePassesCount,
      approvedGatePassesCount,
      myAttendanceRecord,
      recentComplaints,
      recentGatePasses
    ] = await Promise.all([
      Complaint.countDocuments({ student: studentId }),
      Complaint.countDocuments({ student: studentId, status: "Pending" }),
      Complaint.countDocuments({ student: studentId, status: "Resolved" }),
      GatePass.countDocuments({ student: studentId }),
      GatePass.countDocuments({ student: studentId, status: "Pending" }),
      GatePass.countDocuments({ student: studentId, status: "Approved" }),
      Attendance.findOne({ student: studentId, monthYear: monthYearStr }),
      Complaint.find({ student: studentId }).sort({ createdAt: -1 }).limit(5),
      GatePass.find({ student: studentId }).sort({ createdAt: -1 }).limit(5)
    ]);

    let presentDays = 0;
    let leaveDays = 0;
    let totalMarkedDays = 0;

    if (myAttendanceRecord && myAttendanceRecord.records) {
      myAttendanceRecord.records.forEach(r => {
        if (r.status === "present") {
          presentDays++;
          totalMarkedDays++;
        } else if (r.status === "leave") {
          leaveDays++;
          totalMarkedDays++;
        }
      });
    }

    const attendanceRate = totalMarkedDays > 0 ? Math.round((presentDays / totalMarkedDays) * 100) : 100;

    res.status(200).json({
      success: true,
      message: "Student Dashboard Data",
      student: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        rollNo: req.user.rollNo,
        roomInfo: req.user.roomInfo,
        branch: req.user.branch,
      },
      stats: {
        complaints: {
          total: myComplaints,
          pending: pendingComplaintsCount,
          resolved: resolvedComplaintsCount,
        },
        gatePasses: {
          total: myGatePasses,
          pending: pendingGatePassesCount,
          approved: approvedGatePassesCount,
        },
        attendance: {
          presentDays,
          leaveDays,
          totalMarkedDays,
          attendanceRate,
        },
      },
      recentComplaints,
      recentGatePasses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Rector Dashboard Data
 */
export const getRectorDashboard = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const activeLeavesCount = await GatePass.countDocuments({
      status: "Approved",
      fromDate: { $lte: endOfToday },
      toDate: { $gte: startOfToday }
    });

    const activeComplaintsCount = await Complaint.countDocuments({
      status: { $in: ["Pending", "In Progress"] }
    });

    const recentComplaints = await Complaint.find()
      .populate("student", "name rollNo roomInfo")
      .sort({ createdAt: -1 })
      .limit(5);

    const pendingGatePasses = await GatePass.find({ status: "Pending" })
      .populate("student", "name rollNo roomInfo")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: "Rector Dashboard Data",
      stats: {
        totalStudents,
        presentToday: Math.max(0, totalStudents - activeLeavesCount),
        onLeave: activeLeavesCount,
        activeComplaints: activeComplaintsCount,
      },
      recentComplaints,
      pendingGatePasses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Admin Dashboard Data
 */
export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalRectors = await User.countDocuments({ role: "rector" });

    const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });
    const totalComplaints = await Complaint.countDocuments();
    const pendingGatePasses = await GatePass.countDocuments({ status: "Pending" });

    const complaintsByCategoryRaw = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    const complaintsByCategory = complaintsByCategoryRaw.map(c => ({
      category: c._id || "Unassigned",
      count: c.count
    }));

    res.status(200).json({
      success: true,
      message: "Admin Dashboard Data",
      stats: {
        totalStudents,
        totalRectors,
        totalComplaints,
        pendingComplaints,
        pendingGatePasses,
        girlsHostels: 4,
        boysHostels: 6,
      },
      complaintsByCategory,
    });
  } catch (error) {
    next(error);
  }
};
