import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

function AdminRectors() {
    const [activeTab, setActiveTab] = useState('male');
    const [selectedRector, setSelectedRector] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [rectorsList, setRectorsList] = useState([]);
    const [newRector, setNewRector] = useState({ name: '', email: '', password: 'password1', phone: '', office: 'Hostel Office', staffId: '', shift: 'Day' });
    const [showAddModal, setShowAddModal] = useState(false);
    const [msg, setMsg] = useState('');

    const [leaveApplications, setLeaveApplications] = useState([]);

    const fetchRectors = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/rectors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRectorsList(data);
                setLeaveApplications(data.flatMap((rector) => (rector.leaveApplications || []).map((leave) => ({
                    id: leave._id,
                    rectorId: rector._id,
                    rectorName: rector.name,
                    date: `${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()}`,
                    reason: leave.reason,
                    status: leave.status,
                    note: leave.note,
                }))));
            }
        } catch (err) {
            console.error('Error fetching rectors:', err);
        }
    };

    useEffect(() => {
        fetchRectors();
    }, []);

    const handleCreateRector = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/rectors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newRector)
            });
            const data = await res.json();
            if (res.ok) {
                setMsg('Rector created successfully!');
                setShowAddModal(false);
                setNewRector({ name: '', email: '', password: 'password1', phone: '', office: 'Hostel Office', staffId: '', shift: 'Day' });
                fetchRectors();
            } else {
                setMsg(data.message || 'Failed to create rector');
            }
        } catch (err) {
            setMsg('Error creating rector');
        }
    };

    const handleLeaveAction = async (application, action) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/rectors/${application.rectorId}/leaves/${application.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: action }),
            });
            if (response.ok) {
                setLeaveApplications((previous) => previous.map((app) => app.id === application.id ? { ...app, status: action } : app));
            } else {
                const data = await response.json();
                setMsg(data.message || 'Could not update leave application.');
            }
        } catch (error) {
            console.error('Error updating rector leave:', error);
            setMsg('Could not update leave application.');
        }
    };

    const filteredRectors = rectorsList.filter(rector => {
        const q = searchQuery.toLowerCase();
        return (rector.name || '').toLowerCase().includes(q) || (rector.email || '').toLowerCase().includes(q);
    });

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedRector(null);
        setSearchQuery('');
    };

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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#5a5c69' }}>
                                Rectors List ({filteredRectors.length})
                            </h3>
                            <button 
                                onClick={() => setShowAddModal(!showAddModal)}
                                style={{ background: '#4e73df', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                + Add Rector
                            </button>
                        </div>

                        {msg && <div style={{ padding: '10px', marginBottom: '15px', background: '#e3fdf4', color: '#1cc88a', borderRadius: '6px' }}>{msg}</div>}

                        {showAddModal && (
                            <form onSubmit={handleCreateRector} style={{ background: '#f8f9fc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 10px 0' }}>Add New Rector</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                    <input type="text" placeholder="Full Name" value={newRector.name} onChange={e => setNewRector({...newRector, name: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input type="email" placeholder="Email Address" value={newRector.email} onChange={e => setNewRector({...newRector, email: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input type="text" placeholder="Phone Number" value={newRector.phone} onChange={e => setNewRector({...newRector, phone: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input type="text" placeholder="Office Location" value={newRector.office} onChange={e => setNewRector({...newRector, office: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input type="text" placeholder="Staff ID" value={newRector.staffId} onChange={e => setNewRector({...newRector, staffId: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <select value={newRector.shift} onChange={e => setNewRector({...newRector, shift: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Day</option><option>Night</option><option>Day/Night</option></select>
                                </div>
                                <button type="submit" style={{ background: '#1cc88a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Rector</button>
                            </form>
                        )}

                        <div className="search-container">
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i className="fas fa-search search-icon"></i>
                        </div>

                        {filteredRectors.length > 0 ? (
                            filteredRectors.map(rector => (
                                <div 
                                    key={rector._id || rector.id} 
                                    className={`rector-item ${selectedRector?._id === rector._id ? 'selected' : ''}`}
                                    onClick={() => setSelectedRector(rector)}
                                >
                                    <div className="rector-avatar">
                                        <i className="fas fa-user-shield"></i>
                                    </div>
                                    <div>
                                        <div className="rector-name">{rector.name}</div>
                                        <div className="rector-status">{rector.office || rector.email}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <span className="status-badge status-present">
                                            Active
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
                                        <button className="btn-accept" onClick={() => handleLeaveAction(app, 'Approved')}>Accept</button>
                                        <button className="btn-reject" onClick={() => handleLeaveAction(app, 'Rejected')}>Reject</button>
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
