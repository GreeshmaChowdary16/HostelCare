import React, { useState } from 'react';
import Header from '../../../components/Header';

const StudentAttendance = () => {
    const [selectedDay, setSelectedDay] = useState(null);

    // Current month info (February 2026 for demo)
    const currentMonth = "February";
    const currentYear = 2026;
    const daysInMonth = 28;
    const firstDayOfMonth = 0; // 0 for Sunday

    // Sample Attendance Data
    const attendanceData = {
        1: 'present', 2: 'present', 3: 'present', 4: 'present', 5: 'leave',
        6: 'present', 7: 'present', 8: 'not_marked', 9: 'present', 10: 'present',
        11: 'present', 12: 'present', 13: 'present', 14: 'leave', 15: 'leave',
        16: 'present', 17: 'not_marked', 18: 'present', 19: 'present', 20: 'present',
        21: 'present', 22: 'present', 23: 'present', 24: 'present', 25: 'present',
        26: 'present', 27: 'present', 28: 'present'
    };

    // Detailed Leave Info
    const leaveDetails = {
        5: { reason: "Family Function", outTime: "04 Feb, 06:00 PM", inTime: "05 Feb, 08:30 PM" },
        14: { reason: "Health Checkup", outTime: "14 Feb, 09:00 AM", inTime: "14 Feb, 05:00 PM" },
        15: { reason: "Local Outing", outTime: "15 Feb, 10:00 AM", inTime: "15 Feb, 07:45 PM" }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'var(--success)';
            case 'leave': return 'var(--danger)';
            case 'not_marked': return 'var(--warning)';
            default: return 'var(--primary-soft)';
        }
    };

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const handleDayClick = (day) => {
        if (day && attendanceData[day] === 'leave') {
            setSelectedDay(day);
        }
    };

    return (
        <>
            <Header title="My Attendance" />

            <div className="container">
                <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                    {/* Calendar Section */}
                    <div className="widget" style={{ padding: '25px' }}>
                        <div className="widget-header" style={{ marginBottom: '30px' }}>
                            <div className="widget-title">
                                <i className="fas fa-calendar-alt"></i> Attendance Calendar - {currentMonth} {currentYear}
                            </div>
                            <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ width: '12px', height: '12px', background: '#1cc88a', borderRadius: '3px' }}></span> Present
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ width: '12px', height: '12px', background: '#e74a3b', borderRadius: '3px' }}></span> On Leave
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ width: '12px', height: '12px', background: '#f6c23e', borderRadius: '3px' }}></span> Not Marked
                                </div>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(7, 1fr)', 
                            gap: '15px',
                            textAlign: 'center'
                        }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} style={{ fontWeight: 700, color: '#858796', fontSize: '13px', paddingBottom: '10px' }}>
                                    {day}
                                </div>
                            ))}
                            {calendarDays.map((day, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => handleDayClick(day)}
                                    style={{ 
                                        aspectRatio: '1/1', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        background: day ? getStatusColor(attendanceData[day]) : 'transparent',
                                        color: day ? 'white' : 'transparent',
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        cursor: day && attendanceData[day] === 'leave' ? 'pointer' : 'default',
                                        position: 'relative',
                                        boxShadow: day ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'transform 0.2s',
                                        border: selectedDay === day ? '2px solid #333' : 'none'
                                    }}
                                    onMouseEnter={(e) => { if(day && attendanceData[day] === 'leave') e.currentTarget.style.transform = 'scale(1.05)'; }}
                                    onMouseLeave={(e) => { if(day && attendanceData[day] === 'leave') e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                    {day}
                                    {day && (
                                        <span style={{ 
                                            fontSize: '8px', 
                                            fontWeight: 400, 
                                            opacity: 0.9,
                                            marginTop: '2px'
                                        }}>
                                            {statusLabelShort(attendanceData[day])}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        {selectedDay && (
                            <p style={{ marginTop: '20px', fontSize: '12px', color: '#858796', fontStyle: 'italic', textAlign: 'center' }}>
                                <i className="fas fa-info-circle"></i> Clicked on Leave day. See details in the pop-up or sidebar.
                            </p>
                        )}
                    </div>

                    {/* Summary & Details Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {selectedDay ? (
                            <div className="widget" style={{ borderLeft: '5px solid #e74a3b', animation: 'fadeIn 0.3s ease-in' }}>
                                <div className="widget-header">
                                    <div className="widget-title" style={{ color: '#e74a3b' }}>
                                        <i className="fas fa-id-card-alt"></i> Leave Details - {selectedDay} {currentMonth}
                                    </div>
                                    <button onClick={() => setSelectedDay(null)} className="btn-sm" style={{ background: '#f8f9fc' }}>×</button>
                                </div>
                                <div style={{ padding: '5px' }}>
                                    <div style={{ marginBottom: '15px' }}>
                                        <div style={{ fontSize: '11px', color: '#858796', textTransform: 'uppercase', fontWeight: 600 }}>Reason for Leave</div>
                                        <div style={{ fontWeight: 600, color: '#5a5c69', fontSize: '15px' }}>{leaveDetails[selectedDay].reason}</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: '#858796', textTransform: 'uppercase', fontWeight: 600 }}>Exit Time</div>
                                            <div style={{ fontWeight: 600, color: '#5a5c69', fontSize: '13px' }}>{leaveDetails[selectedDay].outTime}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '11px', color: '#858796', textTransform: 'uppercase', fontWeight: 600 }}>Gate Entry Time</div>
                                            <div style={{ fontWeight: 600, color: '#5a5c69', fontSize: '13px' }}>{leaveDetails[selectedDay].inTime}</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '15px' }}>
                                        <div style={{ fontSize: '11px', color: '#858796', textTransform: 'uppercase', fontWeight: 600 }}>Scan Entry Made</div>
                                        <div style={{ fontWeight: 700, color: '#1cc88a', fontSize: '14px' }}>
                                            <i className="fas fa-qrcode"></i> {leaveDetails[selectedDay].scanTime || leaveDetails[selectedDay].inTime}
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '20px', padding: '10px', background: '#fff5f5', borderRadius: '8px', fontSize: '12px', color: '#e74a3b' }}>
                                        <strong>Note:</strong> Entry was verified via scanner at the main gate.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="widget" style={{ textAlign: 'center', padding: '30px' }}>
                                <div style={{ fontSize: '14px', color: '#858796', fontWeight: 600, marginBottom: '20px' }}>TOTAL DAYS THIS MONTH</div>
                                <div style={{ fontSize: '48px', fontWeight: 800, color: '#4e73df' }}>28</div>
                                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px', borderTop: '1px solid #f1f3f8', paddingTop: '20px' }}>
                                    <div>
                                        <div style={{ color: '#1cc88a', fontWeight: 700, fontSize: '20px' }}>23</div>
                                        <div style={{ fontSize: '11px', color: '#858796' }}>PRESENT</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#e74a3b', fontWeight: 700, fontSize: '20px' }}>3</div>
                                        <div style={{ fontSize: '11px', color: '#858796' }}>LEAVE</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#f6c23e', fontWeight: 700, fontSize: '20px' }}>2</div>
                                        <div style={{ fontSize: '11px', color: '#858796' }}>MISSING</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="widget">
                            <div className="widget-header">
                                <div className="widget-title">Recent Activity</div>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ padding: '12px 0', borderBottom: '1px solid #f1f3f8', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '13px', color: '#5a5c69' }}>Marked Present</span>
                                    <span style={{ fontSize: '11px', color: '#858796' }}>Today, 08:30 AM</span>
                                </li>
                                <li style={{ padding: '12px 0', borderBottom: '1px solid #f1f3f8', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '13px', color: '#5a5c69' }}>Leave Approved</span>
                                    <span style={{ fontSize: '11px', color: '#858796' }}>14 Feb, 10:00 AM</span>
                                </li>
                                <li style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '13px', color: '#5a5c69' }}>Missed Marking</span>
                                    <span style={{ fontSize: '11px', color: '#e74a3b', fontWeight: 600 }}>08 Feb</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Overlay (Optional but nice) */}
            {selectedDay && (
                <div 
                    onClick={() => setSelectedDay(null)}
                    style={{ 
                        position: 'fixed', 
                        top: 0, left: 0, right: 0, bottom: 0, 
                        background: 'rgba(0,0,0,0.1)', 
                        zIndex: 999 
                    }}
                />
            )}
        </>
    );
};

const statusLabelShort = (status) => {
    switch (status) {
        case 'present': return 'PR';
        case 'leave': return 'LV';
        case 'not_marked': return 'MS';
        default: return '';
    }
};

export default StudentAttendance;


