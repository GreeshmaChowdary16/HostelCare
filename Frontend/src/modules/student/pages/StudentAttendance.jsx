import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';
import socket from '../../../socket';

const ALL_MONTHS = [
    "January 2026", "February 2026", "March 2026", "April 2026",
    "May 2026", "June 2026", "July 2026", "August 2026",
    "September 2026", "October 2026", "November 2026", "December 2026"
];

const getCurrentRealMonth = () => {
    const now = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthStr = `${months[now.getMonth()]} ${now.getFullYear()}`;
    return ALL_MONTHS.includes(monthStr) ? monthStr : "August 2026";
};

const generateMonthData = (monthYearStr) => {
    const parts = monthYearStr.split(" ");
    const monthName = parts[0];
    const year = parseInt(parts[1], 10) || 2026;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIdx = monthNames.indexOf(monthName);
    
    if (monthIdx === -1) {
        return { daysInMonth: 31, firstDay: 0, records: {} };
    }

    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const firstDay = new Date(year, monthIdx, 1).getDay();

    const records = {};
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === year && now.getMonth() === monthIdx;
    const todayDay = now.getDate();

    for (let d = 1; d <= daysInMonth; d++) {
        const isPastOrToday = !isCurrentMonth ? (monthIdx < now.getMonth() || year < now.getFullYear()) : (d <= todayDay);

        if (isPastOrToday) {
            const dateObj = new Date(year, monthIdx, d);
            const dayOfWeek = dateObj.getDay();

            if (dayOfWeek === 0) {
                records[d] = { status: 'leave', method: 'Gate Pass', time: 'N/A', details: 'Sunday Weekend Pass' };
            } else if (d === 11 || d === 22) {
                records[d] = { status: 'not_marked', method: 'Not Marked', time: 'N/A', details: 'No scan or check-in logged' };
            } else {
                records[d] = { status: 'present', method: 'Face Scan', time: `08:${10 + (d % 12)} AM`, details: 'Verified via Gate Scanner #1' };
            }
        } else {
            records[d] = { status: 'not_marked', method: 'Not Marked', time: 'N/A', details: 'Upcoming date' };
        }
    }

    return { daysInMonth, firstDay, records };
};

const StudentAttendance = () => {
    // Academic Year Months database generated dynamically
    const attendanceDb = ALL_MONTHS.reduce((acc, monthKey) => {
        acc[monthKey] = generateMonthData(monthKey);
        return acc;
    }, {});

    const [selectedMonth, setSelectedMonth] = useState(getCurrentRealMonth());
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [attendanceData, setAttendanceData] = useState(null);
    const [attendanceMonthState, setAttendanceMonthState] = useState(null);
    const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
    const [attendanceError, setAttendanceError] = useState('');
    const [attendanceStatus, setAttendanceStatus] = useState('');

    const getAttendanceMonthData = (attendance) => {
        const recordsMap = (attendance.records || []).reduce((acc, record) => {
            acc[record.day] = {
                status: record.status,
                method: record.method,
                time: record.time,
                details: record.details,
            };
            return acc;
        }, {});

        return {
            daysInMonth: attendance.daysInMonth,
            firstDay: attendance.firstDay,
            records: recordsMap,
        };
    };

    const monthData = attendanceMonthState && attendanceMonthState.monthYear === selectedMonth
        ? attendanceMonthState
        : (attendanceDb[selectedMonth] || generateMonthData(selectedMonth));

    const daysInMonth = monthData.daysInMonth;
    const firstDayOfMonth = monthData.firstDay;
    const records = monthData.records;

    const buildMonthState = (attendance) => {
        const recordsMap = (attendance.records || []).reduce((acc, record) => {
            acc[record.day] = {
                status: record.status,
                method: record.method,
                time: record.time,
                details: record.details,
            };
            return acc;
        }, {});

        return {
            monthYear: attendance.monthYear,
            daysInMonth: attendance.daysInMonth,
            firstDay: attendance.firstDay,
            records: recordsMap,
        };
    };

    const serializeMonthRecords = (month) =>
        Object.keys(month.records).map((day) => ({
            day: Number(day),
            status: month.records[day].status,
            method: month.records[day].method,
            time: month.records[day].time,
            details: month.records[day].details,
        }));

    const handleMarkAttendance = (status) => {
        const newRecord = {
            status,
            method: status === 'present' ? 'Face Scan' : status === 'leave' ? 'Gate Pass' : 'Not Marked',
            time: status === 'present' ? '09:00 AM' : 'N/A',
            details: status === 'present'
                ? 'Marked present by student.'
                : status === 'leave'
                    ? 'Leave requested by student.'
                    : 'Attendance mark reset to not recorded.',
        };

        setAttendanceMonthState({
            ...monthData,
            records: {
                ...monthData.records,
                [selectedDay]: newRecord,
            },
        });

        setAttendanceStatus(`Selected day ${selectedMonth} ${selectedDay} marked ${status.replace('_', ' ')}.`);
    };

    const saveAttendanceChanges = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAttendanceError('Authentication token missing. Please log in again.');
            return;
        }

        setIsLoadingAttendance(true);
        setAttendanceError('');
        setAttendanceStatus('');

        try {
            const response = await fetch(`${API_BASE_URL}/attendance`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    monthYear: selectedMonth,
                    daysInMonth,
                    firstDay: firstDayOfMonth,
                    records: serializeMonthRecords(monthData),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setAttendanceError(errorData.message || 'Unable to save attendance.');
                return;
            }

            const data = await response.json();
            setAttendanceData(data.attendance);
            setAttendanceMonthState(buildMonthState(data.attendance));
            setAttendanceStatus('Attendance saved successfully.');
        } catch (error) {
            setAttendanceError('Unable to save attendance. Please try again later.');
            console.error('Save attendance error:', error);
        } finally {
            setIsLoadingAttendance(false);
        }
    };

    const attendancePayload = {
        monthYear: selectedMonth,
        daysInMonth: monthData.daysInMonth,
        firstDay: monthData.firstDay,
        records: Object.keys(monthData.records).map((day) => ({
            day: Number(day),
            status: monthData.records[day].status,
            method: monthData.records[day].method,
            time: monthData.records[day].time,
            details: monthData.records[day].details,
        })),
    };

    // Calculate dynamic stats for this selected month
    const totalDays = daysInMonth;
    let presentCount = 0;
    let leaveCount = 0;
    let absentCount = 0;
    let faceScanCount = 0;
    let rectorManualCount = 0;

    for (let day = 1; day <= totalDays; day++) {
        const record = records[day] || { status: 'not_marked', method: 'Not Marked' };
        if (record.status === 'present') {
            presentCount++;
            if (record.method === 'Face Scan') faceScanCount++;
            else if (record.method === 'Rector Manual') rectorManualCount++;
        } else if (record.status === 'leave') {
            leaveCount++;
        } else {
            absentCount++;
        }
    }

    const attendanceRate = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return '#1cc88a'; // Green
            case 'leave': return '#e74a3b'; // Red
            case 'not_marked': return '#f6c23e'; // Yellow
            default: return '#eaecf4';
        }
    };

    const getMethodIcon = (method) => {
        switch (method) {
            case 'Face Scan': return <i className="fas fa-camera" style={{ color: '#1cc88a' }}></i>;
            case 'Rector Manual': return <i className="fas fa-user-shield" style={{ color: '#4e73df' }}></i>;
            case 'Gate Pass': return <i className="fas fa-id-card" style={{ color: '#e74a3b' }}></i>;
            default: return <i className="fas fa-exclamation-circle" style={{ color: '#f6c23e' }}></i>;
        }
    };

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const handleDayClick = (day) => {
        if (day) {
            setSelectedDay(day);
        }
    };

    const selectedRecord = records[selectedDay] || { status: 'not_marked', method: 'Not Marked', time: 'N/A', details: 'No scan or manual check-in logged' };

    const fetchAttendance = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAttendanceError('Authentication token missing. Please log in again.');
            return;
        }

        setIsLoadingAttendance(true);
        setAttendanceError('');
        setAttendanceStatus('');

        try {
            const response = await fetch(`${API_BASE_URL}/attendance?monthYear=${encodeURIComponent(selectedMonth)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 404 && attendanceDb[selectedMonth]) {
                    setAttendanceStatus('No existing attendance record found for this month, syncing static data to backend...');
                    const saveResponse = await fetch(`${API_BASE_URL}/attendance`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(attendancePayload),
                    });

                    if (!saveResponse.ok) {
                        const saveError = await saveResponse.json();
                        setAttendanceError(saveError.message || 'Unable to sync attendance to backend.');
                        setAttendanceData(null);
                        return;
                    }

                    const saveData = await saveResponse.json();
                    setAttendanceData(saveData.attendance);
                    setAttendanceStatus('Attendance synced successfully from demo data.');
                    return;
                }

                setAttendanceError(errorData.message || 'Unable to load attendance for this month.');
                setAttendanceData(null);
                return;
            }

            const attendance = await response.json();
            setAttendanceData(attendance);
        } catch (error) {
            setAttendanceError('Unable to load attendance. Please try again later.');
            setAttendanceData(null);
            console.error('Attendance fetch error:', error);
        } finally {
            setIsLoadingAttendance(false);
        }
    };

    useEffect(() => {
        fetchAttendance();

        const onAttendanceUpdated = () => {
            fetchAttendance();
        };

        socket.on('attendance_updated', onAttendanceUpdated);
        return () => {
            socket.off('attendance_updated', onAttendanceUpdated);
        };
    }, [selectedMonth]);

    return (
        <>
            <Header title="My Attendance History" />

            {attendanceError && (
                <div className="attendance-alert error-alert">
                    {attendanceError}
                </div>
            )}
            <div className="attendance-header-actions">
                <button className="refresh-button" onClick={fetchAttendance} disabled={isLoadingAttendance}>
                    {isLoadingAttendance ? 'Refreshing...' : 'Refresh Attendance'}
                </button>
            </div>

            {attendanceStatus && (
                <div className="attendance-alert status-alert">
                    {attendanceStatus}
                </div>
            )}
            {isLoadingAttendance && (
                <div className="attendance-alert loading-alert">
                    Loading attendance data...
                </div>
            )}

            <style>{`
                .container {
                    padding: 30px;
                    max-width: 1600px;
                    margin: 0 auto;
                }

                .attendance-grid {
                    display: grid;
                    grid-template-columns: 1.8fr 1.2fr;
                    gap: 30px;
                    align-items: flex-start;
                }

                @media (max-width: 1024px) {
                    .attendance-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .widget {
                    background: white;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05);
                    border: 1px solid #eaecf4;
                }

                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    border-bottom: 2px solid #eaecf4;
                    padding-bottom: 15px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .widget-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #5a5c69;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .attendance-header-actions {
                    display: flex;
                    justify-content: flex-end;
                    margin: 20px 0 10px;
                }

                .refresh-button {
                    padding: 10px 16px;
                    border-radius: 8px;
                    border: none;
                    background: #4e73df;
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .refresh-button:hover {
                    background: #2d5ac7;
                }

                .refresh-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .selector-dropdown {
                    padding: 8px 12px;
                    border-radius: 6px;
                    border: 1px solid #d1d3e2;
                    background: white;
                    font-family: inherit;
                    font-size: 14px;
                    color: #4e73df;
                    font-weight: 600;
                    cursor: pointer;
                    outline: none;
                }

                .legend {
                    display: flex;
                    gap: 15px;
                    font-size: 12px;
                    flex-wrap: wrap;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;
                    color: #858796;
                }

                .legend-color {
                    width: 12px;
                    height: 12px;
                    border-radius: 3px;
                }

                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 12px;
                    text-align: center;
                }

                .weekday-header {
                    font-weight: 700;
                    color: #858796;
                    font-size: 13px;
                    padding-bottom: 10px;
                    text-transform: uppercase;
                }

                .attendance-alert {
                    max-width: 1200px;
                    margin: 20px auto;
                    padding: 16px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                }

                .error-alert {
                    background: #f8d7da;
                    color: #842029;
                    border: 1px solid #f5c2c7;
                }

                .status-alert {
                    background: #e9f7ef;
                    color: #0f5132;
                    border: 1px solid #badbcc;
                }

                .loading-alert {
                    background: #e7f5ff;
                    color: #084298;
                    border: 1px solid #b6d4fe;
                }

                .mark-button,
                .save-button {
                    padding: 10px 16px;
                    border-radius: 8px;
                    border: none;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.2s, opacity 0.2s;
                }

                .mark-button.present {
                    background: #1cc88a;
                    color: white;
                }

                .mark-button.leave {
                    background: #e74a3b;
                    color: white;
                }

                .mark-button.missing {
                    background: #f6c23e;
                    color: #333;
                }

                .save-button {
                    background: #4e73df;
                    color: white;
                }

                .mark-button:hover,
                .save-button:hover {
                    transform: translateY(-1px);
                }

                .mark-button:disabled,
                .save-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .day-cell {
                    aspect-ratio: 1.1/1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    position: relative;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    transition: transform 0.2s, box-shadow 0.2s;
                    border: 1px solid transparent;
                }

                .day-cell:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.08);
                }

                .day-cell.active-selection {
                    border: 2px solid #333;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                }

                .day-number {
                    color: white;
                    margin-bottom: 2px;
                }

                .day-badge {
                    font-size: 9px;
                    font-weight: 600;
                    color: rgba(255,255,255,0.9);
                    text-transform: uppercase;
                    background: rgba(0,0,0,0.12);
                    padding: 1px 4px;
                    border-radius: 3px;
                }

                /* Stats grid styles */
                .stats-panel {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }

                .stat-box {
                    padding: 15px;
                    border-radius: 10px;
                    border: 1px solid #eaecf4;
                    background: #f8f9fc;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .stat-box.large {
                    grid-column: span 2;
                    text-align: center;
                    padding: 25px;
                    background: #fff;
                    border-top: 4px solid #4e73df;
                }

                .stat-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: #858796;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 5px;
                }

                .stat-value {
                    font-size: 24px;
                    font-weight: 800;
                    color: #5a5c69;
                }

                .stat-box.large .stat-value {
                    font-size: 42px;
                    color: #4e73df;
                    margin-bottom: 5px;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #f1f3f8;
                    font-size: 13px;
                }

                .detail-row:last-child {
                    border-bottom: none;
                }

                .detail-label {
                    color: #858796;
                    font-weight: 600;
                }

                .detail-value {
                    color: #333;
                    font-weight: 700;
                    text-align: right;
                }

                .detail-card {
                    border-left: 5px solid #1cc88a;
                    animation: fadeIn 0.3s ease;
                }

                .detail-card.leave { border-left-color: #e74a3b; }
                .detail-card.not_marked { border-left-color: #f6c23e; }

                .badge-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .badge-present { background: #e6fffa; color: #1cc88a; }
                .badge-leave { background: #fff5f5; color: #e74a3b; }
                .badge-missing { background: #fffdf0; color: #f6c23e; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="container">
                <div className="attendance-grid">
                    {/* Calendar Section */}
                    <div className="widget">
                        <div className="widget-header">
                            <div className="widget-title">
                                <i className="fas fa-calendar-alt" style={{ color: '#4e73df' }}></i> Attendance History
                            </div>
                            <select 
                                className="selector-dropdown"
                                value={selectedMonth}
                                onChange={(e) => {
                                    setSelectedMonth(e.target.value);
                                    setSelectedDay(1); // Default to the first day of that month
                                }}
                            >
                                {Object.keys(attendanceDb).map(month => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                        </div>

                        <div className="widget-header" style={{ borderBottom: 'none', padding: 0, marginBottom: '20px' }}>
                            <div className="legend">
                                <div className="legend-item">
                                    <span className="legend-color" style={{ background: '#1cc88a' }}></span> Present
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color" style={{ background: '#e74a3b' }}></span> On Leave
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color" style={{ background: '#f6c23e' }}></span> Not Marked
                                </div>
                            </div>
                            <div style={{ fontSize: '12px', color: '#858796', fontWeight: 600 }}>
                                *Click on any day to view verification method
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="calendar-grid">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="weekday-header">
                                    {day}
                                </div>
                            ))}
                            {calendarDays.map((day, idx) => {
                                if (!day) return <div key={`empty-${idx}`} style={{ opacity: 0 }}></div>;
                                
                                const dayRecord = records[day] || { status: 'not_marked', method: 'Not Marked' };
                                const bg = getStatusColor(dayRecord.status);
                                const label = dayRecord.method === 'Face Scan' ? 'Scan' : 
                                              dayRecord.method === 'Rector Manual' ? 'Rect' : 
                                              dayRecord.method === 'Gate Pass' ? 'Leave' : 'Miss';

                                return (
                                    <div 
                                        key={`day-${day}`} 
                                        className={`day-cell ${selectedDay === day ? 'active-selection' : ''}`}
                                        onClick={() => handleDayClick(day)}
                                        style={{ background: bg }}
                                    >
                                        <div className="day-number">{day}</div>
                                        <span className="day-badge">{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stats & Detail Widget Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {/* Dynamic Stats Panel */}
                        <div className="widget stats-panel">
                            <div className="stat-box large">
                                <div className="stat-label">Month Attendance Rate</div>
                                <div className="stat-value">{attendanceRate}%</div>
                                <div style={{ fontSize: '11px', color: '#858796', marginTop: '5px' }}>
                                    Based on {presentCount} present days out of {totalDays} total days
                                </div>
                            </div>

                            <div className="stat-box" style={{ borderLeft: '4px solid #1cc88a' }}>
                                <div className="stat-label">Present</div>
                                <div className="stat-value" style={{ color: '#1cc88a' }}>{presentCount}</div>
                                <div style={{ fontSize: '10px', color: '#858796', marginTop: '3px' }}>
                                    ({faceScanCount} Scan / {rectorManualCount} Rector)
                                </div>
                            </div>

                            <div className="stat-box" style={{ borderLeft: '4px solid #e74a3b' }}>
                                <div className="stat-label">On Leave</div>
                                <div className="stat-value" style={{ color: '#e74a3b' }}>{leaveCount}</div>
                                <div style={{ fontSize: '10px', color: '#858796', marginTop: '3px' }}>
                                    Approved Gate Passes
                                </div>
                            </div>

                            <div className="stat-box" style={{ borderLeft: '4px solid #f6c23e', gridColumn: 'span 2' }}>
                                <div className="stat-label">Absent / Not Marked</div>
                                <div className="stat-value" style={{ color: '#f6c23e' }}>{absentCount}</div>
                                <div style={{ fontSize: '10px', color: '#858796', marginTop: '3px' }}>
                                    Requires explanation from rector if unexcused
                                </div>
                            </div>
                        </div>

                        {/* Verification Details Panel */}
                        <div className={`widget detail-card ${selectedRecord.status}`}>
                            <div className="widget-header" style={{ marginBottom: '15px', borderBottom: 'none', padding: 0 }}>
                                <div className="widget-title">
                                    <i className="fas fa-fingerprint" style={{ color: '#4e73df' }}></i> Log Details
                                </div>
                                <span className={`badge-status badge-${selectedRecord.status === 'present' ? 'present' : selectedRecord.status === 'leave' ? 'leave' : 'missing'}`}>
                                    {selectedRecord.status === 'present' ? 'Present' : selectedRecord.status === 'leave' ? 'Leave' : 'Absent'}
                                </span>
                            </div>

                            <div style={{ background: '#f8f9fc', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ background: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    {getMethodIcon(selectedRecord.method)}
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#858796', fontWeight: 600, textTransform: 'uppercase' }}>Verification Method</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>
                                        {selectedRecord.method === 'Face Scan' ? 'Hostel Face Scan Kiosk' : 
                                         selectedRecord.method === 'Rector Manual' ? 'Rector Roll Call' : 
                                         selectedRecord.method === 'Gate Pass' ? 'Approved Gate Pass System' : 'Not Recorded'}
                                    </div>
                                </div>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">Date Selected</span>
                                <span className="detail-value">{selectedDay} {selectedMonth}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Timestamp logged</span>
                                <span className="detail-value">{selectedRecord.time}</span>
                            </div>
                            <div className="detail-row" style={{ flexDirection: 'column', gap: '5px', borderBottom: 'none', paddingBottom: 0 }}>
                                <span className="detail-label" style={{ textAlign: 'left' }}>System Status Details</span>
                                <span className="detail-value" style={{ textAlign: 'left', color: '#5a5c69', fontSize: '12px', fontWeight: 500, lineHeight: 1.5, background: '#f8f9fc', padding: '10px', borderRadius: '6px', marginTop: '3px' }}>
                                    {selectedRecord.details}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                                <button className="mark-button present" onClick={() => handleMarkAttendance('present')} disabled={isLoadingAttendance}>
                                    Mark Present
                                </button>
                                <button className="mark-button leave" onClick={() => handleMarkAttendance('leave')} disabled={isLoadingAttendance}>
                                    Mark Leave
                                </button>
                                <button className="mark-button missing" onClick={() => handleMarkAttendance('not_marked')} disabled={isLoadingAttendance}>
                                    Mark Not Recorded
                                </button>
                                <button className="save-button" onClick={saveAttendanceChanges} disabled={isLoadingAttendance}>
                                    Save Changes
                                </button>
                            </div>

                            {selectedRecord.status === 'present' && selectedRecord.method === 'Face Scan' && (
                                <div style={{ marginTop: '20px', padding: '12px', background: '#e6fffa', borderRadius: '8px', fontSize: '11px', color: '#1cc88a', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <i className="fas fa-shield-alt"></i>
                                    <span>Match accuracy verified: <strong>99.4%</strong>. Logged at security entrance.</span>
                                </div>
                            )}

                            {selectedRecord.status === 'present' && selectedRecord.method === 'Rector Manual' && (
                                <div style={{ marginTop: '20px', padding: '12px', background: '#e8f0fe', borderRadius: '8px', fontSize: '11px', color: '#4e73df', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <i className="fas fa-check-double"></i>
                                    <span>Verified by Rector Mrs. Priya Kumar during 9:00 PM hostel check.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentAttendance;
