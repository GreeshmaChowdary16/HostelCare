import React, { useState } from 'react';
import Header from '../../../components/Header';

function AdminWorkers() {
    // State for complaints
    const [complaints, setComplaints] = useState([
        { id: 1, hostel: 'Girls Hostel A', room: '101', issue: 'Fan not working', type: 'Electrical', status: 'Pending', worker: '' },
        { id: 2, hostel: 'Boys Hostel B', room: '205', issue: 'Leaking tap', type: 'Plumbing', status: 'Pending', worker: '' },
        { id: 3, hostel: 'Girls Hostel C', room: '310', issue: 'Broken window', type: 'Carpentry', status: 'Pending', worker: '' }
    ]);

    // State for Worker Directory
    const [activeRole, setActiveRole] = useState('Electricians');
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);

    const workersData = {
        'Carpenters': [
            { id: 'C1', name: 'Mahesh Kumar', phone: '9876543210', status: 'On Duty' },
            { id: 'C2', name: 'Rahul Singh', phone: '9876543211', status: 'On Leave' }
        ],
        'Electricians': [
            { id: 'E1', name: 'Ramesh Sharma', phone: '9876543212', status: 'On Duty' },
            { id: 'E2', name: 'Sanjay Gupta', phone: '9876543213', status: 'On Duty' }
        ],
        'Plumbers': [
            { id: 'P1', name: 'Suresh Verma', phone: '9876543214', status: 'On Duty' },
            { id: 'P2', name: 'Amit Patel', phone: '9876543215', status: 'Off Duty' }
        ]
    };

    const supervisorsData = [
        { 
            id: 'S1', name: 'Sunita Devi', phone: '9876543216', status: 'On Duty', 
            hostel: 'Girls Hostel A', totalCleaners: 12, washroomCleaners: 5, roomCleaners: 7 
        },
        { 
            id: 'S2', name: 'Meena Kumari', phone: '9876543217', status: 'On Duty', 
            hostel: 'Girls Hostel B', totalCleaners: 10, washroomCleaners: 4, roomCleaners: 6 
        },
        { 
            id: 'S3', name: 'Rajni Kant', phone: '9876543218', status: 'On Duty', 
            hostel: 'Boys Hostel A', totalCleaners: 15, washroomCleaners: 6, roomCleaners: 9 
        }
    ];

    const handleAllotWorker = (complaintId, workerName) => {
        setComplaints(complaints.map(c => 
            c.id === complaintId ? { ...c, worker: workerName, status: workerName ? 'Assigned' : 'Pending' } : c
        ));
    };

    return (
        <>
            <Header title="Worker Management" />
            <style>{`
                .workers-container {
                    padding: 30px;
                    max-width: 1600px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }
                .worker-card {
                    background: var(--white);
                    border-radius: 12px;
                    padding: 30px;
                    box-shadow: var(--card-shadow);
                }
                .section-title {
                    margin: 0 0 10px 0;
                    color: var(--dark);
                    font-weight: 700;
                    font-size: 20px;
                }
                .section-desc {
                    color: var(--text-secondary);
                    margin-bottom: 25px;
                    font-size: 14px;
                }
                .custom-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .custom-table th, .custom-table td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid #f1f3f9;
                }
                .custom-table th {
                    color: var(--text-secondary);
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 12px;
                    background: #f8f9fc;
                }
                .worker-select {
                    padding: 8px 12px;
                    border-radius: 6px;
                    border: 1px solid #eaecf4;
                    background: #fff;
                    color: var(--text-primary);
                    width: 100%;
                    font-size: 14px;
                }
                
                .role-tabs {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 25px;
                    overflow-x: auto;
                    padding-bottom: 5px;
                }
                .role-tab {
                    padding: 10px 20px;
                    background: #fff;
                    border: 1px solid #eaecf4;
                    border-radius: 10px;
                    color: var(--text-secondary);
                    cursor: pointer;
                    white-space: nowrap;
                    font-weight: 600;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .role-tab:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                }
                .role-tab.active {
                    background: var(--primary);
                    color: #fff;
                    border-color: var(--primary);
                    box-shadow: 0 4px 8px rgba(78, 115, 223, 0.2);
                }
                .worker-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 25px;
                }
                .worker-item-card {
                    padding: 25px;
                    background: #fff;
                    border: 1px solid #eaecf4;
                    border-radius: 12px;
                    transition: all 0.3s;
                }
                .worker-item-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--hover-shadow);
                    border-color: var(--primary-soft);
                }
                .clickable-card { cursor: pointer; }
                
                .worker-name {
                    font-weight: 700;
                    color: var(--text-dark);
                    font-size: 18px;
                    margin-bottom: 8px;
                }
                .worker-info {
                    color: var(--text-secondary);
                    font-size: 14px;
                    margin-bottom: 20px;
                    line-height: 1.6;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    background: #fff;
                    padding: 35px;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    position: relative;
                }
                .close-btn {
                    position: absolute;
                    top: 20px;
                    right: 25px;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--text-secondary);
                }
                .stat-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #f8f9fc;
                }
                .stat-label { color: var(--text-secondary); font-weight: 600; }
                .stat-value { color: var(--text-dark); font-weight: 700; }
            `}</style>
            
            <div className="workers-container">
                {/* Section 1: Allotment */}
                <div className="worker-card">
                    <h3 className="section-title">Allot Workers to Complaints</h3>
                    
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Hostel</th>
                                <th>Room</th>
                                <th>Issue</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Assign Worker</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map(complaint => (
                                <tr key={complaint.id}>
                                    <td>{complaint.hostel}</td>
                                    <td>{complaint.room}</td>
                                    <td>{complaint.issue}</td>
                                    <td>{complaint.type}</td>
                                    <td>
                                        <span className={`status-chip ${complaint.status === 'Pending' ? 'status-pending' : 'status-assigned'}`}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select 
                                            className="worker-select"
                                            value={complaint.worker}
                                            onChange={(e) => handleAllotWorker(complaint.id, e.target.value)}
                                        >
                                            <option value="">-- Select Worker --</option>
                                            {/* Logic to show relevant workers for allotment */}
                                            {workersData[complaint.type + 's']?.map(w => (
                                                <option key={w.id} value={w.name}>{w.name}</option>
                                            ))}
                                            {complaint.type === 'Cleaning' && supervisorsData.map(w => (
                                                <option key={w.id} value={w.name}>{w.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Section 2: Cleaning Supervisors (Standalone) */}
                <div className="worker-card">
                    <h3 className="section-title">Cleaning Supervisors</h3>
                    
                    <div className="worker-grid">
                        {supervisorsData.map(worker => (
                            <div 
                                key={worker.id} 
                                className="worker-item-card clickable-card"
                                onClick={() => setSelectedSupervisor(worker)}
                            >
                                <div className="worker-name">{worker.name}</div>
                                <div className="worker-info">
                                    <i className="fas fa-id-badge" style={{ width: '20px' }}></i> ID: {worker.id}<br/>
                                    <i className="fas fa-phone" style={{ width: '20px' }}></i> {worker.phone}<br/>
                                    <i className="fas fa-hotel" style={{ width: '20px' }}></i> {worker.hostel}
                                </div>
                                <span className={`status-chip status-${worker.status.toLowerCase().replace(' ', '-')}`}>
                                    {worker.status}
                                </span>
                                <div style={{ marginTop: '15px', fontSize: '12px', color: '#4e73df', fontWeight: '700' }}>
                                    Staff Details <i className="fas fa-chevron-right"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3: Worker Directory (Tabs) */}
                <div className="worker-card">
                    <h3 className="section-title">Maintenance Directory</h3>
                    
                    <div className="role-tabs">
                        {Object.keys(workersData).map(role => (
                            <div 
                                key={role} 
                                className={`role-tab ${activeRole === role ? 'active' : ''}`}
                                onClick={() => setActiveRole(role)}
                            >
                                {role}
                            </div>
                        ))}
                    </div>

                    <div className="worker-grid">
                        {workersData[activeRole].map(worker => (
                            <div key={worker.id} className="worker-item-card">
                                <div className="worker-name">{worker.name}</div>
                                <div className="worker-info">
                                    <i className="fas fa-id-badge" style={{ width: '20px' }}></i> ID: {worker.id}<br/>
                                    <i className="fas fa-phone" style={{ width: '20px' }}></i> {worker.phone}
                                </div>
                                <span className={`status-chip status-${worker.status.toLowerCase().replace(' ', '-')}`}>
                                    {worker.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Supervisor Details Modal */}
            {selectedSupervisor && (
                <div className="modal-overlay" onClick={() => setSelectedSupervisor(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setSelectedSupervisor(null)}>&times;</span>
                        <h3 style={{ color: '#4e73df', marginBottom: '5px' }}>Supervisor Details</h3>
                        <p style={{ color: '#858796', marginBottom: '20px' }}>Head of Cleaning Staff - {selectedSupervisor.hostel}</p>
                        
                        <div className="stat-row">
                            <span className="stat-label">Supervisor Name</span>
                            <span className="stat-value">{selectedSupervisor.name}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Employee ID</span>
                            <span className="stat-value">{selectedSupervisor.id}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Contact Number</span>
                            <span className="stat-value">{selectedSupervisor.phone}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Hostel Assigned</span>
                            <span className="stat-value">{selectedSupervisor.hostel}</span>
                        </div>
                        
                        <div style={{ marginTop: '25px', padding: '15px', background: '#f8f9fc', borderRadius: '10px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#5a5c69', fontSize: '15px' }}>Cleaning Staff Breakdown</h4>
                            <div className="stat-row">
                                <span className="stat-label">Total Cleaners</span>
                                <span className="stat-value" style={{ color: '#4e73df', fontSize: '18px' }}>{selectedSupervisor.totalCleaners}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Washroom Cleaners</span>
                                <span className="stat-value">{selectedSupervisor.washroomCleaners}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Room Cleaners</span>
                                <span className="stat-value">{selectedSupervisor.roomCleaners}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminWorkers;
