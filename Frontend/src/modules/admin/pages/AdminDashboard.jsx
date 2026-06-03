import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/Header';

const AdminDashboard = () => {
    const commonComplaints = [
        { category: 'Electrical', issue: 'Fan/Light not working', count: 45, priority: 'High' },
        { category: 'Plumbing', issue: 'Leaking Taps/Showers', count: 32, priority: 'Medium' },
        { category: 'Cleaning', issue: 'Washroom Hygiene', count: 28, priority: 'High' },
        { category: 'Mess', issue: 'Food Quality/Timings', count: 24, priority: 'Medium' },
        { category: 'Carpentry', issue: 'Broken Furniture/Locks', count: 15, priority: 'Low' },
        { category: 'Internet', issue: 'Wi-Fi Connectivity', count: 12, priority: 'Low' }
    ];

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
                    grid-template-columns: repeat(3, 1fr);
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
                    font-size: 42px;
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

                @media (max-width: 992px) {
                    .dashboard-container { flex-direction: column; }
                    .left-sidebar { width: 100%; }
                    .stats-grid-3x2 { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="dashboard-container">
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

                <div className="main-content">
                    <div>
                        <h2 className="overview-title">Overview</h2>
                        <div className="stats-grid-3x2">
                            <div className="stat-card-modern" style={{ background: '#858796' }}>
                                <div><div className="stat-label">GIRLS HOSTELS</div><div className="stat-value">4</div></div>
                                <div className="stat-desc">Operational</div>
                            </div>
                            <div className="stat-card-modern" style={{ background: '#36b9cc' }}>
                                <div><div className="stat-label">BOYS HOSTELS</div><div className="stat-value">6</div></div>
                                <div className="stat-desc">Operational</div>
                            </div>
                            <div className="stat-card-modern" style={{ background: '#4e73df' }}>
                                <div><div className="stat-label">MALE RECTORS</div><div className="stat-value">12</div></div>
                                <div className="stat-desc">Active in Hostels</div>
                            </div>
                            <div className="stat-card-modern" style={{ background: '#1cc88a' }}>
                                <div><div className="stat-label">FEMALE RECTORS</div><div className="stat-value">8</div></div>
                                <div className="stat-desc">Active in Hostels</div>
                            </div>
                            <div className="stat-card-modern" style={{ background: '#e74a3b' }}>
                                <div><div className="stat-label">MAJOR COMPLAINTS</div><div className="stat-value">5</div></div>
                                <div className="stat-desc">Pending Resolution</div>
                            </div>
                            <div className="stat-card-modern" style={{ background: '#f6c23e' }}>
                                <div><div className="stat-label">RECTORS ON LEAVE</div><div className="stat-value">3</div></div>
                                <div className="stat-desc">Currently Away</div>
                            </div>
                            <Link to="/admin/reports" className="stat-card-modern" style={{ background: '#6f42c1', textDecoration: 'none' }}>
                                <div>
                                    <div className="stat-label">REPORTS & ANALYTICS</div>
                                    <div className="stat-value"><i className="fas fa-file-contract"></i></div>
                                </div>
                                <div className="stat-desc">View Attendance & Hostel Logs</div>
                            </Link>
                        </div>
                    </div>

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
