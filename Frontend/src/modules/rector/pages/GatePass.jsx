import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const GatePass = () => {
    const [rejectionReason, setRejectionReason] = useState({});
    const [showRejectInput, setShowRejectInput] = useState({});
    const [gatePasses, setGatePasses] = useState([]);

    const fetchGatePasses = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/gatepass`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setGatePasses(data);
            }
        } catch (error) {
            console.error('Error fetching gate passes:', error);
        }
    };

    useEffect(() => {
        fetchGatePasses();
    }, []);

    const handleRejectClick = (id) => {
        setShowRejectInput({ ...showRejectInput, [id]: true });
    };

    const handleAction = async (id, status, rejectReason = "") => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/gatepass/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: status,
                    rejectionReason: rejectReason
                })
            });

            if (response.ok) {
                alert(`Gate pass request updated to ${status}!`);
                fetchGatePasses();
            } else {
                const data = await response.json();
                alert(`Failed to update status: ${data.message}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const extensionRequests = gatePasses.filter(gp => gp.isExtension);
    const standardRequests = gatePasses.filter(gp => !gp.isExtension);

    const pendingStandardCount = standardRequests.filter(gp => gp.status === 'Pending').length;
    const pendingExtensionCount = extensionRequests.filter(gp => gp.status === 'Pending').length;
    const approvedTodayCount = gatePasses.filter(gp => gp.status === 'Approved').length;

    return (
        <>
            <Header title="Gate Pass Management" />

            <div className="container">
                {/* Stats Cards */}
                <div className="stats-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="card bg-orange">
                        <div className="card-label"><i className="fas fa-clock"></i> Gate Pass Pending</div>
                        <h3>{pendingStandardCount}</h3>
                        <p>Awaiting Approval</p>
                    </div>
                    <div className="card bg-red">
                        <div className="card-label"><i className="fas fa-history"></i> Extension Pending</div>
                        <h3>{pendingExtensionCount}</h3>
                        <p>Return Delay Requests</p>
                    </div>
                    <div className="card bg-teal">
                        <div className="card-label"><i className="fas fa-check-circle"></i> Approved Today</div>
                        <h3>{approvedTodayCount}</h3>
                        <p>Passes & Extensions</p>
                    </div>
                </div>

                {/* Return Days Extension Requests */}
                <div className="widget" style={{ marginBottom: '30px' }}>
                    <div className="widget-header" style={{ borderBottom: '2px solid #f8f9fc', paddingBottom: '15px' }}>
                        <div className="widget-title" style={{ color: '#e74a3b' }}>
                            <i className="fas fa-exclamation-circle"></i> Return Days Extension Requests
                        </div>
                    </div>
                    <table style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th>Student Info</th>
                                <th>Extension</th>
                                <th>Reason & Proof</th>
                                <th>Parent Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {extensionRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '15px', color: '#858796' }}>No return days extension requests.</td>
                                </tr>
                            ) : (
                                extensionRequests.map(req => (
                                    <tr key={req._id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{req.student?.name || 'Student'}</div>
                                            <div style={{ fontSize: '11px', color: '#858796' }}>Room: {req.student?.roomInfo || req.student?.roomNo || 'Unassigned'}</div>
                                        </td>
                                        <td style={{ fontWeight: 700, color: '#e74a3b' }}>{req.noOfDays} Days</td>
                                        <td>
                                            <div style={{ fontSize: '13px' }}>{req.reason}</div>
                                            {req.proof && (
                                                <a href="#" style={{ fontSize: '12px', color: '#4e73df', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                                                    <i className="fas fa-file-alt"></i> View Proof: {req.proof}
                                                </a>
                                            )}
                                        </td>
                                        <td>{req.parentMobile || req.parentContactNo || '+91 94444 55555'}</td>
                                        <td>
                                            {req.status === 'Pending' ? (
                                                <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                        <button onClick={() => handleAction(req._id, 'Approved')} className="btn-action approve-btn" style={{ flex: 1 }}>Approve</button>
                                                        <button onClick={() => handleRejectClick(req._id)} className="btn-action reject-btn" style={{ flex: 1 }}>Reject</button>
                                                    </div>
                                                    {showRejectInput[req._id] && (
                                                        <div style={{ marginTop: '8px' }}>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Reason for rejection..." 
                                                                style={{ width: '100%', padding: '5px', fontSize: '11px', borderRadius: '4px', border: '1px solid #d1d3e2' }}
                                                                onChange={(e) => setRejectionReason({...rejectionReason, [req._id]: e.target.value})}
                                                            />
                                                            <button 
                                                                className="btn-sm" 
                                                                style={{ width: '100%', marginTop: '4px', background: '#e74a3b', color: 'white' }}
                                                                onClick={() => handleAction(req._id, 'Rejected', rejectionReason[req._id])}
                                                            >
                                                                Confirm Rejection
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className={`status-badge ${req.status === 'Approved' ? 'status-resolved' : 'status-pending'}`}>
                                                    {req.status}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pending Gate Pass Requests */}
                <div className="widget">
                    <div className="widget-header">
                        <div className="widget-title">Standard Gate Pass Requests</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Room</th>
                                <th>Reason</th>
                                <th>Duration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standardRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '15px', color: '#858796' }}>No standard gate pass requests.</td>
                                </tr>
                            ) : (
                                standardRequests.map(req => (
                                    <tr key={req._id}>
                                        <td>{req.student?.name || 'Student'}</td>
                                        <td>{req.student?.roomInfo || req.student?.roomNo || 'Unassigned'}</td>
                                        <td>{req.reason}</td>
                                        <td style={{ fontWeight: 600 }}>
                                            {new Date(req.fromDate).toLocaleDateString(undefined, {day: 'numeric', month: 'short'})} to {new Date(req.toDate).toLocaleDateString(undefined, {day: 'numeric', month: 'short'})}
                                        </td>
                                        <td>
                                            {req.status === 'Pending' ? (
                                                <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                        <button onClick={() => handleAction(req._id, 'Approved')} className="btn-action approve-btn" style={{ flex: 1 }}>Approve</button>
                                                        <button onClick={() => handleRejectClick(req._id)} className="btn-action reject-btn" style={{ flex: 1 }}>Reject</button>
                                                    </div>
                                                    {showRejectInput[req._id] && (
                                                        <div style={{ marginTop: '8px' }}>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Reason for rejection..." 
                                                                style={{ width: '100%', padding: '5px', fontSize: '11px', borderRadius: '4px', border: '1px solid #d1d3e2' }}
                                                                onChange={(e) => setRejectionReason({...rejectionReason, [req._id]: e.target.value})}
                                                            />
                                                            <button 
                                                                className="btn-sm" 
                                                                style={{ width: '100%', marginTop: '4px', background: '#e74a3b', color: 'white' }}
                                                                onClick={() => handleAction(req._id, 'Rejected', rejectionReason[req._id])}
                                                            >
                                                                Confirm Rejection
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className={`status-badge ${req.status === 'Approved' ? 'status-resolved' : req.status === 'Pending' ? 'status-progress' : 'status-pending'}`}>
                                                    {req.status}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default GatePass;

