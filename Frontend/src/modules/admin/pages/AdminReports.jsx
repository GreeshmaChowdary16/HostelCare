import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');

    const fetchReports = async () => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authorization token missing. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/reports`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setReports(data || []);
            } else {
                if (res.status === 401) {
                    setError('Session expired. Please log in again.');
                } else if (res.status === 403) {
                    setError('Access denied. You do not have permission to view operational reports.');
                } else {
                    setError('Failed to fetch operational reports.');
                }
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Could not connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const getTypeStyles = (type) => {
        switch (type) {
            case 'Attendance': return { bg: '#e6fffa', color: '#1cc88a', border: '1px solid #1cc88a' };
            case 'Food Wastage': return { bg: '#fff5f5', color: '#e74a3b', border: '1px solid #e74a3b' };
            case 'Infrastructure': return { bg: '#f0f7ff', color: '#4e73df', border: '1px solid #4e73df' };
            default: return { bg: '#fffbe6', color: '#f6c23e', border: '1px solid #f6c23e' };
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Closed': return '#858796';
            case 'Reviewed': return '#4e73df';
            default: return '#e74a3b'; // Open
        }
    };

    // Filter and search logic
    const filteredReports = reports.filter((report) => {
        const title = report.title || '';
        const content = report.content || '';
        const authorName = (report.author && report.author.name) || '';
        const type = report.type || '';

        const matchesSearch = 
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            authorName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = selectedType === 'All' || type === selectedType;

        return matchesSearch && matchesType;
    });

    return (
        <>
            <Header title="Rector Operational Reports" />
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
                    font-size: 20px;
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 5px;
                }

                .priority-banner {
                    background: linear-gradient(90deg, #4e73df, #224abe);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    box-shadow: 0 4px 12px rgba(78, 115, 223, 0.2);
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
                    white-space: pre-wrap;
                }

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

                .btn-refresh {
                    background: #4e73df;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .btn-refresh:disabled {
                    opacity: 0.6;
                }

                .filter-bar {
                    background: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    border: 1px solid #eaecf4;
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .filter-input {
                    padding: 8px 12px;
                    border: 1px solid #d1d3e2;
                    border-radius: 5px;
                    font-size: 14px;
                    outline: none;
                }
                .filter-select {
                    padding: 8px 12px;
                    border: 1px solid #d1d3e2;
                    border-radius: 5px;
                    font-size: 14px;
                    outline: none;
                }
            `}</style>

            <div className="admin-reports-container">
                {/* Safety & Operations Dashboard Title */}
                <div className="priority-banner">
                    <i className="fas fa-shield-alt fa-2x"></i>
                    <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '18px' }}>Rector Operations Center</div>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>
                            Monitoring: {reports.length} total operational reports logged in MongoDB.
                        </div>
                    </div>
                    <button type="button" disabled={loading} onClick={fetchReports} className="btn-refresh">
                        <i className={`fas fa-sync ${loading ? 'fa-spin' : ''}`} style={{ marginRight: '5px' }}></i>
                        Refresh
                    </button>
                </div>

                {/* Overviews Section */}
                <div className="overview-grid">
                    <div className="overview-card" style={{ borderTopColor: '#4e73df' }}>
                        <h4><i className="fas fa-user-tie"></i> Operational Inflow</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '10px' }}>
                            <span>Total Reports: <strong>{reports.length}</strong></span>
                            <span>Open Audits: <strong>{reports.filter(r => r.status === 'Open').length}</strong></span>
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#858796' }}>Submissions are stored centrally for compliance monitoring.</div>
                    </div>
                    <div className="overview-card" style={{ borderTopColor: '#e74a3b' }}>
                        <h4><i className="fas fa-utensils"></i> Food Wastage Logs</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '10px' }}>
                            <span>Wastage Reports: <strong>{reports.filter(r => r.type === 'Food Wastage').length}</strong></span>
                            <span>Latest Log: <strong>{reports.find(r => r.type === 'Food Wastage')?.title || 'N/A'}</strong></span>
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#858796' }}>Mess reports help reduce meal waste and review menus.</div>
                    </div>
                    <div className="overview-card" style={{ borderTopColor: '#1cc88a' }}>
                        <h4><i className="fas fa-users"></i> Attendance Summaries</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '10px' }}>
                            <span>Attendance Logs: <strong>{reports.filter(r => r.type === 'Attendance').length}</strong></span>
                            <span>Infrastructure Logs: <strong>{reports.filter(r => r.type === 'Infrastructure').length}</strong></span>
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#858796' }}>Updates include room checks and safety rounds.</div>
                    </div>
                </div>

                {/* AI Attendance Alert System */}
                <div className="attendance-alert-card">
                    <h3 className="section-title" style={{ color: '#e74a3b' }}>
                        <i className="fas fa-fingerprint"></i> System-Wide Compliance Check
                    </h3>
                    <p style={{ fontSize: '14px', color: '#858796', marginBottom: '15px' }}>
                        Automatic tracking of operations: The system analyzes reported data trends to flag security anomalies and trigger emergency responses if needed.
                    </p>
                    <div style={{ background: '#fdf2f2', border: '1px solid #fbdada', padding: '15px', borderRadius: '10px', fontSize: '13px', color: '#721c24' }}>
                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                        AI Monitoring Active: Scanning rector attendance checklists and student gate pass status updates.
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="filter-bar">
                    <div style={{ display: 'flex', flexGrow: 1, gap: '10px', alignItems: 'center' }}>
                        <i className="fas fa-search" style={{ color: '#858796' }}></i>
                        <input 
                            type="text" 
                            className="filter-input" 
                            style={{ flexGrow: 1 }}
                            placeholder="Search by title, content, or rector name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#5a5c69' }}>Filter Type:</span>
                        <select 
                            className="filter-select"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Attendance">Attendance</option>
                            <option value="Food Wastage">Food Wastage</option>
                            <option value="Infrastructure">Infrastructure</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Main List */}
                <div>
                    <h3 className="section-title">Hostel Performance & Compliance Reports</h3>
                    <p style={{ color: '#858796', fontSize: '14px', marginBottom: '20px' }}>Historical log of all reports submitted by hostel rectors.</p>

                    {loading ? (
                        <div style={{ padding: '50px 0', textAlign: 'center', color: '#858796' }}>
                            <i className="fas fa-spinner fa-spin fa-2x" style={{ marginBottom: '10px' }}></i>
                            <p>Loading operational reports...</p>
                        </div>
                    ) : error ? (
                        <div style={{ padding: '30px', background: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', borderRadius: '8px', textAlign: 'center' }}>
                            <i className="fas fa-exclamation-circle fa-2x" style={{ marginBottom: '10px' }}></i>
                            <p>{error}</p>
                            <button type="button" onClick={fetchReports} className="btn-refresh" style={{ background: '#721c24', marginTop: '10px' }}>
                                Retry Loading
                            </button>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div style={{ padding: '50px 0', textAlign: 'center', color: '#858796', background: 'white', borderRadius: '12px', border: '1px solid #eaecf4' }}>
                            <i className="fas fa-folder-open fa-2x" style={{ marginBottom: '10px', opacity: 0.5 }}></i>
                            <p>No operational reports available.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {filteredReports.map((report) => {
                                const styles = getTypeStyles(report.type);
                                return (
                                    <div key={report._id} className="report-card" style={{ borderLeftColor: styles.color }}>
                                        <div className="report-header">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <span className="priority-badge" style={{ backgroundColor: styles.bg, color: styles.color, border: styles.border }}>
                                                    {report.type || 'Other'}
                                                </span>
                                                <span className="hostel-info">
                                                    {(report.author && report.author.office) || 'N/A'}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '12px', fontWeight: 700, color: getStatusColor(report.status) }}>
                                                {report.status || 'Open'}
                                            </div>
                                        </div>
                                        <div className="report-title">{report.title}</div>
                                        <div className="report-meta">
                                            <span><i className="fas fa-user-tie"></i> Rector: {(report.author && report.author.name) || 'N/A'}</span>
                                            <span><i className="fas fa-calendar-alt"></i> {new Date(report.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="report-detail">{report.content}</div>
                                        {report.attachments && report.attachments.length > 0 && (
                                            <div style={{ marginTop: '12px', borderTop: '1px solid #eaecf4', paddingTop: '8px' }}>
                                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#858796', marginBottom: '5px' }}>ATTACHMENTS:</div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    {report.attachments.map((file, idx) => (
                                                        <a 
                                                            key={idx} 
                                                            href={`${API_BASE_URL}/uploads/${file}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            style={{ color: '#4e73df', textDecoration: 'none', fontSize: '13px' }}
                                                        >
                                                            <i className="fas fa-file-alt"></i> {file}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminReports;
