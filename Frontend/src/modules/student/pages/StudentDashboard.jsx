import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL, getImageUrl } from '../../../config';
import socket from '../../../socket';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [gatepasses, setGatepasses] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [attendancePercent, setAttendancePercent] = useState('92%');
    const [todayPresent, setTodayPresent] = useState(true);
    const [feeAmount, setFeeAmount] = useState('₹12,500');
    const [feeDueDate, setFeeDueDate] = useState('15 Feb 2026');
    const [isLoading, setIsLoading] = useState(true);

    const [studentInfo, setStudentInfo] = useState({
        name: localStorage.getItem('name') || 'Student',
        phone: '',
        branch: 'Student',
        rollNo: '',
        roomInfo: '',
        parentPhone: '',
        profileImage: localStorage.getItem('profileImage') || ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchData = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${token}`
                };

                // Fetch profile
                const profileRes = await fetch(`${API_BASE_URL}/auth/me`, { headers });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setStudentInfo(profileData);
                }

                // Fetch complaints
                const compRes = await fetch(`${API_BASE_URL}/complaints`, { headers });
                if (compRes.ok) {
                    const compData = await compRes.json();
                    setComplaints(compData);
                }

                // Fetch gate passes
                const gpRes = await fetch(`${API_BASE_URL}/gatepass`, { headers });
                if (gpRes.ok) {
                    const gpData = await gpRes.json();
                    setGatepasses(gpData);
                }

                // Fetch announcements
                const annRes = await fetch(`${API_BASE_URL}/announcements`, { headers });
                if (annRes.ok) {
                    const annData = await annRes.json();
                    setAnnouncements(annData);
                }

                // Fetch attendance stats if available
                try {
                    const attRes = await fetch(`${API_BASE_URL}/attendance`, { headers });
                    if (attRes.ok) {
                        const attData = await attRes.json();
                        if (Array.isArray(attData) && attData.length > 0) {
                            const latest = attData[0];
                            if (latest.records && latest.records.length > 0) {
                                const total = latest.records.length;
                                const presentCount = latest.records.filter(r => r.status === 'Present').length;
                                const pct = Math.round((presentCount / total) * 100);
                                setAttendancePercent(`${pct}%`);

                                const todayDay = new Date().getDate();
                                const todayRec = latest.records.find(r => r.day === todayDay);
                                if (todayRec) {
                                    setTodayPresent(todayRec.status === 'Present');
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error('Error fetching attendance:', e);
                }

                // Fetch real fee stats if available
                try {
                    const feeRes = await fetch(`${API_BASE_URL}/fees/my`, { headers });
                    if (feeRes.ok) {
                        const feeData = await feeRes.json();
                        if (feeData && feeData.fees && feeData.fees.length > 0) {
                            const pending = feeData.fees.filter(f => f.status !== 'Paid');
                            if (pending.length > 0) {
                                const totalPending = pending.reduce((sum, item) => sum + (item.amount || 0), 0);
                                setFeeAmount(`₹${totalPending.toLocaleString()}`);
                                if (pending[0].dueDate) {
                                    setFeeDueDate(new Date(pending[0].dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }));
                                }
                            } else {
                                setFeeAmount('₹0 (Paid)');
                                setFeeDueDate('All cleared');
                            }
                        }
                    }
                } catch (e) {
                    console.error('Error fetching fees:', e);
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        const handleRealtimeUpdate = () => {
            fetchData();
        };

        socket.on('attendance_updated', handleRealtimeUpdate);
        window.addEventListener('profileUpdate', handleRealtimeUpdate);
        return () => {
            socket.off('attendance_updated', handleRealtimeUpdate);
            window.removeEventListener('profileUpdate', handleRealtimeUpdate);
        };
    }, []);

    const profilePhoto = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200';

    return (
        <>
            <Header title="Student Dashboard" />
            <style>{`
                .dashboard-container {
                    padding: 30px;
                    max-width: 1600px;
                    margin: 0 auto;
                    display: flex;
                    gap: 30px;
                    align-items: flex-start;
                }
                
                .left-sidebar {
                    width: 320px;
                    flex-shrink: 0;
                }

                .main-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .profile-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 40px 20px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    border-top: 4px solid #4e73df;
                }

                .profile-img-container {
                    width: 120px;
                    height: 120px;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    border: 4px solid #fff;
                    background: #f8f9fc;
                    margin-bottom: 20px;
                }

                .profile-name {
                    margin: 0;
                    color: #333;
                    font-size: 20px;
                    font-weight: 700;
                }

                .profile-role {
                    margin: 5px 0 30px;
                    color: #858796;
                    font-weight: 400;
                    font-size: 14px;
                }

                .profile-details-grid {
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr auto;
                    row-gap: 15px;
                    text-align: left;
                    font-size: 14px;
                }

                .detail-label {
                    color: #858796;
                    font-weight: 700;
                }

                .detail-value {
                    color: #5a5c69;
                    font-weight: 600;
                    text-align: right;
                }

                .interactive-card {
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .interactive-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important;
                }

                .interactive-item {
                    cursor: pointer;
                    transition: background 0.2s ease, padding-left 0.2s ease;
                }
                .interactive-item:hover {
                    background: #f8f9fc;
                    padding-left: 8px !important;
                }

                @media (max-width: 992px) {
                    .dashboard-container { flex-direction: column; }
                    .left-sidebar { width: 100%; }
                }

                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(28, 200, 138, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(28, 200, 138, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(28, 200, 138, 0); }
                }
            `}</style>

            <div className="dashboard-container">
                {/* Left Sidebar - Student Profile */}
                <div className="left-sidebar">
                    <div className="profile-card">
                        <div className="profile-img-container" style={{ position: 'relative' }}>
                            {studentInfo.profileImage ? (
                                <img src={getImageUrl(studentInfo.profileImage)} alt="Student Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <img src={profilePhoto} alt="Student Placeholder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                        </div>
                        <Link to="/student/settings" style={{ fontSize: '12px', color: '#4e73df', textDecoration: 'none', fontWeight: 600, marginTop: '-10px', marginBottom: '15px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fas fa-camera"></i> Change Photo
                        </Link>
                        <h3 className="profile-name">{studentInfo.name}</h3>
                        <div className="profile-role">{studentInfo.branch}</div>

                        <div className="profile-details-grid">
                            <span className="detail-label">Roll/Enroll No</span>
                            <span className="detail-value">{studentInfo.rollNo || 'N/A'}</span>

                            <span className="detail-label">Hostel & Room</span>
                            <span className="detail-value">{studentInfo.roomInfo || 'N/A'}</span>

                            <span className="detail-label">Mobile</span>
                            <span className="detail-value">{studentInfo.phone || 'N/A'}</span>

                            <span className="detail-label">Parent Mobile</span>
                            <span className="detail-value">{studentInfo.parentPhone || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Rector Status Card in Sidebar */}
                    <div className="widget interactive-card" style={{ marginTop: '30px' }} onClick={() => navigate('/student/complaints')}>
                        <div style={{ fontSize: '12px', color: '#858796', textTransform: 'uppercase', fontWeight: 700, marginBottom: '15px', letterSpacing: '0.5px' }}>
                            Hostel Rector Status
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#f8f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4e73df' }}>
                                <i className="fas fa-user-tie"></i>
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, color: '#333', fontSize: '15px' }}>Mrs. Priya Kumar</div>
                                <div style={{ fontSize: '11px', color: '#858796' }}>{studentInfo.roomInfo || 'Hostel Care'}</div>
                            </div>
                        </div>
                        <div style={{ 
                            padding: '10px', 
                            borderRadius: '10px', 
                            background: '#e6fffa', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            justifyContent: 'center'
                        }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1cc88a', boxShadow: '0 0 8px #1cc88a', animation: 'pulse 2s infinite' }}></span>
                            <span style={{ fontWeight: 800, color: '#1cc88a', fontSize: '13px' }}>Currently Present</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="main-content">
                    {/* Emergency Alert */}
                    <div className="widget interactive-card" style={{ borderLeft: '5px solid #e74a3b', background: '#fff5f5', padding: '15px 20px' }} onClick={() => navigate('/student/announcements')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ color: '#e74a3b', fontSize: '24px' }}><i className="fas fa-exclamation-triangle"></i></div>
                            <div>
                                <div style={{ fontWeight: 700, color: '#e74a3b', fontSize: '14px', textTransform: 'uppercase' }}>Emergency Alert</div>
                                <div style={{ color: '#5a5c69', fontSize: '15px', fontWeight: 500 }}>
                                    {announcements.find(a => a.category === 'Emergency')?.content || 'Water supply interruption today from 2:00 PM to 5:00 PM due to tank maintenance.'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div className="widget interactive-card" style={{ textAlign: 'center', padding: '25px' }} onClick={() => navigate('/student/attendance')}>
                            <div style={{ fontSize: '12px', color: '#858796', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase' }}>Daily Status</div>
                            <div style={{ background: todayPresent ? '#e6fffa' : '#fff5f5', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: todayPresent ? '#1cc88a' : '#e74a3b', margin: '0 auto 15px', fontSize: '24px' }}>
                                <i className={`fas ${todayPresent ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: todayPresent ? '#1cc88a' : '#e74a3b' }}>{todayPresent ? 'Present' : 'Absent'}</div>
                            <div style={{ fontSize: '11px', color: '#858796', marginTop: '5px' }}>Click to view / mark attendance</div>
                        </div>

                        <div className="widget interactive-card" style={{ textAlign: 'center', padding: '25px' }} onClick={() => navigate('/student/settings')}>
                            <div style={{ fontSize: '12px', color: '#858796', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase' }}>Fee Dues</div>
                            <div style={{ background: '#fff5f5', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e74a3b', margin: '0 auto 15px', fontSize: '24px' }}>
                                <i className="fas fa-file-invoice-dollar"></i>
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#e74a3b' }}>{feeAmount}</div>
                            <div style={{ fontSize: '11px', color: '#858796', marginTop: '5px' }}>Due: {feeDueDate}</div>
                        </div>

                        <div className="widget interactive-card" style={{ textAlign: 'center', padding: '25px' }} onClick={() => navigate('/student/attendance')}>
                            <div style={{ fontSize: '12px', color: '#858796', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase' }}>Attendance</div>
                            <div style={{ background: '#e8f0fe', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4e73df', margin: '0 auto 15px', fontSize: '24px' }}>
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#4e73df' }}>{attendancePercent}</div>
                            <div style={{ fontSize: '11px', color: '#858796', marginTop: '5px' }}>Current Month</div>
                        </div>
                    </div>

                    {/* Tables Row */}
                    <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        {/* Complaints */}
                        <div className="widget">
                            <div className="widget-header">
                                <div className="widget-title">Room {studentInfo.roomInfo || 'Hostel'} Complaints</div>
                                <Link to="/student/complaints" className="btn-sm">New</Link>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {complaints.length === 0 ? (
                                    <li style={{ padding: '12px 0', color: '#858796', fontSize: '14px' }}>No complaints filed yet.</li>
                                ) : (
                                    complaints.slice(0, 3).map(comp => {
                                        let badgeBg = '#fff8e1';
                                        let badgeColor = '#f6c23e';
                                        if (comp.status === 'Resolved') {
                                            badgeBg = '#e6fffa';
                                            badgeColor = '#1cc88a';
                                        } else if (comp.status === 'In Progress') {
                                            badgeBg = '#eaecf4';
                                            badgeColor = '#4e73df';
                                        } else if (comp.status === 'Rejected') {
                                            badgeBg = '#fff5f5';
                                            badgeColor = '#e74a3b';
                                        }

                                        return (
                                            <li 
                                                key={comp._id} 
                                                className="interactive-item"
                                                onClick={() => navigate('/student/complaints')}
                                                style={{ padding: '12px 0', borderBottom: '1px solid #f1f3f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#5a5c69' }}>{comp.problem}</div>
                                                    <div style={{ fontSize: '11px', color: '#858796' }}>{comp.category} • {new Date(comp.createdAt).toLocaleDateString(undefined, {day: 'numeric', month: 'short'})}</div>
                                                </div>
                                                <span className="status-badge" style={{ 
                                                    background: badgeBg,
                                                    color: badgeColor
                                                }}>{comp.status}</span>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>

                        {/* Gatepass */}
                        <div className="widget">
                            <div className="widget-header">
                                <div className="widget-title">Gatepass Status</div>
                                <Link to="/student/gatepass" className="btn-sm">Apply</Link>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {gatepasses.length === 0 ? (
                                    <li style={{ padding: '12px 0', color: '#858796', fontSize: '14px' }}>No gate passes applied yet.</li>
                                ) : (
                                    gatepasses.slice(0, 3).map(gp => {
                                        let badgeBg = '#fff8e1';
                                        let badgeColor = '#f6c23e';
                                        if (gp.status === 'Approved') {
                                            badgeBg = '#e6fffa';
                                            badgeColor = '#1cc88a';
                                        } else if (gp.status === 'Rejected') {
                                            badgeBg = '#fff5f5';
                                            badgeColor = '#e74a3b';
                                        }

                                        return (
                                            <li 
                                                key={gp._id} 
                                                className="interactive-item"
                                                onClick={() => navigate('/student/gatepass')}
                                                style={{ padding: '12px 0', borderBottom: '1px solid #f1f3f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#5a5c69' }}>{gp.reason}</div>
                                                    <div style={{ fontSize: '11px', color: '#858796' }}>{gp.destination} • {new Date(gp.fromDate).toLocaleDateString(undefined, {day: 'numeric', month: 'short'})}</div>
                                                </div>
                                                <span className="status-badge" style={{ 
                                                    background: badgeBg,
                                                    color: badgeColor
                                                }}>{gp.status}</span>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Announcements Section */}
                    <div className="widget">
                        <div className="widget-header">
                            <div className="widget-title">Latest Announcements</div>
                            <Link to="/student/announcements" className="btn-sm">View All</Link>
                        </div>
                        <div style={{ padding: '5px' }}>
                            {announcements.length === 0 ? (
                                <p style={{ fontSize: '14px', color: '#858796', margin: 0 }}>No announcements posted yet.</p>
                            ) : (
                                announcements.slice(0, 3).map((ann) => (
                                    <div 
                                        key={ann._id} 
                                        className="interactive-item"
                                        onClick={() => navigate('/student/announcements')}
                                        style={{ fontSize: '14px', color: '#5a5c69', marginBottom: '15px', borderLeft: `4px solid ${ann.color || '#4e73df'}`, paddingLeft: '15px', padding: '10px' }}
                                    >
                                        <strong>{ann.title}:</strong> {ann.content}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentDashboard;
