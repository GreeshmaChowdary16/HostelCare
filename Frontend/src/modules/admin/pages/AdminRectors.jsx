import React, { useState } from 'react';
import Header from '../../../components/Header';

function AdminRectors() {
    const [activeTab, setActiveTab] = useState('male');
    const [selectedRector, setSelectedRector] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [leaveApplications, setLeaveApplications] = useState([
        { id: 1, rectorName: 'Suresh Verma', type: 'male', date: '2026-05-12 to 2026-05-15', reason: 'Family medical emergency', status: 'Pending' },
        { id: 2, rectorName: 'Kavita Patel', type: 'female', date: '2026-05-10', reason: 'Personal work', status: 'Pending' },
    ]);

    const handleLeaveAction = (id, action) => {
        setLeaveApplications(leaveApplications.map(app => 
            app.id === id ? { ...app, status: action } : app
        ));
    };

    const rectorsData = {
        male: [
            { id: 'REC-M01', name: 'Ramesh Kumar', hostel: 'Boys Hostel A', phone: '+91 9876543210', email: 'ramesh@hostel.edu', status: 'Present' },
            { id: 'REC-M02', name: 'Suresh Verma', hostel: 'Boys Hostel B', phone: '+91 9876543211', email: 'suresh@hostel.edu', status: 'Absent' },
            { id: 'REC-M03', name: 'Vikram Singh', hostel: 'Boys Hostel C', phone: '+91 9876543212', email: 'vikram@hostel.edu', status: 'Present' },
        ],
        female: [
            { id: 'REC-F01', name: 'Priya Sharma', hostel: 'Girls Hostel A', phone: '+91 9876543213', email: 'priya@hostel.edu', status: 'Present' },
            { id: 'REC-F02', name: 'Anita Desai', hostel: 'Girls Hostel B', phone: '+91 9876543214', email: 'anita@hostel.edu', status: 'Present' },
            { id: 'REC-F03', name: 'Kavita Patel', hostel: 'Girls Hostel C', phone: '+91 9876543215', email: 'kavita@hostel.edu', status: 'Absent' },
        ]
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedRector(null);
        setSearchQuery('');
    };

    const currentRectors = rectorsData[activeTab].filter(rector => 
        rector.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        rector.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Header title="Rectors Management" />
            <style>{`
                .rectors-container {
                    padding: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .tabs-header {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 25px;
                    border-bottom: 2px solid #eaecf4;
                    padding-bottom: 10px;
                }
                .tab-btn {
                    background: none;
                    border: none;
                    padding: 10px 20px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #858796;
                    cursor: pointer;
                    position: relative;
                }
                .tab-btn.active {
                    color: #4e73df;
                }
                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -12px;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: #4e73df;
                    border-radius: 3px 3px 0 0;
                }
                .main-layout {
                    display: flex;
                    gap: 30px;
                }
                .list-section {
                    flex: 1;
                    background: #fff;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                }
                .search-container {
                    margin-bottom: 20px;
                    position: relative;
                }
                .search-input {
                    width: 100%;
                    padding: 10px 40px 10px 15px;
                    border: 1px solid #d1d3e2;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.2s;
                }
                .search-input:focus {
                    outline: none;
                    border-color: #4e73df;
                    box-shadow: 0 0 0 2px rgba(78, 115, 223, 0.1);
                }
                .search-icon {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #b7b9cc;
                }
                .rector-item {
                    padding: 15px;
                    border: 1px solid #eaecf4;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: background-color 0.2s;
                }
                .rector-item:hover {
                    background-color: #f8f9fc;
                }
                .rector-item.selected {
                    background-color: #e8f0fe;
                    border-color: #4e73df;
                }
                .rector-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #eaecf4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #5a5c69;
                    font-size: 18px;
                }
                .rector-name {
                    font-weight: 600;
                    color: #333;
                    font-size: 15px;
                }
                .rector-status {
                    font-size: 12px;
                    color: #858796;
                }
                .details-section {
                    width: 350px;
                    flex-shrink: 0;
                }
                .details-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 30px 20px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    border-top: 4px solid #4e73df;
                    text-align: center;
                }
                .details-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: #e8f0fe;
                    color: #4e73df;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 35px;
                    margin: 0 auto 20px;
                }
                .details-name {
                    font-size: 20px;
                    font-weight: 700;
                    color: #333;
                    margin: 0 0 5px 0;
                }
                .details-role {
                    color: #858796;
                    font-size: 14px;
                    margin-bottom: 25px;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: 15px;
                    text-align: left;
                    font-size: 14px;
                }
                .info-label {
                    color: #5a5c69;
                    font-weight: 700;
                }
                .info-value {
                    color: #5a5c69;
                    font-weight: 500;
                    text-align: right;
                }
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 700;
                }
                .status-present { background: #e3fdf4; color: #1cc88a; }
                .status-absent { background: #fbecec; color: #e74a3b; }
                .empty-state {
                    background: #fff;
                    border-radius: 12px;
                    padding: 40px;
                    text-align: center;
                    color: #858796;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                }
                
                .leave-section-title {
                    margin: 40px 0 20px 0;
                    color: #5a5c69;
                    font-size: 20px;
                    border-bottom: 2px solid #eaecf4;
                    padding-bottom: 10px;
                }
                .leave-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    margin-bottom: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-left: 4px solid #f6c23e;
                }
                .leave-card.approved { border-left-color: #1cc88a; }
                .leave-card.rejected { border-left-color: #e74a3b; }
                .leave-info { flex: 1; }
                .leave-name { font-weight: 700; color: #333; font-size: 16px; margin-bottom: 5px; }
                .leave-dates { color: #858796; font-size: 13px; margin-bottom: 10px; }
                .leave-reason { color: #5a5c69; font-size: 14px; }
                .leave-actions { display: flex; gap: 10px; margin-left: 20px; }
                .btn-accept {
                    background: #1cc88a; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;
                }
                .btn-reject {
                    background: #e74a3b; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;
                }
                .leave-status-badge {
                    padding: 6px 12px; border-radius: 15px; font-weight: bold; font-size: 13px;
                }

                @media (max-width: 992px) {
                    .main-layout { flex-direction: column; }
                    .details-section { width: 100%; }
                }
            `}</style>
            
            <div className="rectors-container">
                <div className="tabs-header">
                    <button 
                        className={`tab-btn ${activeTab === 'male' ? 'active' : ''}`}
                        onClick={() => handleTabChange('male')}
                    >
                        Male Rectors
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'female' ? 'active' : ''}`}
                        onClick={() => handleTabChange('female')}
                    >
                        Female Rectors
                    </button>
                </div>

                <div className="main-layout">
                    <div className="list-section">
                        <h3 style={{ margin: '0 0 20px 0', color: '#5a5c69' }}>
                            {activeTab === 'male' ? 'Male Rectors List' : 'Female Rectors List'}
                        </h3>
                        <div className="search-container">
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Search by name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i className="fas fa-search search-icon"></i>
                        </div>

                        {currentRectors.length > 0 ? (
                            currentRectors.map(rector => (
                                <div 
                                    key={rector.id} 
                                    className={`rector-item ${selectedRector?.id === rector.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedRector(rector)}
                                >
                                    <div className="rector-avatar">
                                        <i className={activeTab === 'male' ? 'fas fa-male' : 'fas fa-female'}></i>
                                    </div>
                                    <div>
                                        <div className="rector-name">{rector.name}</div>
                                        <div className="rector-status">{rector.hostel}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <span className={`status-badge ${rector.status === 'Present' ? 'status-present' : 'status-absent'}`}>
                                            {rector.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#858796' }}>
                                <i className="fas fa-search" style={{ fontSize: '32px', marginBottom: '15px', display: 'block', opacity: 0.5 }}></i>
                                <p>No rectors found matching "<strong>{searchQuery}</strong>"</p>
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    style={{ background: 'none', border: 'none', color: '#4e73df', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="details-section">
                        {selectedRector ? (
                            <div className="details-card">
                                <div className="details-avatar">
                                    <i className={activeTab === 'male' ? 'fas fa-male' : 'fas fa-female'}></i>
                                </div>
                                <h3 className="details-name">{selectedRector.name}</h3>
                                <div className="details-role">Rector - {selectedRector.hostel}</div>
                                
                                <div className="info-grid">
                                    <span className="info-label">Rector ID</span>
                                    <span className="info-value">{selectedRector.id}</span>

                                    <span className="info-label">Hostel</span>
                                    <span className="info-value">{selectedRector.hostel}</span>

                                    <span className="info-label">Contact</span>
                                    <span className="info-value">{selectedRector.phone}</span>

                                    <span className="info-label">Email</span>
                                    <span className="info-value" style={{ fontSize: '13px' }}>{selectedRector.email}</span>

                                    <span className="info-label">Status</span>
                                    <span className={`info-value ${selectedRector.status === 'Present' ? 'status-present' : 'status-absent'}`} style={{ padding: '2px 8px', borderRadius: '12px', background: 'transparent' }}>
                                        {selectedRector.status}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <i className="fas fa-hand-pointer" style={{ fontSize: '40px', color: '#dddfeb', marginBottom: '15px' }}></i>
                                <h4>Select a Rector</h4>
                                <p>Click on a rector's name from the list to view their detailed information.</p>
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="leave-section-title">Rectors Leave Applications</h3>
                <div>
                    {leaveApplications.map(app => (
                        <div key={app.id} className={`leave-card ${app.status.toLowerCase()}`}>
                            <div className="leave-info">
                                <div className="leave-name">{app.rectorName}</div>
                                <div className="leave-dates"><i className="far fa-calendar-alt"></i> {app.date}</div>
                                <div className="leave-reason">{app.reason}</div>
                            </div>
                            <div className="leave-actions">
                                {app.status === 'Pending' ? (
                                    <>
                                        <button className="btn-accept" onClick={() => handleLeaveAction(app.id, 'Approved')}>Accept</button>
                                        <button className="btn-reject" onClick={() => handleLeaveAction(app.id, 'Rejected')}>Reject</button>
                                    </>
                                ) : (
                                    <span className="leave-status-badge" style={{ 
                                        background: app.status === 'Approved' ? '#e3fdf4' : '#fbecec',
                                        color: app.status === 'Approved' ? '#1cc88a' : '#e74a3b'
                                    }}>
                                        {app.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}

export default AdminRectors;
