import Fee from "../models/Fee.js";
import User from "../models/User.js";

/**
 * Helper to update overdue status for fees past due date
 */
const updateOverdueStatus = async (query = {}) => {
  const now = new Date();
  await Fee.updateMany(
    {
      ...query,
      status: { $in: ["Pending", "Partial"] },
      dueDate: { $lt: now },
    },
    { $set: { status: "Overdue" } }
  );
};

/**
 * Create fee invoice for a single student (Admin/Rector)
 */
export const createFee = async (req, res, next) => {
  try {
    const { student, feeType, academicYear, semester, amount, dueDate, remarks } = req.body;

    if (!student || !amount || !dueDate) {
      return res.status(400).json({ success: false, message: "Student, amount, and dueDate are required" });
    }

    const studentUser = await User.findById(student);
    if (!studentUser || studentUser.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const fee = await Fee.create({
      student,
      feeType: feeType || "Hostel Fee",
      academicYear: academicYear || "2025-2026",
      semester: semester || "Semester 1",
      amount: Number(amount),
      dueDate: new Date(dueDate),
      remarks: remarks || "",
      status: new Date(dueDate) < new Date() ? "Overdue" : "Pending",
    });

    const populatedFee = await Fee.findById(fee._id).populate("student", "name email rollNo roomInfo branch");

    res.status(201).json({
      success: true,
      message: "Fee invoice created successfully",
      fee: populatedFee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk create fee invoices for all students or filtered students (Admin/Rector)
 */
export const bulkCreateFees = async (req, res, next) => {
  try {
    const { feeType, academicYear, semester, amount, dueDate, remarks, branch, year } = req.body;

    if (!amount || !dueDate) {
      return res.status(400).json({ success: false, message: "Amount and dueDate are required" });
    }

    const filter = { role: "student" };
    if (branch) filter.branch = branch;
    if (year) filter.year = year;

    const students = await User.find(filter).select("_id");
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: "No matching students found to generate fee invoices" });
    }

    const isOverdue = new Date(dueDate) < new Date();
    const feeDocs = students.map((s) => ({
      student: s._id,
      feeType: feeType || "Hostel Fee",
      academicYear: academicYear || "2025-2026",
      semester: semester || "Semester 1",
      amount: Number(amount),
      dueDate: new Date(dueDate),
      remarks: remarks || "",
      status: isOverdue ? "Overdue" : "Pending",
    }));

    const createdFees = await Fee.insertMany(feeDocs);

    res.status(201).json({
      success: true,
      message: `Fee invoices generated successfully for ${createdFees.length} students`,
      count: createdFees.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all fee invoices with filters and tracking (Admin/Rector)
 */
export const getFees = async (req, res, next) => {
  try {
    await updateOverdueStatus();

    const { status, feeType, studentId, search, academicYear } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (feeType) filter.feeType = feeType;
    if (academicYear) filter.academicYear = academicYear;
    if (studentId) filter.student = studentId;

    let fees = await Fee.find(filter)
      .populate("student", "name email rollNo roomInfo branch year phone")
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      fees = fees.filter(
        (f) =>
          f.student?.name?.toLowerCase().includes(s) ||
          f.student?.rollNo?.toLowerCase().includes(s) ||
          f.receiptNo?.toLowerCase().includes(s) ||
          f.transactionId?.toLowerCase().includes(s)
      );
    }

    res.status(200).json({
      success: true,
      count: fees.length,
      fees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get logged-in student's fee invoices and tracking summary (Student)
 */
export const getMyFees = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    await updateOverdueStatus({ student: studentId });

    const fees = await Fee.find({ student: studentId }).sort({ dueDate: 1 });

    let totalBilled = 0;
    let totalPaid = 0;
    let pendingInvoices = 0;

    fees.forEach((f) => {
      totalBilled += f.amount;
      totalPaid += f.paidAmount || 0;
      if (f.status !== "Paid") pendingInvoices++;
    });

    const totalPending = Math.max(0, totalBilled - totalPaid);

    res.status(200).json({
      success: true,
      summary: {
        totalBilled,
        totalPaid,
        totalPending,
        pendingInvoices,
      },
      fees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single fee invoice by ID
 */
export const getFeeById = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id).populate("student", "name email rollNo roomInfo branch phone");

    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee invoice not found" });
    }

    // Access check for student
    if (req.user.role === "student" && fee.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({
      success: true,
      fee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Record fee payment (Student/Admin/Rector)
 */
export const recordPayment = async (req, res, next) => {
  try {
    const { amountPaid, paymentMethod, transactionId, remarks } = req.body;

    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee invoice not found" });
    }

    // If student, check ownership
    if (req.user.role === "student" && fee.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const paymentVal = Number(amountPaid) || fee.amount - fee.paidAmount;
    if (paymentVal <= 0) {
      return res.status(400).json({ success: false, message: "Payment amount must be greater than 0" });
    }

    const newPaidAmount = fee.paidAmount + paymentVal;
    fee.paidAmount = Math.min(fee.amount, newPaidAmount);

    if (fee.paidAmount >= fee.amount) {
      fee.status = "Paid";
    } else {
      fee.status = "Partial";
    }

    fee.paymentDate = new Date();
    fee.paymentMethod = paymentMethod || "UPI";
    fee.transactionId = transactionId || `TXN${Date.now()}`;
    if (!fee.receiptNo) {
      fee.receiptNo = `REC-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    if (remarks) fee.remarks = remarks;

    await fee.save();

    const updatedFee = await Fee.findById(fee._id).populate("student", "name email rollNo roomInfo");

    res.status(200).json({
      success: true,
      message: `Payment of ₹${paymentVal} recorded successfully. Status: ${fee.status}`,
      fee: updatedFee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update fee invoice details (Admin/Rector)
 */
export const updateFee = async (req, res, next) => {
  try {
    const { feeType, academicYear, semester, amount, dueDate, status, remarks } = req.body;

    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee invoice not found" });
    }

    if (feeType) fee.feeType = feeType;
    if (academicYear) fee.academicYear = academicYear;
    if (semester) fee.semester = semester;
    if (amount !== undefined) fee.amount = Number(amount);
    if (dueDate) fee.dueDate = new Date(dueDate);
    if (status) fee.status = status;
    if (remarks !== undefined) fee.remarks = remarks;

    // Recalculate status based on amount vs paidAmount
    if (fee.paidAmount >= fee.amount && fee.amount > 0) {
      fee.status = "Paid";
    }

    await fee.save();
    const updatedFee = await Fee.findById(fee._id).populate("student", "name email rollNo roomInfo");

    res.status(200).json({
      success: true,
      message: "Fee invoice updated successfully",
      fee: updatedFee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete fee invoice (Admin/Rector)
 */
export const deleteFee = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee invoice not found" });
    }

    await fee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Fee invoice deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get overall Fee Analytics & Stats (Admin/Rector)
 */
export const getFeeStats = async (req, res, next) => {
  try {
    await updateOverdueStatus();

    const fees = await Fee.find();

    let totalBilled = 0;
    let totalCollected = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let partialCount = 0;

    fees.forEach((f) => {
      totalBilled += f.amount;
      totalCollected += f.paidAmount || 0;
      if (f.status === "Paid") paidCount++;
      else if (f.status === "Pending") pendingCount++;
      else if (f.status === "Overdue") overdueCount++;
      else if (f.status === "Partial") partialCount++;
    });

    const totalPending = Math.max(0, totalBilled - totalCollected);
    const collectionPercentage = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalInvoices: fees.length,
        totalBilled,
        totalCollected,
        totalPending,
        collectionPercentage,
        counts: {
          paid: paidCount,
          pending: pendingCount,
          overdue: overdueCount,
          partial: partialCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
