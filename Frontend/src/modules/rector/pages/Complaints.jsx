import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';
import socket from '../../../socket';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [workersLoading, setWorkersLoading] = useState(false);
    const [workersError, setWorkersError] = useState(null);
    const [roomFilter, setRoomFilter] = useState('');
    const [showRoomFilter, setShowRoomFilter] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);


    const fetchWorkers = async () => {
        setWorkersLoading(true);
        setWorkersError(null);
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/workers`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to load workers list');
            }
            const data = await response.json();
            setWorkers(data || []);
        } catch (err) {
            console.error('Error fetching workers:', err);
            setWorkersError('Failed to fetch workers directory.');
        } finally {
            setWorkersLoading(false);
        }
    };

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
        fetchWorkers();

        const onCreated = (complaint) => {
            setComplaints(prev => [complaint, ...prev]);
        };

        const onUpdated = (complaint) => {
            setComplaints(prev => prev.map(c => c._id === complaint._id ? complaint : c));
        };

        const onDeleted = ({ id }) => {
            setComplaints(prev => prev.filter(c => c._id !== id));
        };

        socket.on('complaint_created', onCreated);
        socket.on('complaint_updated', onUpdated);
        socket.on('complaint_deleted', onDeleted);

        return () => {
            socket.off('complaint_created', onCreated);
            socket.off('complaint_updated', onUpdated);
            socket.off('complaint_deleted', onDeleted);
        };
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

    const handleWorkerAssignment = async (complaintId, workerId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        if (!workerId) {
            // Unassign worker
            try {
                const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        assignedWorker: {
                            name: '',
                            phone: '',
                            category: '',
                            availability: ''
                        }
                    })
                });
                if (response.ok) {
                    alert('Worker unassigned successfully.');
                    fetchComplaints();
                } else {
                    const data = await response.json();
                    alert(`Failed to unassign worker: ${data.message}`);
                }
            } catch (err) {
                console.error('Error unassigning worker:', err);
                alert('Network error. Unable to unassign worker.');
            }
            return;
        }

        const selectedWorker = workers.find(w => w._id === workerId);
        if (!selectedWorker) return;

        try {
            // 1. Assign via worker assign API (updates Worker collection)
            const assignRes = await fetch(`${API_BASE_URL}/workers/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    workerId: selectedWorker._id,
                    complaintId
                })
            });

            if (!assignRes.ok) {
                const assignData = await assignRes.json();
                alert(`Assignment failed: ${assignData.message}`);
                return;
            }

            // 2. Update complaint details (updates Complaint collection)
            const complaintUpdateRes = await fetch(`${API_BASE_URL}/complaints/${complaintId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    assignedWorker: {
                        name: selectedWorker.name,
                        phone: selectedWorker.phone || '',
                        category: selectedWorker.category,
                        availability: 'Busy'
                    }
                })
            });

            if (complaintUpdateRes.ok) {
                alert('Worker assigned successfully!');
                fetchComplaints();
                fetchWorkers(); // refresh availability status of workers
            } else {
                const updateData = await complaintUpdateRes.json();
                alert(`Failed to update complaint assignment: ${updateData.message}`);
            }
        } catch (err) {
            console.error('Error assigning worker:', err);
            alert('Network error. Could not assign worker.');
        }
    };

    const electricPending = complaints.filter(c => c.category === 'Electrician' && c.status !== 'Resolved' && c.status !== 'Rejected').length;
    const visibleComplaints = complaints.filter((complaint) => {
        if (!roomFilter.trim()) return true;
        const room = complaint.student?.roomInfo || complaint.student?.roomNo || '';
        return room.toLowerCase().includes(roomFilter.trim().toLowerCase());
    });
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
                        <button className="action-btn-sm" onClick={() => window.location.href = '/rector/mess-menu'}>View Full Menu</button>
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
                        <button className="action-btn-sm" onClick={() => setShowRoomFilter(!showRoomFilter)}>{showRoomFilter ? 'Hide Room Filter' : 'Filter by Room'}</button>
                    </div>
                    {showRoomFilter && (
                        <input
                            className="room-filter-input"
                            value={roomFilter}
                            onChange={(event) => setRoomFilter(event.target.value)}
                            placeholder="Enter room number"
                            aria-label="Filter complaints by room"
                        />
                    )}
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
                                {visibleComplaints.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '15px', color: '#858796' }}>No complaints submitted.</td>
                                    </tr>
                                ) : (
                                    visibleComplaints.map(comp => {

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
                                                         {workersError && (
                                                             <div style={{ color: '#e74a3b', fontSize: '9px' }}>
                                                                 Err loading workers. <button onClick={fetchWorkers} style={{ border: 'none', background: 'none', color: '#4e73df', textDecoration: 'underline', padding: 0, fontSize: '9px', cursor: 'pointer' }}>Retry</button>
                                                             </div>
                                                         )}
                                                         <select
                                                             value={workers.find(w => w.name === comp.assignedWorker?.name)?._id || ''}
                                                             onChange={(e) => handleWorkerAssignment(comp._id, e.target.value)}
                                                             style={{ width: '155px', padding: '5px', fontSize: '11px', border: '1px solid #d1d3e2', borderRadius: '4px', background: '#fff' }}
                                                             disabled={workersLoading}
                                                         >
                                                             <option value="">-- Unassigned --</option>
                                                             {workers.map(w => (
                                                                 <option key={w._id} value={w._id}>
                                                                     {w.name} ({w.category}) — {w.availability}
                                                                 </option>
                                                             ))}
                                                         </select>
                                                         {comp.assignedWorker?.name && (
                                                             <div style={{ fontSize: '10px', color: '#858796' }}>
                                                                 Category: {comp.assignedWorker.category || 'N/A'}
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
                                                    <button
                                                        onClick={() => comp.assignedWorker?.name && setSelectedWorker({ ...comp.assignedWorker, complaint: comp.problem })}
                                                        className="btn-resolve"
                                                        disabled={!comp.assignedWorker?.name}
                                                    >
                                                        <i className="fas fa-phone" style={{ marginRight: '5px' }}></i> Contact
                                                    </button>
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
            {selectedWorker && (
                <div
                    onClick={() => setSelectedWorker(null)}
                    style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(26, 35, 54, 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="worker-contact-title"
                        onClick={(event) => event.stopPropagation()}
                        style={{ width: 'min(420px, 100%)', background: '#fff', borderRadius: '10px', padding: '25px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                            <div>
                                <h2 id="worker-contact-title" style={{ margin: 0, color: '#343a40', fontSize: '20px' }}>Assigned Worker</h2>
                                <p style={{ margin: '6px 0 20px', color: '#858796', fontSize: '13px' }}>{selectedWorker.complaint}</p>
                            </div>
                            <button type="button" onClick={() => setSelectedWorker(null)} aria-label="Close worker contact" style={{ border: 0, background: '#f8f9fc', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div style={{ background: '#f8f9fc', borderRadius: '8px', padding: '16px', marginBottom: '18px' }}>
                            <div style={{ fontWeight: 700, fontSize: '17px', color: '#343a40' }}>{selectedWorker.name}</div>
                            <div style={{ color: '#4e73df', fontWeight: 600, marginTop: '5px' }}>{selectedWorker.category || 'Assigned Staff'}</div>
                            <div style={{ color: '#858796', fontSize: '13px', marginTop: '5px' }}>{selectedWorker.availability || 'Availability not provided'}</div>
                            <div style={{ marginTop: '14px', color: '#5a5c69' }}>
                                <i className="fas fa-phone" style={{ marginRight: '8px' }}></i>
                                {selectedWorker.phone || 'Phone number not provided'}
                            </div>
                        </div>
                        {selectedWorker.phone ? (
                            <a href={`tel:${selectedWorker.phone}`} className="btn-resolve" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                                <i className="fas fa-phone" style={{ marginRight: '7px' }}></i> Call Worker
                            </a>
                        ) : (
                            <div style={{ color: '#e74a3b', fontSize: '13px', textAlign: 'center' }}>Add a phone number to this worker before calling.</div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Complaints;
