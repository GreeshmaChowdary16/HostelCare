import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/Header';

const Dashboard = () => {
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
                    grid-template-columns: 1fr 1fr;
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
                }

                .alert-banner {
                    padding: 15px;
                    border-radius: 6px;
                    color: white;
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
                    padding: 5px 15px;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: 700;
                }
                .chip-pending { background: #fbecec; color: #e74a3b; }
                .chip-progress { background: #fffbe6; color: #f6c23e; }

                .btn-track {
                    background: #e8f0fe;
                    color: #4e73df;
                    border: none;
                    padding: 6px 15px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }

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
                        <h3 className="profile-name" style={{ marginBottom: '30px' }}>Mrs. Priya Kumar</h3>

                        <div className="profile-details-grid">
                            <span className="detail-label">Enroll Number</span>
                            <span className="detail-value">88921</span>

                            <span className="detail-label">Mobile</span>
                            <span className="detail-value">+91 98765 43210</span>

                            <span className="detail-label">Email</span>
                            <span className="detail-value" style={{ fontSize: '13px' }}>rector@hostel.edu</span>

                            <span className="detail-label">Room No</span>
                            <span className="detail-value">101</span>

                            <span className="detail-label">Shift</span>
                            <span className="detail-value green-text">Day/Night</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">

                    <div>
                        <h2 className="overview-title">Overview</h2>
                        <div className="stats-grid-2x2">
                            <div className="stat-card-modern" style={{ background: '#4e73df' }}>
                                <div>
                                    <div className="stat-label">TOTAL GIRLS</div>
                                    <div className="stat-value">235</div>
                                </div>
                                <div className="stat-desc">Registered</div>
                            </div>
                            <div className="stat-card-modern" style={{ background: '#1cc88a' }}>
                                <div>
                                    <div className="stat-label">PRESENT</div>
                                    <div className="stat-value">211</div>
                                </div>
                                <div className="stat-desc">In Hostel Today</div>
                            </div>
                            <div className="stat-card-modern" style={{ background: '#f6c23e' }}>
                                <div>
                                    <div className="stat-label">ON LEAVE</div>
                                    <div className="stat-value">24</div>
                                </div>
                                <div className="stat-desc">With Parents / Home</div>
                            </div>
                            <div className="stat-card-modern" style={{ background: '#e74a3b' }}>
                                <div>
                                    <div className="stat-label">COMPLAINTS</div>
                                    <div className="stat-value">18</div>
                                </div>
                                <div className="stat-desc">Active Issues</div>
                            </div>
                            <Link to="/rector/reports" className="stat-card-modern" style={{ background: '#6f42c1', textDecoration: 'none' }}>
                                <div>
                                    <div className="stat-label">OPERATIONAL REPORTS</div>
                                    <div className="stat-value"><i className="fas fa-file-invoice"></i></div>
                                </div>
                                <div className="stat-desc">Submit Attendance & Mess Logs</div>
                            </Link>
                        </div>
                    </div>

                    <div className="alert-row">
                        {/* Latest Notification */}
                        <div className="alert-card">
                            <div className="alert-header">
                                <i className="fas fa-bell"></i> Latest Notification
                            </div>
                            <div className="alert-body">
                                <div className="alert-banner banner-blue">
                                    <div style={{ fontWeight: 700, marginBottom: '5px' }}>Curfew Timing Update</div>
                                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Main gate closes at 8:00 PM strictly for safety.</div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency */}
                        <div className="alert-card">
                            <div className="alert-header" style={{ color: '#e74a3b' }}>
                                <i className="fas fa-exclamation-triangle"></i> Emergency
                            </div>
                            <div className="alert-body">
                                <div className="alert-banner banner-red">
                                    <div style={{ fontWeight: 700, marginBottom: '5px' }}>Medical Emergency - Room 102</div>
                                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Student reported high fever. Ambulance called.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Complaint Table */}
                    <div className="table-card">
                        <div className="table-header-row">
                            <div className="table-title">Complaint Status &amp; Assignment</div>
                            <button className="btn-sm" style={{ background: '#eaecf4', color: '#6e707e', border: 'none' }}>View All</button>
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
                                <tr>
                                    <td>201</td>
                                    <td><i className="fas fa-bolt" style={{ color: '#f6c23e', marginRight: '8px' }}></i> Fan Repair</td>
                                    <td><span className="status-chip chip-pending">Pending</span></td>
                                    <td style={{ fontWeight: 400, color: '#858796' }}>Ramesh (Elec)</td>
                                    <td><button className="btn-track">Track</button></td>
                                </tr>
                                <tr>
                                    <td>115</td>
                                    <td><i className="fas fa-faucet" style={{ color: '#36b9cc', marginRight: '8px' }}></i> Leakage</td>
                                    <td><span className="status-chip chip-progress">In Progress</span></td>
                                    <td style={{ fontWeight: 400, color: '#858796' }}>Suresh (Plumb)</td>
                                    <td><button className="btn-track">Track</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
