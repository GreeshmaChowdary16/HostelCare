import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../config';

const StudentDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [gatepasses, setGatepasses] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [studentInfo, setStudentInfo] = useState({
        name: localStorage.getItem('name') || 'Student',
        phone: '',
        branch: 'Student',
        rollNo: '',
        roomInfo: '',
        parentPhone: ''
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
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const profilePhoto = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200'; // Placeholder premium photo

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
                        <div className="profile-img-container">
                            <img src={profilePhoto} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
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
                    <div className="widget" style={{ marginTop: '30px' }}>
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
                    <div className="widget" style={{ borderLeft: '5px solid #e74a3b', background: '#fff5f5', padding: '15px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ color: '#e74a3b', fontSize: '24px' }}><i className="fas fa-exclamation-triangle"></i></div>
                            <div>
                                <div style={{ fontWeight: 700, color: '#e74a3b', fontSize: '14px', textTransform: 'uppercase' }}>Emergency Alert</div>
                                <div style={{ color: '#5a5c69', fontSize: '15px', fontWeight: 500 }}>
                                    Water supply interruption today from 2:00 PM to 5:00 PM due to tank maintenance.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div className="widget" style={{ textAlign: 'center', padding: '25px' }}>
                            <div style={{ fontSize: '12px', color: '#858796', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase' }}>Daily Status</div>
                            <div style={{ background: '#e6fffa', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1cc88a', margin: '0 auto 15px', fontSize: '24px' }}>
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1cc88a' }}>Present</div>
                            <div style={{ fontSize: '11px', color: '#858796', marginTop: '5px' }}>Last marked: 08:30 AM</div>
                        </div>

                        <div className="widget" style={{ textAlign: 'center', padding: '25px' }}>
                            <div style={{ fontSize: '12px', color: '#858796', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase' }}>Fee Status</div>
                            <div style={{ background: '#fff5f5', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e74a3b', margin: '0 auto 15px', fontSize: '24px' }}>
                                <i className="fas fa-file-invoice-dollar"></i>
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#e74a3b' }}>₹12,500</div>
                            <div style={{ fontSize: '11px', color: '#858796', marginTop: '5px' }}>Due: 15 Feb 2026</div>
                        </div>

                        <div className="widget" style={{ textAlign: 'center', padding: '25px' }}>
                            <div style={{ fontSize: '12px', color: '#858796', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase' }}>Attendance</div>
                            <div style={{ background: '#e8f0fe', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4e73df', margin: '0 auto 15px', fontSize: '24px' }}>
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#4e73df' }}>92%</div>
                            <div style={{ fontSize: '11px', color: '#858796', marginTop: '5px' }}>Current Month</div>
                        </div>
                    </div>

                    {/* Tables Row */}
                    <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        {/* Complaints */}
                        <div className="widget">
                            <div className="widget-header">
                                <div className="widget-title">Room {studentInfo.roomNo} Complaints</div>
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
                                            <li key={comp._id} style={{ padding: '12px 0', borderBottom: '1px solid #f1f3f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                            <li key={gp._id} style={{ padding: '12px 0', borderBottom: '1px solid #f1f3f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                announcements.slice(0, 2).map((ann) => (
                                    <p key={ann._id} style={{ fontSize: '14px', color: '#5a5c69', marginBottom: '15px', borderLeft: `4px solid ${ann.color || '#4e73df'}`, paddingLeft: '15px' }}>
                                        <strong>{ann.title}:</strong> {ann.content}
                                    </p>
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
