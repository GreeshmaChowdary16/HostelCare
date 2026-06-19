import React, { useState } from 'react';
import Header from '../../../components/Header';

const AdminReports = () => {
    // Sample data for reports submitted by Rectors
    const initialReports = [
        { id: 'REP-001', title: 'Major Water Pipe Burst - Block 2', rector: 'Mrs. Kumar', hostel: 'Hostel A', priority: 'Emergency', date: '2026-05-11 08:30 AM', status: 'Action Required', detail: 'Main supply pipe in Block 2 has burst, flooding the basement storage.' },
        { id: 'REP-002', title: 'Student Health Alert: Multiple Vomiting Cases', rector: 'Mr. Singh', hostel: 'Hostel B', priority: 'Emergency', date: '2026-05-11 07:45 AM', status: 'Medical Team Sent', detail: '7 students reported nausea and vomiting after dinner. Potential food poisoning.' },
        { id: 'REP-003', title: 'Elevator Maintenance Failure', rector: 'Ms. Sharma', hostel: 'Hostel C', priority: 'Urgent', date: '2026-05-10 11:20 PM', status: 'Technician Called', detail: 'Main elevator stuck on 4th floor. No students inside, but needs immediate repair.' },
        { id: 'REP-004', title: 'Security Camera Outage - Main Gate', rector: 'Mrs. Kumar', hostel: 'Hostel A', priority: 'Urgent', date: '2026-05-10 09:00 PM', status: 'Assigned', detail: 'Gate cameras 1 and 4 are not recording. Security blind spot created.' },
        { id: 'REP-005', title: 'Monthly Occupancy & Revenue Report', rector: 'Mrs. Kumar', hostel: 'Hostel A', priority: 'Normal', date: '2026-05-09 04:00 PM', status: 'Reviewing', detail: 'Standard monthly report for room allocations and fee collections.' },
        { id: 'REP-006', title: 'Worker Attendance Log - Week 19', rector: 'Mr. Singh', hostel: 'Hostel B', priority: 'Normal', date: '2026-05-09 10:00 AM', status: 'Completed', detail: 'Weekly attendance sheets for cleaning and maintenance staff.' },
        { id: 'REP-007', title: 'Inventory Request: Cleaning Supplies', rector: 'Ms. Sharma', hostel: 'Hostel C', priority: 'Low', date: '2026-05-08 02:30 PM', status: 'Pending', detail: 'Request for stock replenishment of detergents and sanitizers.' }
    ];

    const [reports] = useState(initialReports);

    // Function to get priority styles
    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'Emergency': return { bg: '#fff5f5', color: '#e74a3b', border: '2px solid #e74a3b' };
            case 'Urgent': return { bg: '#fffbe6', color: '#f6c23e', border: '1px solid #f6c23e' };
            case 'Normal': return { bg: '#f0f7ff', color: '#4e73df', border: '1px solid #4e73df' };
            default: return { bg: '#f8f9fc', color: '#858796', border: '1px solid #d1d3e2' };
        }
    };

    return (
        <>
            <Header title="Rector Reports & Alerts" />
            <style>{`
                .admin-reports-container {
                    padding: 30px;
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                    background: #f8f9fc;
                    min-height: 100vh;
                }

                .section-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 5px;
                }

                /* Priority Section */
                .priority-banner {
                    background: linear-gradient(90deg, #e74a3b, #c0392b);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    box-shadow: 0 4px 12px rgba(231, 74, 59, 0.3);
                }

                .report-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    border-left: 6px solid;
                    transition: transform 0.2s;
                    position: relative;
                }

                .report-card:hover {
                    transform: translateX(5px);
                }

                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .priority-badge {
                    font-size: 10px;
                    text-transform: uppercase;
                    font-weight: 800;
                    padding: 4px 10px;
                    border-radius: 4px;
                    letter-spacing: 0.5px;
                }

                .hostel-info {
                    font-size: 13px;
                    font-weight: 700;
                    color: #4e73df;
                    background: #eaecf4;
                    padding: 2px 8px;
                    border-radius: 4px;
                }

                .report-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 8px;
                }

                .report-meta {
                    display: flex;
                    gap: 20px;
                    font-size: 13px;
                    color: #858796;
                    margin-bottom: 12px;
                }

                .report-detail {
                    background: #f8f9fc;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 14px;
                    color: #5a5c69;
                    line-height: 1.5;
                }

                /* Overview Grid */
                .overview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .overview-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    border-top: 4px solid #4e73df;
                }

                .overview-card h4 { margin: 0 0 15px 0; font-size: 14px; color: #858796; text-transform: uppercase; }

                /* Attendance Alert System */
                .attendance-alert-card {
                    background: #fff;
                    border-radius: 15px;
                    padding: 25px;
                    border: 1px solid #ffdada;
                    box-shadow: 0 10px 20px rgba(231, 74, 59, 0.05);
                }

                .student-missing-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    background: #fdf2f2;
                    border-radius: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #fbdada;
                }

                .ai-status-badge {
                    font-size: 11px;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 4px;
                    background: #e74a3b;
                    color: white;
                }

                .action-log {
                    margin-top: 10px;
                    padding-left: 15px;
                    border-left: 2px dashed #d1d3e2;
                    font-size: 12px;
                    color: #858796;
                }

                .action-item { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
                .action-item i { font-size: 10px; }
                .text-success { color: #1cc88a; }
                .text-danger { color: #e74a3b; }

                .status-tag {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    font-size: 12px;
                    font-weight: 700;
                }

                .emergency-pulse {
                    width: 10px;
                    height: 10px;
                    background: #e74a3b;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 8px;
                    animation: pulse-red 1.5s infinite;
                }

                @keyframes pulse-red {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(231, 74, 59, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(231, 74, 59, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(231, 74, 59, 0); }
                }
            `}</style>

            <div className="admin-reports-container">
                {/* Emergency Summary Bar */}
                <div className="priority-banner">
                    <i className="fas fa-shield-alt fa-2x"></i>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '18px' }}>Safety & Operations Dashboard</div>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>
                            Daily Monitoring Active: {reports.filter(r => r.priority === 'Emergency').length} System Alerts Found.
                        </div>
                    </div>
                </div>

                {/* Overviews Section */}
                <div className="overview-grid">
                    <div className="overview-card" style={{ borderTopColor: '#4e73df' }}>
                        <h4><i className="fas fa-user-tie"></i> Rectors Overview</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span>Active Duty: <strong>12/12</strong></span>
                            <span>Reports Sent: <strong>8</strong></span>
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#858796' }}>All Rectors have completed morning rounds.</div>
                    </div>
                    <div className="overview-card" style={{ borderTopColor: '#1cc88a' }}>
                        <h4><i className="fas fa-users"></i> Students Overview</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span>Total Present: <strong>842</strong></span>
                            <span>On Leave: <strong>24</strong></span>
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#858796' }}>Attendance sync complete for 98% students.</div>
                    </div>
                    <div className="overview-card" style={{ borderTopColor: '#f6c23e' }}>
                        <h4><i className="fas fa-bolt"></i> Quick Actions</h4>
                        <button style={{ width: '100%', background: '#f8f9fc', border: '1px solid #d1d3e2', padding: '8px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' }}>
                            Generate Daily PDF
                        </button>
                    </div>
                </div>

                {/* AI Attendance Alert System */}
                <div className="attendance-alert-card">
                    <h3 className="section-title" style={{ color: '#e74a3b' }}>
                        <i className="fas fa-fingerprint"></i> AI Attendance Alert System
                    </h3>
                    <p style={{ fontSize: '14px', color: '#858796', marginBottom: '20px' }}>
                        Automatic tracking of students missing for <strong>3+ consecutive days</strong>. AI initiates emergency protocols.
                    </p>

                    <div className="student-missing-row">
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '16px' }}>Aryan Mehta (ID: S-1042)</div>
                            <div style={{ fontSize: '12px', color: '#5a5c69' }}>Hostel A, Block 1 - Room 102</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="ai-status-badge">MISSING: 3 DAYS</div>
                            <div style={{ fontSize: '10px', color: '#e74a3b', fontWeight: 700, marginTop: '5px' }}>EMERGENCY PROTOCOL ACTIVE</div>
                        </div>
                    </div>
                    <div className="action-log">
                        <div className="action-item text-success"><i className="fas fa-check-circle"></i> AI: SMS Alert sent to student (Day 1 & 2) - No Response.</div>
                        <div className="action-item text-success"><i className="fas fa-phone-alt"></i> AI: Automated call initiated to Parent (+91 98XXX-XXXXX) - Informed.</div>
                        <div className="action-item text-success"><i className="fas fa-bell"></i> AI: Alert sent to Rector (Mrs. Kumar) - Investigating.</div>
                    </div>

                    <div className="action-log">
                        <div className="action-item text-success"><i className="fas fa-check-circle"></i> AI: SMS Alert sent to student - No Response.</div>
                        <div className="action-item text-danger"><i className="fas fa-times-circle"></i> AI: Parent call attempt 1 failed - Retrying in 5 mins.</div>
                        <div className="action-item text-success"><i className="fas fa-bell"></i> AI: Alert sent to Rector (Mr. Singh) - Dispatched to Room.</div>
                    </div>
                </div>

                {/* Late Return Extension Reports Section */}
                <div className="widget" style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '5px solid #f6c23e' }}>
                    <h3 className="section-title" style={{ color: '#dda20a' }}>
                        <i className="fas fa-history"></i> Late Return Extension Reports
                    </h3>
                    <p style={{ fontSize: '14px', color: '#858796', marginBottom: '20px' }}>
                        Requests submitted by Rectors for students requiring extension on their gate pass return date.
                    </p>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fc' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e3e6f0' }}>Student Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e3e6f0' }}>Extension</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e3e6f0' }}>Reason & Validity</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e3e6f0' }}>Proof Provided</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e3e6f0' }}>Parent Contact</th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e3e6f0' }}>Rector Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #f1f3f8' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 700 }}>Anjali Sharma</div>
                                        <div style={{ fontSize: '11px', color: '#858796' }}>Hostel A - Room 302</div>
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: 700, color: '#e74a3b' }}>+2 Days</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontSize: '13px' }}>Train Delayed (Fog)</div>
                                        <div style={{ fontSize: '11px', color: '#1cc88a', fontWeight: 700 }}>✓ REASON VALID</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <a href="#" style={{ color: '#4e73df', textDecoration: 'none', fontSize: '12px' }}>
                                            <i className="fas fa-file-pdf"></i> Ticket_Delay.pdf
                                        </a>
                                    </td>
                                    <td style={{ padding: '15px', fontSize: '13px' }}>+91 94444 55555</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ padding: '4px 8px', background: '#e6fffa', color: '#1cc88a', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                                            VERIFIED & SUBMITTED
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="overview-grid">
                    {/* Mess Wastage Analytics */}
                    <div className="overview-card" style={{ borderTopColor: '#e74a3b' }}>
                        <h4 style={{ color: '#e74a3b' }}><i className="fas fa-utensils"></i> Mess Wastage Alerts</h4>
                        <div style={{ background: '#fff5f5', padding: '15px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 600 }}>Hostel A: Baingan Bharta</span>
                                <span style={{ color: '#e74a3b', fontWeight: 700 }}>18 KG Waste</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#858796' }}>Reason: Students reported disliking the item. Proposing menu update.</div>
                        </div>
                    </div>

                    {/* Infrastructure Summary */}
                    <div className="overview-card" style={{ borderTopColor: '#4e73df' }}>
                        <h4 style={{ color: '#4e73df' }}><i className="fas fa-tools"></i> Hostel Status Updates</h4>
                        <div style={{ fontSize: '13px', borderLeft: '3px solid #4e73df', paddingLeft: '10px' }}>
                            <strong>Hostel B:</strong> Main water tank leakage reported. Plumber assigned.
                        </div>
                        <div style={{ fontSize: '13px', borderLeft: '3px solid #4e73df', paddingLeft: '10px', marginTop: '10px' }}>
                            <strong>Hostel C:</strong> Night shift security camera restored in Wing 2.
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="section-title">Hostel Performance & Compliance Reports</h3>
                    <p style={{ color: '#858796', fontSize: '14px', marginBottom: '20px' }}>Historical log of all reports submitted by hostel rectors.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {reports.map((report) => {
                            const styles = getPriorityStyles(report.priority);
                            return (
                                <div key={report.id} className="report-card" style={{ borderLeftColor: styles.color }}>
                                    <div className="report-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <span className="priority-badge" style={{ backgroundColor: styles.bg, color: styles.color, border: styles.border }}>{report.priority}</span>
                                            <span className="hostel-info">{report.hostel}</span>
                                        </div>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: styles.color }}>{report.status}</div>
                                    </div>
                                    <div className="report-title">{report.title}</div>
                                    <div className="report-meta">
                                        <span><i className="fas fa-user-tie"></i> Rector: {report.rector}</span>
                                        <span><i className="fas fa-calendar-alt"></i> {report.date}</span>
                                    </div>
                                    <div className="report-detail">{report.detail}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminReports;

