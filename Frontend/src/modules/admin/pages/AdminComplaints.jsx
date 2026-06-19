import React, { useState } from 'react';
import Header from '../../../components/Header';

const AdminComplaints = () => {
    const [isAllotting, setIsAllotting] = useState(false);
    const [allotmentComplete, setAllotmentComplete] = useState(false);
    const [allotments, setAllotments] = useState([]);

    const commonComplaints = [
        { category: 'Electricity', icon: 'fa-bolt', count: 42, color: '#4e73df', reason: 'Aging wiring and high load during peak hours.', delayReason: 'Shortage of certified electricians for night shifts.' },
        { category: 'Plumber', icon: 'fa-faucet', count: 28, color: '#1cc88a', reason: 'Hard water causing scale buildup in pipes.', delayReason: 'Long procurement time for high-quality replacement fittings.' },
        { category: 'Carpenter', icon: 'fa-hammer', count: 15, color: '#f6c23e', reason: 'Normal wear and tear of old furniture.', delayReason: 'Bulk orders for wood are pending approval.' },
        { category: 'Cleaning', icon: 'fa-broom', count: 35, color: '#e74a3b', reason: 'Staff shortage during semester breaks.', delayReason: 'Contractor payment processing delays.' }
    ];

    const unassignedComplaints = [
        { id: 'C-101', room: '202', issue: 'Main switch sparking', type: 'Electricity', priority: 'High' },
        { id: 'C-102', room: '105', issue: 'Washbasin blockage', type: 'Plumber', priority: 'Medium' },
        { id: 'C-103', room: '310', issue: 'Cupboard hinge broken', type: 'Carpenter', priority: 'Low' },
        { id: 'C-104', room: '404', issue: 'Water seepage from wall', type: 'Plumber', priority: 'High' },
        { id: 'C-105', room: '212', issue: 'Washroom not sanitized', type: 'Cleaning', priority: 'Medium' },
        { id: 'C-106', room: '305', issue: 'Room floor cleaning required', type: 'Cleaning', priority: 'Low' }
    ];

    const workers = {
        'Electricity': ['John Miller (Grade A)', 'David Chen (Grade B)'],
        'Plumber': ['Robert Wilson', 'Samuel Jackson'],
        'Carpenter': ['Mike Ross', 'Harvey Specter'],
        'Cleaning': ['Cleaning Crew A', 'Cleaning Crew B']
    };

    const handleAutoAllot = () => {
        setIsAllotting(true);
        setTimeout(() => {
            const results = unassignedComplaints.map(complaint => ({
                ...complaint,
                worker: workers[complaint.type][Math.floor(Math.random() * workers[complaint.type].length)],
                confidence: (Math.random() * (99 - 95) + 95).toFixed(1) + '%'
            }));
            setAllotments(results);
            setIsAllotting(false);
            setAllotmentComplete(true);
        }, 2000);
    };

    return (
        <>
            <Header title="Complaints Management" />
            <style>{`
                .admin-complaints-container {
                    padding: 30px;
                    max-width: 1600px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .section-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--dark);
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 25px;
                }

                .stat-card {
                    background: var(--white);
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: var(--card-shadow);
                    border-left: 5px solid;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--hover-shadow);
                }

                .stat-info h4 {
                    margin: 0;
                    font-size: 13px;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .stat-info .count {
                    font-size: 32px;
                    font-weight: 700;
                    margin: 8px 0;
                    color: var(--text-dark);
                }

                .stat-icon {
                    font-size: 32px;
                    opacity: 0.2;
                }

                .analysis-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                }

                .analysis-card {
                    background: var(--white);
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: var(--card-shadow);
                }

                .analysis-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .analysis-item {
                    padding: 15px;
                    border-bottom: 1px solid #f8f9fc;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .analysis-item:last-child {
                    border-bottom: none;
                }

                .analysis-item .category-label {
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    padding: 3px 10px;
                    border-radius: 15px;
                    width: fit-content;
                }

                .analysis-item .reason-text {
                    font-size: 14px;
                    color: var(--text-primary);
                    line-height: 1.5;
                }

                .ai-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 35px;
                    box-shadow: 0 10px 30px rgba(78, 115, 223, 0.08);
                    border: 1px solid #eaecf4;
                    position: relative;
                    overflow: hidden;
                }

                .ai-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 5px;
                    background: linear-gradient(90deg, var(--primary), #224abe, var(--primary));
                    background-size: 200% 100%;
                    animation: gradientMove 3s linear infinite;
                }

                @keyframes gradientMove {
                    0% { background-position: 100% 0%; }
                    100% { background-position: -100% 0%; }
                }

                .ai-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                .ai-badge {
                    background: #e3f2fd;
                    color: #1976d2;
                    padding: 6px 15px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-ai {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 12px 28px;
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(78, 115, 223, 0.25);
                }

                .btn-ai:hover {
                    background: var(--primary-dark);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(78, 115, 223, 0.35);
                }

                .btn-ai:disabled {
                    background: var(--secondary);
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .ai-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 25px;
                }

                .ai-table th {
                    text-align: left;
                    padding: 15px;
                    color: var(--text-secondary);
                    font-size: 12px;
                    text-transform: uppercase;
                    border-bottom: 2px solid #f1f3f9;
                    background: #f8f9fc;
                }

                .ai-table td {
                    padding: 18px 15px;
                    border-bottom: 1px solid #f1f3f9;
                    font-size: 14px;
                }

                .pulse {
                    animation: pulse-animation 2s infinite;
                }

                @keyframes pulse-animation {
                    0% { box-shadow: 0 0 0 0px rgba(78, 115, 223, 0.4); }
                    100% { box-shadow: 0 0 0 20px rgba(78, 115, 223, 0); }
                }

                .confidence-badge {
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--success);
                    background: #e6fffa;
                    padding: 3px 10px;
                    border-radius: 15px;
                    text-transform: uppercase;
                }

                @media (max-width: 992px) {
                    .analysis-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="admin-complaints-container">
                {/* AI Allotment Section */}
                <div className="ai-card">
                    <div className="ai-header">
                        <div>
                            <h3 className="section-title" style={{ marginBottom: '5px' }}>
                                <i className="fas fa-robot" style={{ color: '#4e73df' }}></i>
                                AI Smart Allotment System
                            </h3>
                            <p style={{ fontSize: '14px', color: '#858796', margin: 0 }}>Automatically assign optimized workers based on complaint category, skill, and availability.</p>
                        </div>
                        <div className="ai-badge">
                            <i className="fas fa-brain"></i> AI Active
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <button 
                            className={`btn-ai ${isAllotting ? 'pulse' : ''}`} 
                            onClick={handleAutoAllot}
                            disabled={isAllotting}
                        >
                            {isAllotting ? (
                                <><i className="fas fa-circle-notch fa-spin"></i> Analyzing Complaints...</>
                            ) : (
                                <><i className="fas fa-magic"></i> Run AI Auto-Assign</>
                            )}
                        </button>
                        {allotmentComplete && (
                            <button className="btn-ai" style={{ background: '#1cc88a' }} onClick={() => setAllotmentComplete(false)}>
                                <i className="fas fa-check"></i> Commit Assignments
                            </button>
                        )}
                    </div>

                    {allotmentComplete ? (
                        <div className="ai-results-container">
                            <h4 style={{ fontSize: '14px', color: '#5a5c69', marginBottom: '15px' }}>Optimization Results:</h4>
                            <table className="ai-table">
                                <thead>
                                    <tr>
                                        <th>Complaint ID</th>
                                        <th>Category</th>
                                        <th>Assigned Worker</th>
                                        <th>Match Confidence</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allotments.map((item, idx) => (
                                        <tr key={idx}>
                                            <td><strong>{item.id}</strong> (Room {item.room})</td>
                                            <td>{item.type}</td>
                                            <td style={{ color: '#4e73df', fontWeight: 600 }}>{item.worker}</td>
                                            <td><span className="confidence-badge">{item.confidence} Match</span></td>
                                            <td><span className="status-badge status-progress">Pending Sync</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', background: '#f8f9fc', borderRadius: '12px', border: '2px dashed #eaecf4' }}>
                            <i className="fas fa-clipboard-list" style={{ fontSize: '40px', color: '#d1d3e2', marginBottom: '15px' }}></i>
                            <p style={{ color: '#858796', margin: 0 }}>{unassignedComplaints.length} Unassigned complaints detected. Run AI to optimize allotment.</p>
                        </div>
                    )}
                </div>

                {/* Stats Section */}
                <div className="stats-grid">
                    {commonComplaints.map((item, index) => (
                        <div key={index} className="stat-card" style={{ borderLeftColor: item.color }}>
                            <div className="stat-info">
                                <h4>{item.category}</h4>
                                <div className="count">{item.count}</div>
                                <div style={{ fontSize: '12px', color: '#1cc88a' }}>
                                    <i className="fas fa-arrow-up"></i> 12% from last month
                                </div>
                            </div>
                            <div className="stat-icon" style={{ color: item.color }}>
                                <i className={`fas ${item.icon}`}></i>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Analysis Section */}
                <div className="analysis-grid">
                    <div className="analysis-card">
                        <h3 className="section-title">
                            <i className="fas fa-sync-alt" style={{ color: '#4e73df' }}></i>
                            Why Problems Often Occur
                        </h3>
                        <div className="analysis-list">
                            {commonComplaints.map((item, index) => (
                                <div key={index} className="analysis-item">
                                    <span className="category-label" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                                        {item.category}
                                    </span>
                                    <span className="reason-text">{item.reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="analysis-card">
                        <h3 className="section-title">
                            <i className="fas fa-clock" style={{ color: '#e74a3b' }}></i>
                            Why They Aren't Solved Yet
                        </h3>
                        <div className="analysis-list">
                            {commonComplaints.map((item, index) => (
                                <div key={index} className="analysis-item">
                                    <span className="category-label" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                                        {item.category}
                                    </span>
                                    <span className="reason-text">{item.delayReason}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminComplaints;
