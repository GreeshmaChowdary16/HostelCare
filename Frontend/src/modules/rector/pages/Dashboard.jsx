import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const Dashboard = () => {
    // Data States
    const [complaints, setComplaints] = useState([]);
    const [gatePasses, setGatePasses] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [studentStats, setStudentStats] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [rectorInfo, setRectorInfo] = useState({
        name: localStorage.getItem('name') || 'Rector',
        email: localStorage.getItem('email') || '',
        phone: '',
        office: ''
    });

    // Loading & Error States
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard components in parallel with error isolation
    const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing. Please log in again.');
            setIsLoading(false);
            return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            // 1. Fetch Rector Profile
            try {
                const profileRes = await fetch(`${API_BASE_URL}/auth/me`, { headers });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setRectorInfo(profileData);
                }
            } catch (err) {
                console.error('Rector profile fetch error:', err);
            }

            // 2. Fetch Complaints
            try {
                const compRes = await fetch(`${API_BASE_URL}/complaints`, { headers });
                if (compRes.ok) {
                    const compData = await compRes.json();
                    setComplaints(compData || []);
                }
            } catch (err) {
                console.error('Complaints fetch error:', err);
            }

            // 3. Fetch Gatepasses
            try {
                const gpRes = await fetch(`${API_BASE_URL}/gatepass`, { headers });
                if (gpRes.ok) {
                    const gpData = await gpRes.json();
                    setGatePasses(gpData || []);
                }
            } catch (err) {
                console.error('Gatepass fetch error:', err);
            }

            // 4. Fetch Student Stats
            try {
                const studentStatsRes = await fetch(`${API_BASE_URL}/students/stats`, { headers });
                if (studentStatsRes.ok) {
                    const studentStatsData = await studentStatsRes.json();
                    setStudentStats(studentStatsData);
                }
            } catch (err) {
                console.error('Student stats fetch error:', err);
            }

            // 5. Fetch Announcements
            try {
                const annRes = await fetch(`${API_BASE_URL}/announcements`, { headers });
                if (annRes.ok) {
                    const annData = await annRes.json();
                    setAnnouncements(annData || []);
                }
            } catch (err) {
                console.error('Announcements fetch error:', err);
            }

            // 6. Fetch Attendance matrix for current month (to parse today's presence count)
            try {
                const todayDate = new Date();
                const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
                const monthYear = `${todayDate.getFullYear()}-${mm}`;
                const attRes = await fetch(`${API_BASE_URL}/attendance?monthYear=${monthYear}`, { headers });
                if (attRes.ok) {
                    const attData = await attRes.json();
                    setAttendanceRecords(attData || []);
                }
            } catch (err) {
                console.error('Attendance fetch error:', err);
            }
        } catch (err) {
            console.error('Rector dashboard data error:', err);
            setError('Failed to refresh rector dashboard. Please retry.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Active complaints: Pending or In Progress statuses
    const activeComplaintsCount = complaints.filter(c => c.status === 'Pending' || c.status === 'In Progress').length;

    // Active approved gatepasses for today
    const getActiveGatePassesToday = () => {
        const today = new Date();
        return gatePasses.filter(g => 
            g.status === 'Approved' && 
            new Date(g.fromDate) <= today && 
            new Date(g.toDate) >= today
        ).length;
    };

    // Attendance Count: Marked Present on today's day number in the monthly attendance matrix
    const getPresentTodayCount = () => {
        const todayDay = new Date().getDate();
        return attendanceRecords.filter(record => 
            record.records?.some(r => r.day === todayDay && r.status === 'present')
        ).length;
    };

    // Extract dynamic statistics
    const totalStudentsCount = studentStats?.total ?? 'N/A';
    const presentTodayCount = attendanceRecords.length > 0 ? getPresentTodayCount() : 'N/A';
    const onLeaveCount = getActiveGatePassesToday();

    // Announcements helpers
    const latestAnn = announcements[0];
    const emergencyAnn = announcements.find(ann => 
        ann.color === '#e74a3b' || 
        ann.title?.toLowerCase().includes('emergency') || 
        ann.content?.toLowerCase().includes('emergency')
    );

    return (
        <>
            <Header title="Rector Dashboard" />
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
                    width: 300px;
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
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: #e8f0fe;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    color: #4e73df;
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
                    color: #5a5c69;
                    font-weight: 700;
                }

                .detail-value {
                    color: #5a5c69;
                    font-weight: 500;
                    text-align: right;
                }

                .green-text { color: #1cc88a; }

                /* Stats Grid */
                .overview-title {
                    font-size: 20px;
                    color: #5a5c69;
                    margin-bottom: 20px;
                    font-weight: 600;
                }

                .stats-grid-2x2 {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 20px;
                }

                .stat-card-modern {
                    padding: 25px;
                    border-radius: 8px;
                    color: white;
                    min-height: 140px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                
                .stat-label {
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 600;
                    margin-bottom: 5px;
                    opacity: 0.9;
                }
                
                .stat-value {
                    font-size: 36px;
                    font-weight: 700;
                    margin: 5px 0;
                }

                .stat-desc {
                    font-size: 13px;
                    opacity: 0.8;
                }

                /* Notification Row */
                .alert-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .alert-card {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .alert-header {
                    padding: 15px 20px;
                    font-weight: 700;
                    color: #5a5c69;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-bottom: 1px solid #f8f9fc;
                }

                .alert-body {
                    padding: 20px;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .alert-banner {
                    padding: 15px;
                    border-radius: 6px;
                    color: white;
                    width: 100%;
                    text-align: left;
                }

                .banner-blue { background: #4e73df; }
                .banner-red { background: #e74a3b; }

                /* Complaint Table */
                .table-card {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
                    padding: 25px;
                }

                .table-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .table-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #5a5c69;
                }

                .custom-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .custom-table th {
                    text-align: left;
                    padding: 12px 0;
                    color: #b7b9cc;
                    font-size: 13px;
                    font-weight: 600;
                    border-bottom: 1px solid #e3e6f0;
                }

                .custom-table td {
                    padding: 15px 0;
                    color: #5a5c69;
                    font-size: 14px;
                    font-weight: 600;
                    border-bottom: 1px solid #f8f9fc;
                }

                .status-chip {
                    padding: 5px 12px;
                    border-radius: 15px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .chip-pending { background: #fbecec; color: #e74a3b; }
                .chip-progress { background: #fffbe6; color: #f6c23e; }
                .chip-resolved { background: #e6fffa; color: #1cc88a; }

                .btn-track {
                    background: #e8f0fe;
                    color: #4e73df;
                    border: none;
                    padding: 6px 15px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-track:hover {
                    background: #4e73df;
                    color: #fff;
                }

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

                @media (max-width: 992px) {
                    .dashboard-container { flex-direction: column; }
                    .left-sidebar { width: 100%; }
                    .stats-grid-2x2 { grid-template-columns: 1fr; }
                    .alert-row { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="dashboard-container">
                {/* Left Sidebar - Rector Profile */}
                <div className="left-sidebar">
                    <div className="profile-card">
                        <div className="profile-img-container">
                            <i className="fas fa-female"></i>
                        </div>
                        <h3 className="profile-name" style={{ marginBottom: '30px' }}>{rectorInfo.name}</h3>

                        <div className="profile-details-grid">
                            <span className="detail-label">Role</span>
                            <span className="detail-value" style={{ textTransform: 'capitalize' }}>{rectorInfo.role || 'Rector'}</span>

                            <span className="detail-label">Mobile</span>
                            <span className="detail-value">{rectorInfo.phone || 'N/A'}</span>

                            <span className="detail-label">Email</span>
                            <span className="detail-value" style={{ fontSize: '13px' }}>{rectorInfo.email || 'N/A'}</span>

                            <span className="detail-label">Office Location</span>
                            <span className="detail-value">{rectorInfo.office || 'N/A'}</span>

                            <span className="detail-label">Shift Status</span>
                            <span className="detail-value green-text">Duty Active</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {error && (
                        <div className="status-message status-error">
                            <span>{error}</span>
                            <button className="status-chip chip-pending" style={{ border: 'none', cursor: 'pointer' }} onClick={fetchDashboardData}>
                                Retry Refresh
                            </button>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="table-card" style={{ textAlign: 'center', padding: '40px' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '10px', color: '#4e73df' }}></i>
                            <p style={{ margin: 0, color: '#858796' }}>Loading overview metrics...</p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <h2 className="overview-title">Overview</h2>
                                <div className="stats-grid-2x2">
                                    <Link to="/rector/students" className="stat-card-modern" style={{ background: '#4e73df', textDecoration: 'none' }}>
                                        <div>
                                            <div className="stat-label">TOTAL STUDENTS</div>
                                            <div className="stat-value">{totalStudentsCount}</div>
                                        </div>
                                        <div className="stat-desc">View Student Profiles <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i></div>
                                    </Link>

                                    <Link to="/rector/attendance" className="stat-card-modern" style={{ background: '#1cc88a', textDecoration: 'none' }}>
                                        <div>
                                            <div className="stat-label">PRESENT TODAY</div>
                                            <div className="stat-value">{presentTodayCount}</div>
                                        </div>
                                        <div className="stat-desc">Mark/View Daily Attendance <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i></div>
                                    </Link>

                                    <Link to="/rector/gatepass" className="stat-card-modern" style={{ background: '#f6c23e', textDecoration: 'none' }}>
                                        <div>
                                            <div className="stat-label">ON LEAVE TODAY</div>
                                            <div className="stat-value">{onLeaveCount}</div>
                                        </div>
                                        <div className="stat-desc">View Approved Gate Passes <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i></div>
                                    </Link>

                                    <Link to="/rector/complaints" className="stat-card-modern" style={{ background: '#e74a3b', textDecoration: 'none' }}>
                                        <div>
                                            <div className="stat-label">ACTIVE COMPLAINTS</div>
                                            <div className="stat-value">{activeComplaintsCount}</div>
                                        </div>
                                        <div className="stat-desc">Pending &amp; In-Progress Tasks <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i></div>
                                    </Link>
                                </div>
                            </div>

                            <div className="alert-row">
                                {/* Latest Announcement Card */}
                                <div className="alert-card">
                                    <div className="alert-header">
                                        <i className="fas fa-bell"></i> Latest Announcement
                                    </div>
                                    <div className="alert-body">
                                        {latestAnn ? (
                                            <div className="alert-banner banner-blue">
                                                <div style={{ fontWeight: 700, marginBottom: '5px' }}>{latestAnn.title}</div>
                                                <div style={{ fontSize: '13px', opacity: 0.9 }}>{latestAnn.content}</div>
                                            </div>
                                        ) : (
                                            <div style={{ color: '#858796', fontSize: '14px', fontStyle: 'italic' }}>
                                                No announcements posted yet.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Emergency Alert Card */}
                                <div className="alert-card">
                                    <div className="alert-header" style={{ color: '#e74a3b' }}>
                                        <i className="fas fa-exclamation-triangle"></i> Emergency Alert
                                    </div>
                                    <div className="alert-body">
                                        {emergencyAnn ? (
                                            <div className="alert-banner banner-red">
                                                <div style={{ fontWeight: 700, marginBottom: '5px' }}>{emergencyAnn.title}</div>
                                                <div style={{ fontSize: '13px', opacity: 0.9 }}>{emergencyAnn.content}</div>
                                            </div>
                                        ) : (
                                            <div className="alert-banner" style={{ background: '#1cc88a' }}>
                                                <div style={{ fontWeight: 700, marginBottom: '5px' }}>Hostel Safe & Secure</div>
                                                <div style={{ fontSize: '13px', opacity: 0.9 }}>No active emergency alerts recorded.</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Complaint Table */}
                            <div className="table-card">
                                <div className="table-header-row">
                                    <div className="table-title">Complaint Status &amp; Assignment</div>
                                    <Link to="/rector/complaints">
                                        <button className="btn-sm" style={{ background: '#eaecf4', color: '#6e707e', border: 'none', cursor: 'pointer' }}>View All</button>
                                    </Link>
                                </div>
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Room</th>
                                            <th>Issue</th>
                                            <th>Status</th>
                                            <th>Assigned To</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {complaints.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '15px', color: '#858796' }}>No complaints filed yet.</td>
                                            </tr>
                                        ) : (
                                            complaints.slice(0, 5).map(comp => {
                                                let icon = 'fa-tools';
                                                let color = '#4e73df';
                                                if (comp.category === 'Electrician') { icon = 'fa-bolt'; color = '#f6c23e'; }
                                                else if (comp.category === 'Plumber') { icon = 'fa-faucet'; color = '#36b9cc'; }
                                                else if (comp.category === 'Carpenter') { icon = 'fa-hammer'; color = '#e74a3b'; }
                                                else if (comp.category === 'Cleaning') { icon = 'fa-broom'; color = '#1cc88a'; }

                                                let chipClass = 'chip-pending';
                                                if (comp.status === 'Resolved') chipClass = 'chip-resolved';
                                                else if (comp.status === 'In Progress') chipClass = 'chip-progress';

                                                return (
                                                    <tr key={comp._id}>
                                                        <td>{comp.student?.roomInfo || comp.student?.roomNo || 'Unassigned'}</td>
                                                        <td>
                                                            <i className={`fas ${icon}`} style={{ color: color, marginRight: '8px' }}></i>
                                                            {comp.problem.length > 30 ? comp.problem.slice(0, 30) + '...' : comp.problem}
                                                        </td>
                                                        <td><span className={`status-chip ${chipClass}`}>{comp.status}</span></td>
                                                        <td style={{ fontWeight: 400, color: '#858796' }}>
                                                            {comp.assignedWorker?.name ? `${comp.assignedWorker.name} (${comp.assignedWorker.category})` : 'Unassigned'}
                                                        </td>
                                                        <td>
                                                            <Link to="/rector/complaints">
                                                                <button className="btn-track">Review</button>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
