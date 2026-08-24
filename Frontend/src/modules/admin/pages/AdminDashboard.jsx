import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const AdminDashboard = () => {
    // Data States
    const [complaints, setComplaints] = useState([]);
    const [studentStats, setStudentStats] = useState(null);
    const [rectors, setRectors] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [feeStats, setFeeStats] = useState(null);
    
    // Status States
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard components from backend in parallel
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
            // Fetch complaints
            try {
                const res = await fetch(`${API_BASE_URL}/complaints`, { headers });
                if (res.ok) setComplaints(await res.json());
            } catch (err) {
                console.error('Complaints fetch error:', err);
            }

            // Fetch student stats
            try {
                const res = await fetch(`${API_BASE_URL}/students/stats`, { headers });
                if (res.ok) setStudentStats(await res.json());
            } catch (err) {
                console.error('Student stats fetch error:', err);
            }

            // Fetch rectors list
            try {
                const res = await fetch(`${API_BASE_URL}/rectors`, { headers });
                if (res.ok) setRectors(await res.json());
            } catch (err) {
                console.error('Rectors fetch error:', err);
            }

            // Fetch workers list
            try {
                const res = await fetch(`${API_BASE_URL}/workers`, { headers });
                if (res.ok) setWorkers(await res.json());
            } catch (err) {
                console.error('Workers fetch error:', err);
            }

            // Fetch fee stats
            try {
                const res = await fetch(`${API_BASE_URL}/fees/stats`, { headers });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) setFeeStats(data.stats);
                }
            } catch (err) {
                console.error('Fee stats fetch error:', err);
            }
        } catch (err) {
            console.error('Dashboard data fetching error:', err);
            setError('Failed to refresh dashboard. Please retry.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Helper: calculate rectors currently on approved leaves matching today's date
    const getRectorsOnLeaveCount = () => {
        const today = new Date();
        return rectors.filter(r => 
            r.leaveApplications?.some(leave => 
                leave.status === 'Approved' && 
                new Date(leave.fromDate) <= today && 
                new Date(leave.toDate) >= today
            )
        ).length;
    };

    const getCountForCategory = (cat) => {
        let backendCat = cat;
        if (cat === 'Electrical') backendCat = 'Electrician';
        if (cat === 'Plumbing') backendCat = 'Plumber';
        if (cat === 'Carpentry') backendCat = 'Carpenter';
        if (cat === 'Mess') return complaints.filter(c => c.category === 'Mess').length;
        if (cat === 'Internet') return complaints.filter(c => c.category === 'IT Support').length;
        return complaints.filter(c => c.category === backendCat).length;
    };

    const commonComplaints = [
        { category: 'Electrical', issue: 'Fan/Light not working', count: getCountForCategory('Electrical'), priority: 'High' },
        { category: 'Plumbing', issue: 'Leaking Taps/Showers', count: getCountForCategory('Plumbing'), priority: 'Medium' },
        { category: 'Cleaning', issue: 'Washroom Hygiene', count: getCountForCategory('Cleaning'), priority: 'High' },
        { category: 'Mess', issue: 'Food Quality/Timings', count: getCountForCategory('Mess'), priority: 'Medium' },
        { category: 'Carpentry', issue: 'Broken Furniture/Locks', count: getCountForCategory('Carpentry'), priority: 'Low' },
        { category: 'Internet', issue: 'Wi-Fi Connectivity', count: getCountForCategory('Internet'), priority: 'Low' }
    ];

    // Compute stats
    const totalStudents = studentStats?.total ?? 'N/A';
    const totalRectors = rectors.length || 0;
    const totalWorkers = workers.length || 0;
    const rectorsOnLeave = getRectorsOnLeaveCount();
    const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
    const totalCollected = feeStats ? `₹${feeStats.totalCollected?.toLocaleString('en-IN')}` : 'N/A';
    const totalPendingFees = feeStats ? `₹${feeStats.totalPending?.toLocaleString('en-IN')}` : 'N/A';

    return (
        <>
            <Header title="Admin Dashboard" />
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
                    border-top: 4px solid #1cc88a;
                }

                .profile-img-container {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: #e3fdf4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    color: #1cc88a;
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

                .overview-title {
                    font-size: 20px;
                    color: #5a5c69;
                    margin-bottom: 20px;
                    font-weight: 600;
                }

                .stats-grid-3x2 {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

                /* Complaints Table */
                .complaints-table-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                }
                .complaints-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }
                .complaints-table th, .complaints-table td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid #f8f9fc;
                }
                .complaints-table th {
                    color: #b7b9cc;
                    font-size: 12px;
                    text-transform: uppercase;
                    font-weight: 700;
                }
                .category-badge {
                    padding: 4px 10px;
                    border-radius: 15px;
                    font-size: 11px;
                    font-weight: 700;
                }
                .priority-high { color: #e74a3b; background: #fbecec; }
                .priority-medium { color: #f6c23e; background: #fff9e6; }
                .priority-low { color: #1cc88a; background: #e3fdf4; }

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
                    .stats-grid-3x2 { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="dashboard-container">
                {/* Left Sidebar */}
                <div className="left-sidebar">
                    <div className="profile-card">
                        <div className="profile-img-container">
                            <i className="fas fa-user-shield"></i>
                        </div>
                        <h3 className="profile-name">Mr. System Admin</h3>
                        <div className="profile-role">Chief Administrator</div>

                        <div className="profile-details-grid">
                            <span className="detail-label">Admin ID</span>
                            <span className="detail-value">ADM-001</span>
                            <span className="detail-label">Mobile</span>
                            <span className="detail-value">+91 99887 76655</span>
                            <span className="detail-label">Email</span>
                            <span className="detail-value" style={{ fontSize: '13px' }}>admin@hostel.edu</span>
                            <span className="detail-label">Office</span>
                            <span className="detail-value">Main Block</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {error && (
                        <div className="status-message status-error">
                            <span>{error}</span>
                            <button className="category-badge priority-high" style={{ border: 'none', cursor: 'pointer' }} onClick={fetchDashboardData}>
                                Retry Refresh
                            </button>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="complaints-table-card" style={{ textAlign: 'center', padding: '40px' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '10px', color: '#4e73df' }}></i>
                            <p style={{ margin: 0, color: '#858796' }}>Loading overview data...</p>
                        </div>
                    ) : (
                        <div>
                            <h2 className="overview-title">Overview</h2>
                            <div className="stats-grid-3x2">
                                <Link to="/admin/rectors" className="stat-card-modern" style={{ background: '#4e73df', textDecoration: 'none' }}>
                                    <div><div className="stat-label">TOTAL RECTORS</div><div className="stat-value">{totalRectors}</div></div>
                                    <div className="stat-desc">Manage Rector Profiles <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i></div>
                                </Link>

                                <div className="stat-card-modern" style={{ background: '#f6c23e' }}>
                                    <div><div className="stat-label">RECTORS ON LEAVE</div><div className="stat-value">{rectorsOnLeave}</div></div>
                                    <div className="stat-desc">Approved Leave Applications</div>
                                </div>

                                <div className="stat-card-modern" style={{ background: '#36b9cc' }}>
                                    <div><div className="stat-label">REGISTERED STUDENTS</div><div className="stat-value">{totalStudents}</div></div>
                                    <div className="stat-desc">Active Student Enrollments</div>
                                </div>

                                <Link to="/admin/workers" className="stat-card-modern" style={{ background: '#858796', textDecoration: 'none' }}>
                                    <div><div className="stat-label">MAINTENANCE WORKERS</div><div className="stat-value">{totalWorkers}</div></div>
                                    <div className="stat-desc">Manage Staff Directory <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i></div>
                                </Link>

                                <div className="stat-card-modern" style={{ background: '#e74a3b' }}>
                                    <div><div className="stat-label">PENDING COMPLAINTS</div><div className="stat-value">{pendingComplaints}</div></div>
                                    <div className="stat-desc">Awaiting Rector/Staff Allotment</div>
                                </div>

                                <Link to="/admin/fees" className="stat-card-modern" style={{ background: '#1cc88a', textDecoration: 'none' }}>
                                    <div><div className="stat-label">FEES COLLECTED</div><div className="stat-value">{totalCollected}</div></div>
                                    <div className="stat-desc">Total Collections <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i></div>
                                </Link>

                                <Link to="/admin/fees" className="stat-card-modern" style={{ background: '#e74a3b', textDecoration: 'none' }}>
                                    <div><div className="stat-label">OUTSTANDING FEES</div><div className="stat-value">{totalPendingFees}</div></div>
                                    <div className="stat-desc">Unpaid Invoices Summary <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i></div>
                                </Link>

                                <Link to="/admin/reports" className="stat-card-modern" style={{ background: '#6f42c1', textDecoration: 'none' }}>
                                    <div>
                                        <div className="stat-label">REPORTS & ANALYTICS</div>
                                        <div className="stat-value"><i className="fas fa-file-contract"></i></div>
                                    </div>
                                    <div className="stat-desc">View Attendance & Logs <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i></div>
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="complaints-table-card">
                        <h3 className="overview-title" style={{ marginBottom: '10px' }}>Most Common Complaints</h3>
                        <table className="complaints-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Common Issue</th>
                                    <th>Total Recorded</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commonComplaints.map((item, index) => (
                                    <tr key={index}>
                                        <td><strong>{item.category}</strong></td>
                                        <td style={{ color: '#858796' }}>{item.issue}</td>
                                        <td>{item.count}</td>
                                        <td>
                                            <span className={`category-badge priority-${item.priority.toLowerCase()}`}>
                                                {item.priority}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
