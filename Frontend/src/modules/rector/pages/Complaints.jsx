import React, { useState } from 'react';
import Header from '../../../components/Header';

const Complaints = () => {
    return (
        <>
            <Header title="Complaints Management" />
            <style>{`
                .container {
                    padding: 30px;
                    max-width: 1600px;
                    margin: 0 auto;
                }

                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 25px;
                    margin-bottom: 30px;
                }

                .stat-box {
                    padding: 25px;
                    border-radius: 8px;
                    color: white;
                    min-height: 140px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .bg-blue { background: #4e73df; }
                .bg-green { background: #1cc88a; }
                .bg-yellow { background: #f6c23e; }
                .bg-red { background: #e74a3b; }

                .stat-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    opacity: 0.9;
                }

                .stat-count {
                    font-size: 42px;
                    font-weight: 700;
                    margin: 5px 0;
                }

                .stat-footer {
                    font-size: 13px;
                    opacity: 0.8;
                }

                /* Layout */
                .section-card {
                    background: #fff;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
                    padding: 25px;
                    margin-bottom: 30px;
                    border-left: 5px solid transparent;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .card-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #5a5c69;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                /* Emergency Section */
                .emergency-card {
                    border-left-color: #e74a3b;
                }

                .table-responsive {
                    width: 100%;
                    overflow-x: auto;
                }

                .custom-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .custom-table th {
                    text-align: left;
                    padding: 12px 15px;
                    background: #f8f9fc;
                    color: #858796;
                    font-weight: 600;
                    font-size: 13px;
                    border-bottom: 1px solid #e3e6f0;
                }

                .custom-table td {
                    padding: 15px;
                    color: #5a5c69;
                    font-size: 14px;
                    border-bottom: 1px solid #f8f9fc;
                    vertical-align: middle;
                }
                
                .btn-resolve {
                    background: #e8f0fe;
                    color: #4e73df;
                    border: none;
                    padding: 6px 15px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }

                /* Mess Menu Insights */
                .mess-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    margin-top: 10px;
                }

                .mess-column-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #eaecf4;
                    padding-bottom: 10px;
                    display: inline-block;
                }

                .request-box {
                    background: #f8f9fc;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #4e73df;
                    margin-bottom: 15px;
                }

                .feedback-item {
                    padding: 15px 20px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .feedback-good { background: #e0fcf4; color: #0f6848; border-left: 4px solid #1cc88a; }
                .feedback-bad { background: #fadbd8; color: #721c24; border-left: 4px solid #e74a3b; }

                .action-btn-sm {
                    padding: 5px 12px;
                    background: #eaecf4;
                    border: none;
                    border-radius: 4px;
                    color: #6e707e;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }

                /* Status Tracking */
                .status-chip {
                    padding: 5px 12px;
                    border-radius: 15px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .status-pending { background: #fadbd8; color: #e74a3b; }
                .status-progress { background: #fff3cd; color: #856404; }
                .status-resolved { background: #d4edda; color: #155724; }

                .room-badge {
                    font-weight: 700;
                    color: #5a5c69;
                }

                @media (max-width: 992px) {
                    .stats-grid { grid-template-columns: 1fr 1fr; }
                    .mess-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="container">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-box bg-blue">
                        <div className="stat-header">
                            <i className="fas fa-bolt"></i> ELECTRIC
                        </div>
                        <div className="stat-count">12</div>
                        <div className="stat-footer">Pending Issues</div>
                    </div>
                    <div className="stat-box bg-green">
                        <div className="stat-header">
                            <i className="fas fa-faucet"></i> PLUMBER
                        </div>
                        <div className="stat-count">08</div>
                        <div className="stat-footer">Pending Issues</div>
                    </div>
                    <div className="stat-box bg-yellow">
                        <div className="stat-header">
                            <i className="fas fa-hammer"></i> CARPENTER
                        </div>
                        <div className="stat-count">05</div>
                        <div className="stat-footer">Pending Issues</div>
                    </div>
                    <div className="stat-box bg-red">
                        <div className="stat-header">
                            <i className="fas fa-broom"></i> CLEANING
                        </div>
                        <div className="stat-count">15</div>
                        <div className="stat-footer">Pending Issues</div>
                    </div>
                </div>

                {/* Emergency Complaints */}
                <div className="section-card emergency-card">
                    <div className="card-header">
                        <div className="card-title" style={{ color: '#e74a3b' }}>
                            <i className="fas fa-exclamation-triangle"></i> Emergency Complaints
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>ID</th>
                                    <th style={{ width: '100px' }}>Room</th>
                                    <th>Issue</th>
                                    <th>Reported Time</th>
                                    <th style={{ width: '150px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ color: '#858796' }}>#901</td>
                                    <td className="room-badge">302</td>
                                    <td>Short Circuit / Sparks</td>
                                    <td>10 mins ago</td>
                                    <td><button className="btn-resolve">Resolve Now</button></td>
                                </tr>
                                <tr>
                                    <td style={{ color: '#858796' }}>#892</td>
                                    <td className="room-badge">105</td>
                                    <td>Major Water Leak</td>
                                    <td>30 mins ago</td>
                                    <td><button className="btn-resolve">Resolve Now</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mess Menu Insights */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="card-title"><i className="fas fa-utensils"></i> Mess Menu Insights</div>
                        <button className="action-btn-sm">View Full Menu</button>
                    </div>

                    <div className="mess-grid">
                        {/* Menu Requests */}
                        <div>
                            <div className="mess-column-title">Menu Change Requests</div>
                            <div className="request-box">
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#858796', textTransform: 'uppercase', marginBottom: '5px' }}>Top Request</div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '15px' }}>
                                    <h3 style={{ margin: 0, color: '#e74a3b', fontSize: '22px' }}>Baingan Bharta</h3>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#5a5c69' }}>42</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#858796' }}>
                                    <span>Current Dish</span>
                                    <span>Students Want Change</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                                <span style={{ color: '#1cc88a', fontWeight: 700 }}>Proposed: Aloo Gobhi</span>
                            </div>
                        </div>

                        {/* Today's Feedback */}
                        <div>
                            <div className="mess-column-title">Today's Feedback (Tuesday)</div>

                            <div className="feedback-item feedback-good">
                                <div>
                                    <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>Most Liked Dish</div>
                                    <div style={{ fontWeight: 700, fontSize: '16px' }}>Paneer Tikka (Dinner)</div>
                                </div>
                                <div style={{ fontSize: '20px' }}><i className="fas fa-smile"></i></div>
                            </div>

                            <div className="feedback-item feedback-bad">
                                <div>
                                    <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>Did Not Like</div>
                                    <div style={{ fontWeight: 700, fontSize: '16px' }}>Upma (Breakfast)</div>
                                </div>
                                <div style={{ fontSize: '20px' }}><i className="fas fa-frown"></i></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complaint Tracking */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="card-title">Complaint Status &amp; Tracking</div>
                        <button className="action-btn-sm">Filter by Room</button>
                    </div>
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>Room</th>
                                    <th>Student</th>
                                    <th>Category</th>
                                    <th>Complaint Info</th>
                                    <th>Assigned Worker</th>
                                    <th>Status / Tracking</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="room-badge">201</td>
                                    <td>John Doe</td>
                                    <td style={{ color: '#4e73df', fontWeight: 600 }}><i className="fas fa-bolt"></i> Electric</td>
                                    <td>Fan not working properly</td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: '#4e73df', fontSize: '13px' }}>Ramesh Sharma</div>
                                        <div style={{ fontSize: '11px', color: '#858796' }}><i className="fas fa-phone-alt"></i> +91 98765 43212</div>
                                    </td>
                                    <td><span className="status-chip status-pending">Pending</span></td>
                                    <td><button className="btn-resolve">Track</button></td>
                                </tr>
                                <tr>
                                    <td className="room-badge">115</td>
                                    <td>Rahul</td>
                                    <td style={{ color: '#1cc88a', fontWeight: 600 }}><i className="fas fa-faucet"></i> Plumber</td>
                                    <td>Tap leakage in bathroom</td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: '#1cc88a', fontSize: '13px' }}>Suresh Verma</div>
                                        <div style={{ fontSize: '11px', color: '#858796' }}><i className="fas fa-phone-alt"></i> +91 98765 43214</div>
                                    </td>
                                    <td><span className="status-chip status-progress">In Progress</span></td>
                                    <td><button className="btn-resolve">Track</button></td>
                                </tr>
                                <tr>
                                    <td className="room-badge">305</td>
                                    <td>Rajesh</td>
                                    <td style={{ color: '#e74a3b', fontWeight: 600 }}><i className="fas fa-broom"></i> Cleaning</td>
                                    <td>Room not cleaned for 3 days</td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: '#e74a3b', fontSize: '13px' }}>Sunita Devi</div>
                                        <div style={{ fontSize: '11px', color: '#858796' }}><i className="fas fa-phone-alt"></i> +91 98765 43216</div>
                                        <div style={{ fontSize: '10px', color: '#1cc88a', fontWeight: 700 }}>Supervisor (Girls Hostel A)</div>
                                    </td>
                                    <td><span className="status-chip status-resolved">Resolved</span></td>
                                    <td><button className="btn-resolve">View</button></td>
                                </tr>
                                <tr>
                                    <td className="room-badge">402</td>
                                    <td>Amit Kumar</td>
                                    <td style={{ color: '#1cc88a', fontWeight: 600 }}><i className="fas fa-broom"></i> Cleaning (Washroom)</td>
                                    <td><i className="fas fa-image" style={{ color: '#4e73df' }}></i> Proof: Washroom tile leakage</td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: '#1cc88a', fontSize: '13px' }}>Sunita Devi</div>
                                        <div style={{ fontSize: '11px', color: '#858796' }}><i className="fas fa-phone-alt"></i> +91 98765 43216</div>
                                        <div style={{ fontSize: '10px', color: '#1cc88a', fontWeight: 700 }}>Supervisor (Girls Hostel A)</div>
                                    </td>
                                    <td><span className="status-chip status-pending">Pending</span></td>
                                    <td><button className="btn-resolve">Resolve</button></td>
                                </tr>
                                <tr>
                                    <td className="room-badge">208</td>
                                    <td>Suresh Roy</td>
                                    <td style={{ color: '#1cc88a', fontWeight: 600 }}><i className="fas fa-broom"></i> Cleaning (Room)</td>
                                    <td><i className="fas fa-video" style={{ color: '#e74a3b' }}></i> Proof: Dust accumulation</td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: '#1cc88a', fontSize: '13px' }}>Sunita Devi</div>
                                        <div style={{ fontSize: '11px', color: '#858796' }}><i className="fas fa-phone-alt"></i> +91 98765 43216</div>
                                        <div style={{ fontSize: '10px', color: '#1cc88a', fontWeight: 700 }}>Supervisor (Girls Hostel A)</div>
                                    </td>
                                    <td><span className="status-chip status-progress">In Progress</span></td>
                                    <td><button className="btn-resolve">Track</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Complaints;
