import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const Reports = () => {
    const [wastageData, setWastageData] = useState({ item: '', amount: '', reason: 'Students dislike this item' });
    const [hostelStatus, setHostelStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('success'); // 'success' or 'error'

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const headers = { 'Authorization': `Bearer ${token}` };
        Promise.all([
            fetch(`${API_BASE_URL}/students/live-status`, { headers }),
            fetch(`${API_BASE_URL}/gatepass`, { headers }),
        ]).then(async ([studentsResponse, gatePassResponse]) => {
            if (studentsResponse.ok) {
                const data = await studentsResponse.json();
                setAttendance({ present: data.present || 0, absent: Math.max(0, (data.total || 0) - (data.present || 0) - (data.onLeave || 0)), onLeave: data.onLeave || 0, updatedAt: data.updatedAt });
            }
            if (gatePassResponse.ok) {
                const data = await gatePassResponse.json();
                setExtensionReports(data.filter((item) => item.isExtension).map((item) => ({
                    id: item._id,
                    name: item.student?.name || 'Student',
                    days: item.noOfDays,
                    reason: item.reason,
                    status: item.status,
                    proof: item.proof,
                })));
            }
        }).catch((error) => console.error('Error loading report data:', error));
    }, []);

    const handleSubmitReport = async (reportType) => {
        setLoading(true);
        setStatusMessage('');
        
        let title = '';
        let type = 'Other';
        let content = '';

        if (reportType === 'Attendance') {
            title = 'Daily Student Attendance Report';
            type = 'Attendance';
            content = `Daily attendance summary: Present: 204, Absent: 12, On Leave: 8. Verified by Rector.`;
        } else if (reportType === 'Mess Wastage') {
            if (!wastageData.item || !wastageData.amount) {
                alert('Please fill out the food wastage item and estimated amount.');
                setLoading(false);
                return;
            }
            title = `Mess Food Wastage Report: ${wastageData.item}`;
            type = 'Food Wastage';
            content = `High wastage reported for item: ${wastageData.item}. Estimated wastage: ${wastageData.amount} KG. Primary reason: ${wastageData.reason}.`;
        } else if (reportType === 'General Hostel Status') {
            if (!hostelStatus.trim()) {
                alert('Please enter the general hostel infrastructure safety status description.');
                setLoading(false);
                return;
            }
            title = 'General Hostel Infrastructure & Safety Status Report';
            type = 'Infrastructure';
            content = hostelStatus.trim();
        } else if (reportType === 'Extension') {
            title = 'Student Return Date Extension Report';
            type = 'Other';
            content = `Verified student return date extension requests:\n` + 
                      extensionReports.map(r => `- ${r.name}: +${r.days} Days (${r.reason})`).join('\n');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setStatusType('error');
            setStatusMessage('Authorization token missing. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    type,
                    content,
                    attachments: []
                })
            });

            const data = await res.json();
            if (res.ok) {
                setStatusType('success');
                setStatusMessage(`${reportType} report submitted to Administrator successfully.`);
                // Reset corresponding form
                if (reportType === 'Mess Wastage') {
                    setWastageData({ item: '', amount: '', reason: 'Students dislike this item' });
                } else if (reportType === 'General Hostel Status') {
                    setHostelStatus('');
                }
            } else {
                setStatusType('error');
                setStatusMessage(data.message || 'Failed to submit report.');
            }
        } catch (err) {
            console.error('Error submitting report:', err);
            setStatusType('error');
            setStatusMessage('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title="Rector Operational Reports" />
            <style>{`
                .container { padding: 30px; max-width: 1400px; margin: 0 auto; }
                .report-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
                .report-card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .section-title { font-size: 18px; font-weight: 700; color: #4e73df; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
                .form-label { display: block; margin-bottom: 8px; font-weight: 600; color: #5a5c69; font-size: 13px; }
                .form-control { width: 100%; padding: 10px; border: 1px solid #d1d3e2; border-radius: 6px; margin-bottom: 15px; }
                .btn-submit { background: #4e73df; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
                .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
                .stats-mini { display: flex; gap: 15px; margin-bottom: 20px; }
                .stat-mini-box { flex: 1; padding: 15px; border-radius: 8px; text-align: center; color: white; }
                .bg-success { background: #1cc88a; }
                .bg-danger { background: #e74a3b; }
                .bg-warning { background: #f6c23e; }
                .status-alert { padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; font-size: 14px; }
                .status-alert.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
                .status-alert.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
            `}</style>

            <div className="container">
                {statusMessage && (
                    <div className={`status-alert ${statusType}`}>
                        <i className={`fas ${statusType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ marginRight: '8px' }}></i>
                        {statusMessage}
                    </div>
                )}

                {/* 1. Student Attendance Report */}
                <div className="report-card" style={{ marginBottom: '25px', borderLeft: '5px solid #1cc88a' }}>
                    <div className="section-title" style={{ color: '#1cc88a' }}>
                        <i className="fas fa-user-check"></i> Student Attendance Report (Today)
                    </div>
                    <div className="stats-mini">
                        <div className="stat-mini-box bg-success">
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>PRESENT</div>
                            <div style={{ fontSize: '24px', fontWeight: 700 }}>{attendance.present}</div>
                        </div>
                        <div className="stat-mini-box bg-danger">
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>ABSENT</div>
                            <div style={{ fontSize: '24px', fontWeight: 700 }}>{attendance.absent}</div>
                        </div>
                        <div className="stat-mini-box bg-warning">
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>ON LEAVE</div>
                            <div style={{ fontSize: '24px', fontWeight: 700 }}>{attendance.onLeave}</div>
                        </div>
                    </div>
                    <div style={{ background: '#f8f9fc', padding: '15px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>
                        <i className="fas fa-info-circle text-primary"></i> Last sync: {attendance.updatedAt ? new Date(attendance.updatedAt).toLocaleString() : 'Not available'}.
                    </div>
                    <button 
                        type="button" 
                        disabled={loading} 
                        className="btn-submit" 
                        style={{ background: '#1cc88a' }} 
                        onClick={() => handleSubmitReport('Attendance')}
                    >
                        <i className="fas fa-sync"></i> 
                        {loading ? 'Submitting...' : 'Submit Attendance Report to Admin'}
                    </button>
                </div>

                <div className="report-grid">
                    {/* 2. Mess Food Wastage Report */}
                    <div className="report-card" style={{ borderTop: '5px solid #e74a3b' }}>
                        <div className="section-title" style={{ color: '#e74a3b' }}>
                            <i className="fas fa-trash-alt"></i> Mess Food Wastage Report
                        </div>
                        <div className="form-group">
                            <label className="form-label">Item with High Wastage</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="e.g. Baingan Bharta"
                                value={wastageData.item}
                                onChange={(e) => setWastageData({...wastageData, item: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Estimated Wastage (KG)</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                placeholder="e.g. 15"
                                value={wastageData.amount}
                                onChange={(e) => setWastageData({...wastageData, amount: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Primary Reason</label>
                            <select 
                                className="form-control"
                                value={wastageData.reason}
                                onChange={(e) => setWastageData({...wastageData, reason: e.target.value})}
                            >
                                <option>Students dislike this item</option>
                                <option>Poor quality of ingredients</option>
                                <option>Over-prepared quantity</option>
                                <option>Taste issues reported</option>
                            </select>
                        </div>
                        <button 
                            type="button" 
                            disabled={loading} 
                            className="btn-submit" 
                            style={{ background: '#e74a3b' }} 
                            onClick={() => handleSubmitReport('Mess Wastage')}
                        >
                            <i className="fas fa-chart-bar"></i> 
                            {loading ? 'Submitting...' : 'Report Wastage to Admin'}
                        </button>
                    </div>

                    {/* 3. Hostel Status Report */}
                    <div className="report-card" style={{ borderTop: '5px solid #4e73df' }}>
                        <div className="section-title">
                            <i className="fas fa-hotel"></i> General Hostel Report
                        </div>
                        <div className="form-group">
                            <label className="form-label">Hostel Infrastructure & Safety Status</label>
                            <textarea 
                                className="form-control" 
                                rows="8" 
                                placeholder="Report any maintenance issues, water problems, or general hostel status..."
                                value={hostelStatus}
                                onChange={(e) => setHostelStatus(e.target.value)}
                            ></textarea>
                        </div>
                        <button 
                            type="button" 
                            disabled={loading} 
                            className="btn-submit" 
                            onClick={() => handleSubmitReport('General Hostel Status')}
                        >
                            <i className="fas fa-paper-plane"></i> 
                            {loading ? 'Submitting...' : 'Submit Status Update'}
                        </button>
                    </div>
                </div>

                {/* 4. Student Return Date Extension Report Summary */}
                <div className="report-card" style={{ marginTop: '25px', borderTop: '5px solid #f6c23e' }}>
                    <div className="section-title" style={{ color: '#dda20a' }}>
                        <i className="fas fa-clock"></i> Student Return Extension Report (Verified)
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fc', textAlign: 'left' }}>
                                <th style={{ padding: '12px', fontSize: '13px' }}>Student</th>
                                <th style={{ padding: '12px', fontSize: '13px' }}>Days</th>
                                <th style={{ padding: '12px', fontSize: '13px' }}>Reason</th>
                                <th style={{ padding: '12px', fontSize: '13px' }}>Proof</th>
                                <th style={{ padding: '12px', fontSize: '13px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {extensionReports.map(report => (
                                <tr key={report.id} style={{ borderBottom: '1px solid #f1f3f8' }}>
                                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600 }}>{report.name}</td>
                                    <td style={{ padding: '12px', fontSize: '13px', color: '#e74a3b' }}>+{report.days} Days</td>
                                    <td style={{ padding: '12px', fontSize: '13px' }}>{report.reason}</td>
                                    <td style={{ padding: '12px', fontSize: '12px' }}>
                                        {report.proof ? <a href={getImageUrl(report.proof)} target="_blank" rel="noreferrer" style={{ color: '#4e73df' }}><i className="fas fa-file-alt"></i> {report.proof}</a> : 'Not provided'}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ fontSize: '11px', background: '#e6fffa', color: '#1cc88a', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                                            {report.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button 
                        type="button" 
                        disabled={loading} 
                        className="btn-submit" 
                        style={{ background: '#f6c23e', color: 'white', marginTop: '20px' }} 
                        onClick={() => handleSubmitReport('Extension')}
                    >
                        <i className="fas fa-share-square"></i> 
                        {loading ? 'Submitting...' : 'Push Verified Extensions to Admin'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Reports;
