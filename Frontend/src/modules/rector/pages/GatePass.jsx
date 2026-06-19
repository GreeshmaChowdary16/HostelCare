import React, { useState } from 'react';
import Header from '../../../components/Header';

const GatePass = () => {
    const [rejectionReason, setRejectionReason] = useState({});
    const [showRejectInput, setShowRejectInput] = useState({});

    const extensionRequests = [
        { id: 1, name: 'Anjali Sharma', room: '302', extension: '2 Days', reason: 'Train Delayed due to Fog', parentMobile: '+91 94444 55555', proof: 'Ticket_Fog_Delay.pdf' },
        { id: 2, name: 'Riya Gupta', room: '105', extension: '1 Day', reason: 'Sudden Health Issue', parentMobile: '+91 91111 22222', proof: 'Doctor_Note.jpg' }
    ];

    const handleRejectClick = (id) => {
        setShowRejectInput({ ...showRejectInput, [id]: true });
    };

    const handleAction = (id, action) => {
        alert(`${action} successfully for request ${id}`);
        // In a real app, we would update state here
    };

    return (
        <>
            <Header title="Gate Pass Management" />

            <div className="container">
                {/* Stats Cards */}
                <div className="stats-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="card bg-orange">
                        <div className="card-label"><i className="fas fa-clock"></i> Gate Pass Pending</div>
                        <h3>8</h3>
                        <p>Awaiting Approval</p>
                    </div>
                    <div className="card bg-red">
                        <div className="card-label"><i className="fas fa-history"></i> Extension Pending</div>
                        <h3>2</h3>
                        <p>Return Delay Requests</p>
                    </div>
                    <div className="card bg-teal">
                        <div className="card-label"><i className="fas fa-check-circle"></i> Approved Today</div>
                        <h3>14</h3>
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
                            {extensionRequests.map(req => (
                                <tr key={req.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{req.name}</div>
                                        <div style={{ fontSize: '11px', color: '#858796' }}>Room: {req.room}</div>
                                    </td>
                                    <td style={{ fontWeight: 700, color: '#e74a3b' }}>{req.extension}</td>
                                    <td>
                                        <div style={{ fontSize: '13px' }}>{req.reason}</div>
                                        <a href="#" style={{ fontSize: '12px', color: '#4e73df', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                                            <i className="fas fa-file-alt"></i> View Proof: {req.proof}
                                        </a>
                                    </td>
                                    <td>{req.parentMobile}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button onClick={() => handleAction(req.id, 'Approved')} className="btn-action approve-btn" style={{ flex: 1 }}>Approve</button>
                                                <button onClick={() => handleRejectClick(req.id)} className="btn-action reject-btn" style={{ flex: 1 }}>Reject</button>
                                            </div>
                                            {showRejectInput[req.id] && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Reason for rejection..." 
                                                        style={{ width: '100%', padding: '5px', fontSize: '11px', borderRadius: '4px', border: '1px solid #d1d3e2' }}
                                                        onChange={(e) => setRejectionReason({...rejectionReason, [req.id]: e.target.value})}
                                                    />
                                                    <button 
                                                        className="btn-sm" 
                                                        style={{ width: '100%', marginTop: '4px', background: '#e74a3b', color: 'white' }}
                                                        onClick={() => handleAction(req.id, `Rejected (Reason: ${rejectionReason[req.id]})`)}
                                                    >
                                                        Confirm Rejection
                                                    </button>
                                                </div>
                                            )}
                                            <button 
                                                className="btn-action view-btn" 
                                                style={{ marginTop: '5px', background: '#4e73df' }}
                                                onClick={() => handleAction(req.id, 'Submitted to Admin Report')}
                                            >
                                                <i className="fas fa-paper-plane"></i> Submit to Admin Report
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                            <tr>
                                <td>Priya Sharma</td>
                                <td>201</td>
                                <td>Medical Appointment</td>
                                <td>25 Jan - 26 Jan</td>
                                <td>
                                    <button className="btn-action approve-btn">Approve</button>
                                    <button className="btn-action reject-btn">Reject</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Anjali Verma</td>
                                <td>305</td>
                                <td>Family Function</td>
                                <td>26 Jan - 28 Jan</td>
                                <td>
                                    <button className="btn-action approve-btn">Approve</button>
                                    <button className="btn-action reject-btn">Reject</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default GatePass;

