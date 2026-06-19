import React, { useState } from 'react';
import Header from '../../../components/Header';

const Reports = () => {
    const [wastageData, setWastageData] = useState({ item: '', amount: '', reason: 'Students dislike this item' });
    const [hostelStatus, setHostelStatus] = useState('');

    const extensionReports = [
        { id: 1, name: 'Anjali Sharma', days: '2', reason: 'Train Delay', status: 'Verified', proof: 'Ticket.pdf' },
        { id: 2, name: 'Riya Gupta', days: '1', reason: 'Medical', status: 'Verified', proof: 'Note.jpg' }
    ];

    const handleSubmitReport = (type) => {
        alert(`${type} Report submitted to Admin successfully!`);
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
                .stats-mini { display: flex; gap: 15px; margin-bottom: 20px; }
                .stat-mini-box { flex: 1; padding: 15px; border-radius: 8px; text-align: center; color: white; }
                .bg-success { background: #1cc88a; }
                .bg-danger { background: #e74a3b; }
                .bg-warning { background: #f6c23e; }
            `}</style>

            <div className="container">
                {/* 1. Student Attendance Report */}
                <div className="report-card" style={{ marginBottom: '25px', borderLeft: '5px solid #1cc88a' }}>
                    <div className="section-title" style={{ color: '#1cc88a' }}>
                        <i className="fas fa-user-check"></i> Student Attendance Report (Today)
                    </div>
                    <div className="stats-mini">
                        <div className="stat-mini-box bg-success">
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>PRESENT</div>
                            <div style={{ fontSize: '24px', fontWeight: 700 }}>204</div>
                        </div>
                        <div className="stat-mini-box bg-danger">
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>ABSENT</div>
                            <div style={{ fontSize: '24px', fontWeight: 700 }}>12</div>
                        </div>
                        <div className="stat-mini-box bg-warning">
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>ON LEAVE</div>
                            <div style={{ fontSize: '24px', fontWeight: 700 }}>08</div>
                        </div>
                    </div>
                    <div style={{ background: '#f8f9fc', padding: '15px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>
                        <i className="fas fa-info-circle text-primary"></i> Last sync with entry scanner: 10 minutes ago.
                    </div>
                    <button className="btn-submit" style={{ background: '#1cc88a' }} onClick={() => handleSubmitReport('Attendance')}>
                        <i className="fas fa-sync"></i> Submit Attendance Report to Admin
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
                        <button className="btn-submit" style={{ background: '#e74a3b' }} onClick={() => handleSubmitReport('Mess Wastage')}>
                            <i className="fas fa-chart-bar"></i> Report Wastage to Admin
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
                        <button className="btn-submit" onClick={() => handleSubmitReport('General Hostel Status')}>
                            <i className="fas fa-paper-plane"></i> Submit Status Update
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
                                        <a href="#" style={{ color: '#4e73df' }}><i className="fas fa-file-alt"></i> {report.proof}</a>
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
                    <button className="btn-submit" style={{ background: '#f6c23e', color: 'white', marginTop: '20px' }} onClick={() => handleSubmitReport('Extension')}>
                        <i className="fas fa-share-square"></i> Push Verified Extensions to Admin
                    </button>
                </div>
            </div>
        </>
    );
};

export default Reports;

