import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

function AdminRectors() {
    // Data States
    const [rectors, setRectors] = useState([]);
    const [selectedRector, setSelectedRector] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');


    // Loading & Error States
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal States
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form States
    const [newRector, setNewRector] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        office: '',
        bio: ''
    });

    const [editingRectorData, setEditingRectorData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        office: '',
        bio: ''
    });

    // Fetch Rectors Data
    const fetchRectors = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing. Please sign in again.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/rectors`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error('Unauthorized');
                if (response.status === 403) throw new Error('Forbidden');
                throw new Error(`Server returned status ${response.status}`);
            }

            const data = await response.json();
            setRectors(data || []);

            // Auto-select or preserve currently selected rector if it still exists
            if (selectedRector) {
                const updatedSelected = (data || []).find(r => r._id === selectedRector._id);
                setSelectedRector(updatedSelected || null);
            }
        } catch (err) {
            console.error('Fetch rectors error:', err);
            setError(err.message === 'Unauthorized' ? 'Session expired. Please log in again.' : 'Failed to connect to the server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRectors();
    }, []);

    // Filter Rectors by Search Query
    const filteredRectors = rectors.filter(rector =>
        rector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rector.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rector.office.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Aggregate leave applications from all rectors
    const allLeaves = [];
    rectors.forEach(rector => {
        if (rector.leaveApplications && rector.leaveApplications.length > 0) {
            rector.leaveApplications.forEach(leave => {
                allLeaves.push({
                    ...leave,
                    rectorId: rector._id,
                    rectorName: rector.name
                });
            });
        }
    });

    // Sort leave applications by appliedAt descending
    allLeaves.sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0));

    // Handle Leave Application Approval/Rejection
    const handleLeaveAction = async (rectorId, leaveId, status) => {
        if (!window.confirm(`Are you sure you want to set this leave application to ${status}?`)) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/rectors/${rectorId}/leaves/${leaveId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message || 'Leave status updated successfully.');
                fetchRectors();
            } else {
                alert(data.message || 'Failed to update leave status.');
            }
        } catch (err) {
            console.error('Error updating leave status:', err);
            alert('Network error. Unable to update leave status.');
        }
    };

    // Handle Add Rector Submit
    const handleAddRectorSubmit = async (e) => {
        e.preventDefault();
        if (!newRector.name.trim() || !newRector.email.trim()) {
            alert('Name and Email are required.');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/rectors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newRector.name.trim(),
                    email: newRector.email.trim(),
                    password: newRector.password || undefined,
                    phone: newRector.phone.trim(),
                    office: newRector.office.trim(),
                    bio: newRector.bio.trim()
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Rector created successfully!');
                setAddModalOpen(false);
                setNewRector({ name: '', email: '', password: '', phone: '', office: '', bio: '' });
                fetchRectors();
            } else {
                alert(data.message || 'Failed to create rector.');
            }
        } catch (err) {
            console.error('Add rector error:', err);
            alert('Network error. Could not create rector.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open Edit Modal & Populate Form
    const openEditModal = () => {
        if (!selectedRector) return;
        setEditingRectorData({
            name: selectedRector.name,
            email: selectedRector.email,
            password: '', // Blank by default, only updated if entered
            phone: selectedRector.phone || '',
            office: selectedRector.office || '',
            bio: selectedRector.bio || ''
        });
        setEditModalOpen(true);
    };

    // Handle Edit Rector Submit
    const handleEditRectorSubmit = async (e) => {
        e.preventDefault();
        if (!editingRectorData.name.trim() || !editingRectorData.email.trim()) {
            alert('Name and Email are required.');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            const payload = {
                name: editingRectorData.name.trim(),
                email: editingRectorData.email.trim(),
                phone: editingRectorData.phone.trim(),
                office: editingRectorData.office.trim(),
                bio: editingRectorData.bio.trim()
            };
            if (editingRectorData.password) {
                payload.password = editingRectorData.password;
            }

            const response = await fetch(`${API_BASE_URL}/rectors/${selectedRector._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
                alert('Rector updated successfully!');
                setEditModalOpen(false);
                fetchRectors();
            } else {
                alert(data.message || 'Failed to update rector.');
            }
        } catch (err) {
            console.error('Edit rector error:', err);
            alert('Network error. Could not update rector.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Delete Rector
    const handleDeleteRector = async () => {
        if (!selectedRector) return;
        if (!window.confirm(`Are you sure you want to permanently delete rector ${selectedRector.name}?`)) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/rectors/${selectedRector._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                alert('Rector deleted successfully.');
                setSelectedRector(null);
                fetchRectors();
            } else {
                alert(data.message || 'Failed to delete rector.');
            }
        } catch (err) {
            console.error('Delete rector error:', err);
            alert('Network error. Could not delete rector.');
        }
    };

    return (
        <>
            <Header title="Rectors Management" />
            <style>{`
                .rectors-container {
                    padding: 30px;
                    max-width: 1300px;
                    margin: 0 auto;
                }

                .main-layout {
                    display: flex;
                    gap: 30px;
                    align-items: flex-start;
                }

                .list-section {
                    flex: 1;
                    background: #fff;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                }

                .search-bar-row {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .search-container {
                    position: relative;
                    flex: 1;
                }

                .search-input {
                    width: 100%;
                    padding: 10px 40px 10px 15px;
                    border: 1px solid #d1d3e2;
                    border-radius: 8px;
                    font-size: 14px;
                    outline: none;
                }

                .search-input:focus {
                    border-color: #4e73df;
                }

                .search-icon {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #b7b9cc;
                }

                .btn-add {
                    background: #4e73df;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-add:hover {
                    background: #2e59d9;
                }

                .rectors-list {
                    max-height: 500px;
                    overflow-y: auto;
                    padding-right: 5px;
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
                    transition: all 0.2s;
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
                    color: #4e73df;
                    font-size: 18px;
                    overflow: hidden;
                }

                .rector-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
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
                    width: 400px;
                    flex-shrink: 0;
                }

                .details-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 30px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    border-top: 4px solid #4e73df;
                    text-align: center;
                }

                .details-avatar {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    background: #e8f0fe;
                    color: #4e73df;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    margin: 0 auto 20px;
                    overflow: hidden;
                    border: 3px solid #fff;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }

                .details-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .details-name {
                    font-size: 22px;
                    font-weight: 700;
                    color: #333;
                    margin: 0 0 5px;
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
                    margin-bottom: 25px;
                }

                .info-label {
                    color: #858796;
                    font-weight: 700;
                }

                .info-value {
                    color: #5a5c69;
                    font-weight: 600;
                    text-align: right;
                }

                .details-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }

                .btn-edit-action {
                    background: #f6c23e;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 13px;
                }

                .btn-edit-action:hover { background: #e0b034; }

                .btn-delete-action {
                    background: #e74a3b;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 13px;
                }

                .btn-delete-action:hover { background: #be2e21; }

                .empty-state {
                    background: #fff;
                    border-radius: 12px;
                    padding: 40px 20px;
                    text-align: center;
                    color: #858796;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                }

                .leave-section-title {
                    margin: 40px 0 20px;
                    color: #5a5c69;
                    font-size: 20px;
                    border-bottom: 2px solid #eaecf4;
                    padding-bottom: 10px;
                    font-weight: 700;
                }

                .leave-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 20px 25px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    margin-bottom: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-left: 5px solid #f6c23e;
                }

                .leave-card.approved { border-left-color: #1cc88a; }
                .leave-card.rejected { border-left-color: #e74a3b; }
                
                .leave-info { flex: 1; }
                .leave-name { font-weight: 700; color: #333; font-size: 16px; margin-bottom: 5px; }
                .leave-dates { color: #858796; font-size: 13px; margin-bottom: 8px; }
                .leave-reason { color: #5a5c69; font-size: 14px; }

                .leave-actions { display: flex; gap: 10px; margin-left: 20px; }

                .btn-accept {
                    background: #1cc88a; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 12px;
                }
                .btn-accept:hover { background: #17a673; }

                .btn-reject {
                    background: #e74a3b; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 12px;
                }
                .btn-reject:hover { background: #be2e21; }

                .leave-status-badge {
                    padding: 6px 12px; border-radius: 15px; font-weight: bold; font-size: 12px; text-transform: uppercase;
                }

                .status-message {
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 25px;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .status-error { background: #fff5f5; color: #e74a3b; border: 1px solid #fed7d7; }

                /* Modals Styling */
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
                    z-index: 1200;
                    padding: 15px;
                }

                .modal-content {
                    background: #fff;
                    border-radius: 12px;
                    padding: 30px;
                    width: 90%;
                    max-width: 550px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    animation: fadeIn 0.3s ease-out;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e3e6f0;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }

                .modal-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #4e73df;
                    margin: 0;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #858796;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .form-group label {
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    color: #4e73df;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                }

                .form-control {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #d1d3e2;
                    border-radius: 6px;
                    font-size: 14px;
                    outline: none;
                    background: #fff;
                    font-family: inherit;
                }

                .form-control:focus {
                    border-color: #4e73df;
                }

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    border-top: 1px solid #e3e6f0;
                    padding-top: 15px;
                    margin-top: 20px;
                }

                .btn-cancel {
                    background: #858796;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .btn-cancel:hover { background: #717384; }

                .btn-submit {
                    background: #4e73df;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .btn-submit:hover { background: #2e59d9; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .main-layout { flex-direction: column; }
                    .details-section { width: 100%; }
                }
            `}</style>

            <div className="rectors-container">
                {/* Error Banner with Retry */}
                {error && (
                    <div className="status-message status-error">
                        <span>{error}</span>
                        <button className="btn-delete-action" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={fetchRectors}>
                            Retry Loading
                        </button>
                    </div>
                )}

                <div className="main-layout">
                    {/* Left Column: Rectors List */}
                    <div className="list-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#5a5c69', fontWeight: 700 }}>Hostel Rectors</h3>
                            <button className="btn-add" onClick={() => setAddModalOpen(true)}>
                                <i className="fas fa-plus"></i> Add Rector
                            </button>
                        </div>

                        <div className="search-bar-row">
                            <div className="search-container">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search by name, email, or hostel..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <i className="fas fa-search search-icon"></i>
                            </div>
                        </div>

                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#858796' }}>
                                <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
                                <p>Loading rectors directory...</p>
                            </div>
                        ) : filteredRectors.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#858796' }}>
                                <i className="fas fa-user-slash" style={{ fontSize: '48px', color: '#dddfeb', marginBottom: '15px' }}></i>
                                <p style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>No rectors found.</p>
                            </div>
                        ) : (
                            <div className="rectors-list">
                                {filteredRectors.map(rector => (
                                    <div
                                        key={rector._id}
                                        className={`rector-item ${selectedRector?._id === rector._id ? 'selected' : ''}`}
                                        onClick={() => setSelectedRector(rector)}
                                    >
                                        <div className="rector-avatar">
                                            {rector.profileImage ? (
                                                <img src={rector.profileImage} alt={rector.name} />
                                            ) : (
                                                <i className="fas fa-user-tie"></i>
                                            )}
                                        </div>
                                        <div>
                                            <div className="rector-name">{rector.name}</div>
                                            <div className="rector-status">{rector.office || 'Hostel Care'}</div>
                                        </div>
                                        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#858796' }}>
                                            {rector.phone || 'No Contact'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Selected Rector Details */}
                    <div className="details-section">
                        {selectedRector ? (
                            <div className="details-card">
                                <div className="details-avatar">
                                    {selectedRector.profileImage ? (
                                        <img src={selectedRector.profileImage} alt={selectedRector.name} />
                                    ) : (
                                        <i className="fas fa-user-tie"></i>
                                    )}
                                </div>
                                <h3 className="details-name">{selectedRector.name}</h3>
                                <div className="details-role">Hostel Rector</div>

                                <div className="info-grid">
                                    <span className="info-label">Rector ID</span>
                                    <span className="info-value">{selectedRector._id.substring(selectedRector._id.length - 8).toUpperCase()}</span>

                                    <span className="info-label">Hostel Assigned</span>
                                    <span className="info-value">{selectedRector.office || 'N/A'}</span>

                                    <span className="info-label">Phone</span>
                                    <span className="info-value">{selectedRector.phone || 'N/A'}</span>

                                    <span className="info-label">Email</span>
                                    <span className="info-value" style={{ wordBreak: 'break-all' }}>{selectedRector.email}</span>
                                </div>

                                {selectedRector.bio && (
                                    <div style={{ background: '#f8f9fc', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#5a5c69', fontStyle: 'italic', marginBottom: '25px', textAlign: 'left' }}>
                                        <strong>Bio:</strong> {selectedRector.bio}
                                    </div>
                                )}

                                <div className="details-actions">
                                    <button className="btn-edit-action" onClick={openEditModal}>
                                        <i className="fas fa-edit"></i> Edit Details
                                    </button>
                                    <button className="btn-delete-action" onClick={handleDeleteRector}>
                                        <i className="fas fa-trash-alt"></i> Delete
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <i className="fas fa-hand-pointer" style={{ fontSize: '40px', color: '#dddfeb', marginBottom: '15px' }}></i>
                                <h4>Select a Rector</h4>
                                <p>Click on a rector's name from the list to view their detailed profile, manage info, or process edits.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Leave Applications Section */}
                <h3 className="leave-section-title"><i className="fas fa-plane-departure"></i> Rectors Leave Applications</h3>
                {allLeaves.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '30px', color: '#858796' }}>
                        <p style={{ margin: 0 }}>No leave applications submitted by any rectors.</p>
                    </div>
                ) : (
                    <div>
                        {allLeaves.map((app, index) => (
                            <div key={app._id || index} className={`leave-card ${app.status.toLowerCase()}`}>
                                <div className="leave-info">
                                    <div className="leave-name">{app.rectorName}</div>
                                    <div className="leave-dates">
                                        <i className="far fa-calendar-alt"></i> {new Date(app.startDate).toLocaleDateString('en-GB')} to {new Date(app.endDate).toLocaleDateString('en-GB')}
                                        <span style={{ marginLeft: '15px', color: '#b7b9cc', fontSize: '11px' }}>
                                            Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB') : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="leave-reason"><strong>Reason:</strong> {app.reason}</div>
                                    {app.note && <div style={{ fontSize: '12px', color: '#858796', marginTop: '5px' }}><strong>Note:</strong> {app.note}</div>}
                                </div>
                                <div className="leave-actions">
                                    {app.status === 'Pending' ? (
                                        <>
                                            <button className="btn-accept" onClick={() => handleLeaveAction(app.rectorId, app._id, 'Approved')}>
                                                <i className="fas fa-check"></i> Approve
                                            </button>
                                            <button className="btn-reject" onClick={() => handleLeaveAction(app.rectorId, app._id, 'Rejected')}>
                                                <i className="fas fa-times"></i> Reject
                                            </button>
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
                )}
            </div>

            {/* ADD RECTOR MODAL */}
            {addModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title"><i className="fas fa-user-plus"></i> Add New Rector</h3>
                            <button className="modal-close" onClick={() => setAddModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddRectorSubmit}>
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newRector.name}
                                    onChange={(e) => setNewRector({ ...newRector, name: e.target.value })}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={newRector.email}
                                    onChange={(e) => setNewRector({ ...newRector, email: e.target.value })}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password (Default: HostelCare@123)</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={newRector.password}
                                    onChange={(e) => setNewRector({ ...newRector, password: e.target.value })}
                                    placeholder="Enter custom password"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newRector.phone}
                                    onChange={(e) => setNewRector({ ...newRector, phone: e.target.value })}
                                    placeholder="Enter mobile number"
                                />
                            </div>
                            <div className="form-group">
                                <label>Hostel Assigned (Office Location)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newRector.office}
                                    onChange={(e) => setNewRector({ ...newRector, office: e.target.value })}
                                    placeholder="e.g. Girls Hostel A - Room 101"
                                />
                            </div>
                            <div className="form-group">
                                <label>Bio / Description</label>
                                <textarea
                                    className="form-control"
                                    value={newRector.bio}
                                    onChange={(e) => setNewRector({ ...newRector, bio: e.target.value })}
                                    placeholder="Add short bio details"
                                    rows="3"
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Rector'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT RECTOR MODAL */}
            {editModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title"><i className="fas fa-user-edit"></i> Edit Rector Profile</h3>
                            <button className="modal-close" onClick={() => setEditModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleEditRectorSubmit}>
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editingRectorData.name}
                                    onChange={(e) => setEditingRectorData({ ...editingRectorData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={editingRectorData.email}
                                    onChange={(e) => setEditingRectorData({ ...editingRectorData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Change Password (Leave blank to keep current)</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={editingRectorData.password}
                                    onChange={(e) => setEditingRectorData({ ...editingRectorData, password: e.target.value })}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editingRectorData.phone}
                                    onChange={(e) => setEditingRectorData({ ...editingRectorData, phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Hostel Assigned (Office Location)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editingRectorData.office}
                                    onChange={(e) => setEditingRectorData({ ...editingRectorData, office: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Bio / Description</label>
                                <textarea
                                    className="form-control"
                                    value={editingRectorData.bio}
                                    onChange={(e) => setEditingRectorData({ ...editingRectorData, bio: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminRectors;
