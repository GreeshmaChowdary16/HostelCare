import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);

    const fetchComplaints = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/complaints`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setComplaints(data);
            }
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                alert('Status updated successfully!');
                fetchComplaints();
            } else {
                const data = await response.json();
                alert(`Failed to update status: ${data.message}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleWorkerUpdate = async (id, workerName) => {
        if (!workerName.trim()) return;
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    assignedWorker: {
                        name: workerName,
                        phone: '+91 98765 43210',
                        role: 'Assigned Staff'
                    }
                })
            });
            if (response.ok) {
                fetchComplaints();
            }
        } catch (error) {
            console.error('Error assigning worker:', error);
        }
    };

    const electricPending = complaints.filter(c => c.category === 'Electrician' && c.status !== 'Resolved' && c.status !== 'Rejected').length;
    const plumberPending = complaints.filter(c => c.category === 'Plumber' && c.status !== 'Resolved' && c.status !== 'Rejected').length;
    const carpenterPending = complaints.filter(c => c.category === 'Carpenter' && c.status !== 'Resolved' && c.status !== 'Rejected').length;
    const cleaningPending = complaints.filter(c => c.category === 'Cleaning' && c.status !== 'Resolved' && c.status !== 'Rejected').length;

    const emergencyComplaints = complaints.filter(c => 
        c.status === 'Pending' && 
        (c.category === 'Electrician' || c.category === 'Plumber' || c.problem.toLowerCase().includes('leak') || c.problem.toLowerCase().includes('short') || c.problem.toLowerCase().includes('spark'))
    ).slice(0, 2);
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
                        <div className="stat-count">{electricPending}</div>
                        <div className="stat-footer">Pending Issues</div>
                    </div>
                    <div className="stat-box bg-green">
                        <div className="stat-header">
                            <i className="fas fa-faucet"></i> PLUMBER
                        </div>
                        <div className="stat-count">{plumberPending}</div>
                        <div className="stat-footer">Pending Issues</div>
                    </div>
                    <div className="stat-box bg-yellow">
                        <div className="stat-header">
                            <i className="fas fa-hammer"></i> CARPENTER
                        </div>
                        <div className="stat-count">{carpenterPending}</div>
                        <div className="stat-footer">Pending Issues</div>
                    </div>
                    <div className="stat-box bg-red">
                        <div className="stat-header">
                            <i className="fas fa-broom"></i> CLEANING
                        </div>
                        <div className="stat-count">{cleaningPending}</div>
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
                                {emergencyComplaints.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: '#858796', padding: '15px' }}>No active emergency complaints.</td>
                                    </tr>
                                ) : (
                                    emergencyComplaints.map(comp => (
                                        <tr key={comp._id}>
                                            <td style={{ color: '#858796' }}>#{comp._id.slice(-4).toUpperCase()}</td>
                                            <td className="room-badge">{comp.student?.roomInfo || comp.student?.roomNo || 'Unassigned'}</td>
                                            <td>{comp.problem}</td>
                                            <td>{new Date(comp.createdAt).toLocaleDateString(undefined, {day: 'numeric', month: 'short'})}</td>
                                            <td>
                                                <button onClick={() => handleStatusUpdate(comp._id, 'Resolved')} className="btn-resolve">Resolve Now</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
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
                                {complaints.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '15px', color: '#858796' }}>No complaints submitted.</td>
                                    </tr>
                                ) : (
                                    complaints.map(comp => {
                                        let icon = 'fa-tools';
                                        let color = '#4e73df';
                                        if (comp.category === 'Electrician') { icon = 'fa-bolt'; color = '#f6c23e'; }
                                        else if (comp.category === 'Plumber') { icon = 'fa-faucet'; color = '#36b9cc'; }
                                        else if (comp.category === 'Carpenter') { icon = 'fa-hammer'; color = '#e74a3b'; }
                                        else if (comp.category === 'Cleaning') { icon = 'fa-broom'; color = '#1cc88a'; }

                                        return (
                                            <tr key={comp._id}>
                                                <td className="room-badge">{comp.student?.roomInfo || comp.student?.roomNo || 'Unassigned'}</td>
                                                <td>{comp.student?.name || 'Student'}</td>
                                                <td style={{ color: color, fontWeight: 600 }}>
                                                    <i className={`fas ${icon}`}></i> {comp.category}
                                                </td>
                                                <td>{comp.problem}</td>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                        <input 
                                                            type="text" 
                                                            placeholder="Assign worker..." 
                                                            defaultValue={comp.assignedWorker?.name || ''} 
                                                            onBlur={(e) => handleWorkerUpdate(comp._id, e.target.value)}
                                                            style={{ width: '120px', padding: '4px', fontSize: '11px', border: '1px solid #d1d3e2', borderRadius: '4px' }}
                                                        />
                                                        {comp.assignedWorker?.name && (
                                                            <div style={{ fontSize: '10px', color: '#858796' }}>
                                                                Assigned
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <select 
                                                        value={comp.status} 
                                                        onChange={(e) => handleStatusUpdate(comp._id, e.target.value)}
                                                        style={{ padding: '5px', fontSize: '12px', border: '1px solid #d1d3e2', borderRadius: '4px' }}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Resolved">Resolved</option>
                                                        <option value="Rejected">Rejected</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button onClick={() => alert(`Worker contact: ${comp.assignedWorker?.phone || 'Not assigned'}`)} className="btn-resolve">Contact</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Complaints;
