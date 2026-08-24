import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

function RectorAttendance() {
    // Current date values
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthNum = today.getMonth(); // 0-indexed
    const currentDayNum = today.getDate();

    // Formatting month as YYYY-MM
    const formatMonthYear = (year, month) => {
        const mm = String(month + 1).padStart(2, '0');
        return `${year}-${mm}`;
    };

    // States
    const [students, setStudents] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(formatMonthYear(currentYear, currentMonthNum));
    const [selectedDay, setSelectedDay] = useState(currentDayNum);
    const [searchQuery, setSearchQuery] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Modal state for student monthly grid view
    const [selectedStudentForCalendar, setSelectedStudentForCalendar] = useState(null);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

    // Fetch Students and Attendance list
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing. Please sign in again.');
            setIsLoading(false);
            return;
        }

        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            // 1. Fetch Students
            const studentsRes = await fetch(`${API_BASE_URL}/students`, { headers });
            if (!studentsRes.ok) throw new Error('Failed to load students directory.');
            const studentsData = await studentsRes.json();
            setStudents(studentsData || []);

            // 2. Fetch Attendance for selected month
            const attendanceRes = await fetch(`${API_BASE_URL}/attendance?monthYear=${selectedMonth}`, { headers });
            if (attendanceRes.ok) {
                const attendanceData = await attendanceRes.json();
                setAttendanceRecords(attendanceData || []);
            } else if (attendanceRes.status === 404) {
                // No records for this month yet
                setAttendanceRecords([]);
            } else {
                throw new Error('Failed to load attendance records.');
            }
        } catch (err) {
            console.error('Fetch attendance error:', err);
            setError(err.message === 'Unauthorized' ? 'Session expired. Please log in again.' : 'Failed to connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    // Parse year and month numbers
    const [yearPart, monthPart] = selectedMonth.split('-').map(Number);
    const selectedMonthIndex = monthPart - 1; // 0-indexed

    // Calculate days in selected month & first day
    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
    const totalDays = getDaysInMonth(yearPart, selectedMonthIndex);

    // Generate array of day numbers for selector [1, 2, ..., totalDays]
    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

    // If day exceeds total days (e.g. switching from Jan 31 to Feb), adjust
    useEffect(() => {
        if (selectedDay > totalDays) {
            setSelectedDay(totalDays);
        }
    }, [selectedMonth, totalDays]);

    // Match student to their monthly attendance record
    const getStudentAttendanceRecord = (studentId) => {
        return attendanceRecords.find(record => record.student?._id === studentId);
    };

    // Get attendance status for a student on the selected day
    const getStatusForDay = (studentId, day) => {
        const record = getStudentAttendanceRecord(studentId);
        if (!record || !record.records) return 'not_marked';
        const dayRecord = record.records.find(r => r.day === day);
        return dayRecord ? dayRecord.status : 'not_marked';
    };

    // Mark Attendance (Present/Absent/Leave)
    const handleMarkAttendance = async (studentId, status) => {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        // Find existing record or initialize new list
        const existingRecord = getStudentAttendanceRecord(studentId);
        let updatedRecords = [];

        if (existingRecord && existingRecord.records) {
            // copy and update existing
            updatedRecords = [...existingRecord.records];
            const existingDayIndex = updatedRecords.findIndex(r => r.day === selectedDay);
            if (existingDayIndex > -1) {
                updatedRecords[existingDayIndex] = {
                    ...updatedRecords[existingDayIndex],
                    status,
                    method: 'Manual Entry',
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    details: 'Marked by Rector'
                };
            } else {
                updatedRecords.push({
                    day: selectedDay,
                    status,
                    method: 'Manual Entry',
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    details: 'Marked by Rector'
                });
            }
        } else {
            // create new day records (default other days as not_marked)
            for (let d = 1; d <= totalDays; d++) {
                updatedRecords.push({
                    day: d,
                    status: d === selectedDay ? status : 'not_marked',
                    method: d === selectedDay ? 'Manual Entry' : 'Not Marked',
                    time: d === selectedDay ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                    details: d === selectedDay ? 'Marked by Rector' : ''
                });
            }
        }

        try {
            const firstDayVal = getFirstDayOfMonth(yearPart, selectedMonthIndex);
            const response = await fetch(`${API_BASE_URL}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    studentId,
                    monthYear: selectedMonth,
                    daysInMonth: totalDays,
                    firstDay: firstDayVal,
                    records: updatedRecords
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update attendance.');
            }

            // Reload attendance data
            await fetchData();
        } catch (err) {
            console.error('Error saving attendance:', err);
            alert(err.message || 'Error occurred while saving attendance.');
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate individual attendance stats
    const calculateStats = (studentId) => {
        const record = getStudentAttendanceRecord(studentId);
        if (!record || !record.records) return { percentage: 0, presentCount: 0, markedCount: 0 };

        const markedDays = record.records.filter(r => r.status !== 'not_marked');
        const presentDays = record.records.filter(r => r.status === 'present');

        const markedCount = markedDays.length;
        const presentCount = presentDays.length;
        const percentage = markedCount ? Math.round((presentCount / markedCount) * 100) : 0;

        return { percentage, presentCount, markedCount };
    };

    // Filter students list
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name?.toLowerCase().includes(searchQuery.toLowerCase()) || student.rollNo?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBranch = branchFilter ? student.branch === branchFilter : true;
        return matchesSearch && matchesBranch;
    });

    // Helper to open student calendar view
    const openStudentCalendar = (student) => {
        setSelectedStudentForCalendar(student);
        setIsCalendarModalOpen(true);
    };

    return (
        <>
            <style>{`
                .container {
                    padding: 30px;
                    max-width: 1600px;
                    margin: 0 auto;
                }

                .dashboard-bar {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    background: #fff;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    margin-bottom: 25px;
                    align-items: center;
                }

                .date-selectors {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }

                .input-label {
                    font-size: 12px;
                    font-weight: 700;
                    color: #4e73df;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                    display: block;
                }

                .select-control {
                    padding: 8px 12px;
                    border: 1px solid #d1d3e2;
                    border-radius: 6px;
                    font-size: 14px;
                    outline: none;
                    background: #fff;
                }

                .select-control:focus {
                    border-color: #4e73df;
                }

                .search-row {
                    display: flex;
                    gap: 15px;
                    flex: 1;
                    min-width: 300px;
                }

                .search-input {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid #d1d3e2;
                    border-radius: 6px;
                    font-size: 14px;
                    outline: none;
                }

                .search-input:focus {
                    border-color: #4e73df;
                }

                .card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                }

                .card-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .attendance-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .attendance-table th, .attendance-table td {
                    padding: 15px 20px;
                    text-align: left;
                    font-size: 14px;
                    border-bottom: 1px solid #e3e6f0;
                }

                .attendance-table th {
                    background: #f8f9fc;
                    color: #858796;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 11px;
                }

                .btn-present {
                    background: #e3fdf4;
                    color: #1cc88a;
                    border: 1px solid #c6f6d5;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                }

                .btn-present.active, .btn-present:hover {
                    background: #1cc88a;
                    color: #fff;
                }

                .btn-absent {
                    background: #fbecec;
                    color: #e74a3b;
                    border: 1px solid #fed7d7;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                }

                .btn-absent.active, .btn-absent:hover {
                    background: #e74a3b;
                    color: #fff;
                }

                .btn-leave-action {
                    background: #fff5e6;
                    color: #f6c23e;
                    border: 1px solid #ffe8cc;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                }

                .btn-leave-action.active, .btn-leave-action:hover {
                    background: #f6c23e;
                    color: #fff;
                }

                .btn-calendar {
                    background: #e8f0fe;
                    color: #4e73df;
                    border: none;
                    padding: 8px 14px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 12px;
                }

                .btn-calendar:hover {
                    background: #4e73df;
                    color: white;
                }

                .status-badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .badge-present { background: #e3fdf4; color: #1cc88a; }
                .badge-absent { background: #fbecec; color: #e74a3b; }
                .badge-leave { background: #fff5e6; color: #f6c23e; }
                .badge-unmarked { background: #eaecf4; color: #858796; }

                .status-message {
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 25px;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .status-error { background: #fff5f5; color: #e74a3b; border: 1px solid #fed7d7; }

                /* Modal styling */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1200;
                    padding: 15px;
                }

                .modal-content {
                    background: #fff;
                    border-radius: 12px;
                    padding: 30px;
                    width: 95%;
                    max-width: 700px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    animation: fadeIn 0.3s ease-out;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e3e6f0;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }

                .modal-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #4e73df;
                    margin: 0;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #858796;
                }

                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 10px;
                    margin-top: 15px;
                }

                .calendar-day-header {
                    text-align: center;
                    font-weight: 700;
                    font-size: 11px;
                    color: #858796;
                    text-transform: uppercase;
                    padding-bottom: 5px;
                }

                .calendar-day-cell {
                    aspect-ratio: 1;
                    border: 1px solid #eaecf4;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    font-weight: 600;
                    font-size: 14px;
                    background: #f8f9fc;
                }

                .calendar-day-cell.present { background: #e3fdf4; border-color: #c6f6d5; color: #1cc88a; }
                .calendar-day-cell.leave { background: #fff5e6; border-color: #ffe8cc; color: #f6c23e; }
                .calendar-day-cell.absent { background: #fbecec; border-color: #fed7d7; color: #e74a3b; }
                .calendar-day-cell.empty { border: none; background: none; }

                .calendar-day-num {
                    font-size: 14px;
                    margin-bottom: 2px;
                }

                .calendar-day-status {
                    font-size: 8px;
                    text-transform: uppercase;
                    font-weight: 700;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="container">
                {/* Error Banner */}
                {error && (
                    <div className="status-message status-error">
                        <span>{error}</span>
                        <button className="select-control" style={{ background: '#e74a3b', color: 'white', border: 'none', cursor: 'pointer' }} onClick={fetchData}>
                            Retry Loading
                        </button>
                    </div>
                )}

                {/* Dashboard / Selectors row */}
                <div className="dashboard-bar">
                    <div className="date-selectors">
                        <div>
                            <span className="input-label">Select Month</span>
                            <input
                                type="month"
                                className="select-control"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            />
                        </div>
                        <div>
                            <span className="input-label">Select Day</span>
                            <select
                                className="select-control"
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(Number(e.target.value))}
                            >
                                {daysArray.map(day => (
                                    <option key={day} value={day}>Day {day}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="search-row">
                        <div style={{ flex: 1 }}>
                            <span className="input-label">Search Students</span>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by name, roll no..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <span className="input-label">Branch Filter</span>
                            <select
                                className="select-control"
                                value={branchFilter}
                                onChange={(e) => setBranchFilter(e.target.value)}
                            >
                                <option value="">All Branches</option>
                                <option value="Computer Science & Engineering">CSE</option>
                                <option value="Electronics & Communication">ECE</option>
                                <option value="Electrical Engineering">EE</option>
                                <option value="Mechanical Engineering">ME</option>
                                <option value="Civil Engineering">Civil</option>
                                <option value="Information Technology">IT</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Directory Table */}
                <div className="card">
                    <div className="card-title">
                        <i className="fas fa-calendar-check" style={{ color: '#4e73df' }}></i>
                        <span>Student Attendance Sheet: {new Date(yearPart, selectedMonthIndex, selectedDay).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#858796' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
                            <p>Loading attendance sheet...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#858796' }}>
                            <i className="fas fa-users-slash" style={{ fontSize: '48px', color: '#dddfeb', marginBottom: '15px' }}></i>
                            <p style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>No students found.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Student Details</th>
                                        <th>Room</th>
                                        <th>Month Average</th>
                                        <th>Selected Day Status</th>
                                        <th style={{ width: '280px' }}>Mark Attendance</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map(student => {
                                        const currentStatus = getStatusForDay(student._id, selectedDay);
                                        const { percentage, presentCount, markedCount } = calculateStats(student._id);

                                        let badgeClass = 'badge-unmarked';
                                        if (currentStatus === 'present') badgeClass = 'badge-present';
                                        else if (currentStatus === 'absent') badgeClass = 'badge-absent';
                                        else if (currentStatus === 'leave') badgeClass = 'badge-leave';

                                        return (
                                            <tr key={student._id}>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: '#333' }}>{student.name}</div>
                                                    <div style={{ fontSize: '11px', color: '#858796' }}>Roll No: {student.rollNo || 'N/A'} | {student.branch}</div>
                                                </td>
                                                <td>{student.roomInfo || 'Unassigned'}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontWeight: 700, color: percentage >= 75 ? '#1cc88a' : '#e74a3b' }}>
                                                            {percentage}%
                                                        </span>
                                                        <span style={{ fontSize: '11px', color: '#858796' }}>
                                                            ({presentCount}/{markedCount} days)
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${badgeClass}`}>
                                                        {currentStatus === 'not_marked' ? 'Not Marked' : currentStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            className={`btn-present ${currentStatus === 'present' ? 'active' : ''}`}
                                                            disabled={isSaving}
                                                            onClick={() => handleMarkAttendance(student._id, 'present')}
                                                        >
                                                            Present
                                                        </button>
                                                        <button
                                                            className={`btn-absent ${currentStatus === 'absent' ? 'active' : ''}`}
                                                            disabled={isSaving}
                                                            onClick={() => handleMarkAttendance(student._id, 'absent')}
                                                        >
                                                            Absent
                                                        </button>
                                                        <button
                                                            className={`btn-leave-action ${currentStatus === 'leave' ? 'active' : ''}`}
                                                            disabled={isSaving}
                                                            onClick={() => handleMarkAttendance(student._id, 'leave')}
                                                        >
                                                            Leave
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-calendar"
                                                        onClick={() => openStudentCalendar(student)}
                                                    >
                                                        <i className="far fa-calendar-alt"></i> View Month
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* MONTHLY CALENDAR GRID MODAL */}
            {isCalendarModalOpen && selectedStudentForCalendar && (
                <div className="modal-overlay" onClick={() => setIsCalendarModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                Attendance Log: {selectedStudentForCalendar.name}
                            </h3>
                            <button className="modal-close" onClick={() => setIsCalendarModalOpen(false)}>&times;</button>
                        </div>
                        <div>
                            <div style={{ background: '#f8f9fc', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#4e73df', fontWeight: '700', textTransform: 'uppercase' }}>Selected Session</div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#5a5c69' }}>
                                        {new Date(yearPart, selectedMonthIndex).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '11px', color: '#4e73df', fontWeight: '700', textTransform: 'uppercase' }}>Month Average</div>
                                    <div style={{ fontSize: '20px', fontWeight: '700', color: calculateStats(selectedStudentForCalendar._id).percentage >= 75 ? '#1cc88a' : '#e74a3b' }}>
                                        {calculateStats(selectedStudentForCalendar._id).percentage}%
                                    </div>
                                </div>
                            </div>

                            <div className="calendar-grid">
                                {/* Weekday Headers */}
                                <div className="calendar-day-header">Sun</div>
                                <div className="calendar-day-header">Mon</div>
                                <div className="calendar-day-header">Tue</div>
                                <div className="calendar-day-header">Wed</div>
                                <div className="calendar-day-header">Thu</div>
                                <div className="calendar-day-header">Fri</div>
                                <div className="calendar-day-header">Sat</div>

                                {/* Padding cells for first week offsets */}
                                {Array.from({ length: getFirstDayOfMonth(yearPart, selectedMonthIndex) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="calendar-day-cell empty"></div>
                                ))}

                                {/* Day Cells */}
                                {daysArray.map(day => {
                                    const dayStatus = getStatusForDay(selectedStudentForCalendar._id, day);
                                    let cellClass = '';
                                    if (dayStatus === 'present') cellClass = 'present';
                                    else if (dayStatus === 'leave') cellClass = 'leave';
                                    else if (dayStatus === 'absent') cellClass = 'absent';

                                    return (
                                        <div key={day} className={`calendar-day-cell ${cellClass}`}>
                                            <span className="calendar-day-num">{day}</span>
                                            {dayStatus !== 'not_marked' && (
                                                <span className="calendar-day-status">{dayStatus}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default RectorAttendance;
