import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const StudentGatePass = () => {
    const [requests, setRequests] = useState([]);
    const [newRequest, setNewRequest] = useState({
        fromDate: '',
        toDate: '',
        noOfDays: '',
        reason: '',
        contactNo: '+91 70001 23456',
        parentContactNo: '+91 94444 55555',
        destination: '',
        timeFrom: '09:00 AM',
        timeTo: '06:00 PM'
    });

    // Extension Request State
    const [extensionDays, setExtensionDays] = useState('');
    const [extensionReason, setExtensionReason] = useState('');
    const [parentMobile, setParentMobile] = useState('+91 94444 55555');

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
                setRequests(data);
            }
        } catch (error) {
            console.error('Error fetching gate passes:', error);
        }
    };

    useEffect(() => {
        fetchGatePasses();

        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const response = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.phone) {
                        setNewRequest(prev => ({ ...prev, contactNo: data.phone }));
                    }
                    if (data.parentPhone) {
                        setNewRequest(prev => ({ ...prev, parentContactNo: data.parentPhone }));
                        setParentMobile(data.parentPhone);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile for gatepass:', error);
            }
        };
        fetchProfile();
    }, []);

    // Calculate days when dates change
    useEffect(() => {
        if (newRequest.fromDate && newRequest.toDate) {
            const start = new Date(newRequest.fromDate);
            const end = new Date(newRequest.toDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setNewRequest(prev => ({ ...prev, noOfDays: diffDays }));
        }
    }, [newRequest.fromDate, newRequest.toDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/gatepass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reason: newRequest.reason,
                    fromDate: newRequest.fromDate,
                    toDate: newRequest.toDate,
                    noOfDays: newRequest.noOfDays,
                    destination: newRequest.destination,
                    contactNo: newRequest.contactNo,
                    parentContactNo: newRequest.parentContactNo,
                    timeFrom: newRequest.timeFrom,
                    timeTo: newRequest.timeTo,
                    isExtension: false
                })
            });

            if (response.ok) {
                alert("Gate Pass Request Submitted Successfully!");
                setNewRequest({
                    fromDate: '',
                    toDate: '',
                    noOfDays: '',
                    reason: '',
                    contactNo: '+91 70001 23456',
                    parentContactNo: '+91 94444 55555',
                    destination: '',
                    timeFrom: '09:00 AM',
                    timeTo: '06:00 PM'
                });
                fetchGatePasses();
            } else {
                const data = await response.json();
                alert(`Failed to submit gate pass: ${data.message}`);
            }
        } catch (error) {
            console.error('Error submitting gate pass:', error);
            alert('Server error while submitting gate pass request.');
        }
    };

    const handleExtensionSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`${API_BASE_URL}/gatepass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reason: `Extension request: ${extensionReason}`,
                    fromDate: today,
                    toDate: today,
                    noOfDays: Number(extensionDays),
                    destination: 'Home',
                    contactNo: '+91 70001 23456',
                    parentContactNo: parentMobile,
                    timeFrom: '09:00 AM',
                    timeTo: '06:00 PM',
                    isExtension: true,
                    parentMobile: parentMobile
                })
            });

            if (response.ok) {
                alert("Extension Request Submitted Successfully!");
                setExtensionDays('');
                setExtensionReason('');
                fetchGatePasses();
            } else {
                const data = await response.json();
                alert(`Failed to submit extension: ${data.message}`);
            }
        } catch (error) {
            console.error('Error submitting extension:', error);
            alert('Server error while submitting extension request.');
        }
    };

    return (
        <>
            <Header title="Gate Pass Management" />

            <div className="container">
                {/* Modern Table Format Form */}
                <div className="widget" style={{ padding: '0', overflow: 'hidden', marginBottom: '30px' }}>
                    <div className="widget-header" style={{ 
                        background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)', 
                        color: 'white',
                        padding: '15px 25px',
                        marginBottom: '0'
                    }}>
                        <div className="widget-title" style={{ color: 'white' }}>
                            <i className="fas fa-plus-circle"></i> Create New Gate Pass
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #f1f3f8' }}>
                                    <td style={{ padding: '15px', width: '20%', fontWeight: 600, color: '#858796' }}>Leave Dates</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>From Date</label>
                                                <input type="date" value={newRequest.fromDate} onChange={(e) => setNewRequest({...newRequest, fromDate: e.target.value})} style={inputStyle} required />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>To Date</label>
                                                <input type="date" value={newRequest.toDate} onChange={(e) => setNewRequest({...newRequest, toDate: e.target.value})} style={inputStyle} required />
                                            </div>
                                            <div style={{ width: '120px' }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>No. of Days</label>
                                                <input type="text" value={newRequest.noOfDays} readOnly style={{ ...inputStyle, background: '#f8f9fc' }} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f1f3f8' }}>
                                    <td style={{ padding: '15px', fontWeight: 600, color: '#858796' }}>Visit Details</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>Reason of Leave</label>
                                                <input type="text" placeholder="e.g. Family Function" value={newRequest.reason} onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})} style={inputStyle} required />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>Where are you going?</label>
                                                <input type="text" placeholder="Destination Address" value={newRequest.destination} onChange={(e) => setNewRequest({...newRequest, destination: e.target.value})} style={inputStyle} required />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f1f3f8' }}>
                                    <td style={{ padding: '15px', fontWeight: 600, color: '#858796' }}>Contact Info</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>Your Contact No</label>
                                                <input type="text" value={newRequest.contactNo} onChange={(e) => setNewRequest({...newRequest, contactNo: e.target.value})} style={inputStyle} required />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>Parents Contact No</label>
                                                <input type="text" value={newRequest.parentContactNo} onChange={(e) => setNewRequest({...newRequest, parentContactNo: e.target.value})} style={inputStyle} required />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f1f3f8' }}>
                                    <td style={{ padding: '15px', fontWeight: 600, color: '#858796' }}>Time Schedule</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>Exit Time (When?)</label>
                                                <input type="text" placeholder="e.g. 09:00 AM" value={newRequest.timeFrom} onChange={(e) => setNewRequest({...newRequest, timeFrom: e.target.value})} style={inputStyle} required />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>Return Time (When?)</label>
                                                <input type="text" placeholder="e.g. 06:00 PM" value={newRequest.timeTo} onChange={(e) => setNewRequest({...newRequest, timeTo: e.target.value})} style={inputStyle} required />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ padding: '25px 15px 10px', textAlign: 'right' }}>
                                        <button type="submit" className="btn-action bg-blue" style={{ padding: '12px 30px', fontSize: '14px', fontWeight: 600, boxShadow: '0 4px 10px rgba(78, 115, 223, 0.3)' }}>
                                            <i className="fas fa-paper-plane"></i> Submit Gate Pass Request
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>

                {/* History Section */}
                <div className="widget">
                    <div className="widget-header">
                        <div className="widget-title">My Pass History</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Requested On</th>
                                <th>Duration</th>
                                <th>Destination</th>
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req._id}>
                                    <td>{new Date(req.createdAt).toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                                    <td style={{ fontWeight: 600 }}>
                                        {new Date(req.fromDate).toLocaleDateString(undefined, {day: 'numeric', month: 'short'})} to {new Date(req.toDate).toLocaleDateString(undefined, {day: 'numeric', month: 'short'})}
                                    </td>
                                    <td>{req.destination}</td>
                                    <td>{req.reason}</td>
                                    <td>
                                        <span className={`status-badge ${req.status === 'Approved' ? 'status-resolved' : req.status === 'Pending' ? 'status-progress' : 'status-pending'}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Gatepass Extension Section */}
                <div className="widget" style={{ padding: '0', overflow: 'hidden' }}>
                    <div className="widget-header" style={{ 
                        background: 'linear-gradient(135deg, #f6c23e 0%, #dda20a 100%)', 
                        color: 'white',
                        padding: '15px 25px',
                        marginBottom: '0'
                    }}>
                        <div className="widget-title" style={{ color: 'white' }}>
                            <i className="fas fa-history"></i> Gatepass Return Date Extension
                        </div>
                    </div>
                    
                    <form onSubmit={handleExtensionSubmit} style={{ padding: '25px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #f1f3f8' }}>
                                    <td style={{ padding: '15px', width: '25%', fontWeight: 600, color: '#858796' }}>Extension Details</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>Days Extension Needed</label>
                                                <input type="number" placeholder="e.g. 2" value={extensionDays} onChange={(e) => setExtensionDays(e.target.value)} style={inputStyle} required />
                                            </div>
                                            <div style={{ flex: 2 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>Reason for delay</label>
                                                <input type="text" placeholder="Explain why you can't return on time" value={extensionReason} onChange={(e) => setExtensionReason(e.target.value)} style={inputStyle} required />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f1f3f8' }}>
                                    <td style={{ padding: '15px', fontWeight: 600, color: '#858796' }}>Verification</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>Travel Proof (Ticket/Doctor Note)</label>
                                                <div className="file-upload-wrapper" style={{ marginTop: '5px' }}>
                                                    <i className="fas fa-cloud-upload-alt"></i>
                                                    <span>Click to upload proof</span>
                                                    <input type="file" />
                                                </div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#858796', display: 'block' }}>Parents Mobile Number</label>
                                                <input type="text" value={parentMobile} onChange={(e) => setParentMobile(e.target.value)} style={inputStyle} required />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ padding: '25px 15px 10px', textAlign: 'right' }}>
                                        <button type="submit" className="btn-action" style={{ background: '#f6c23e', color: 'white', padding: '12px 30px', fontSize: '14px', fontWeight: 600, border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                            <i className="fas fa-clock"></i> Submit Extension Request
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        </>
    );
};


const inputStyle = {
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: '8px', 
    border: '1px solid #e3e6f0', 
    marginTop: '5px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
};

export default StudentGatePass;

