import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

function AdminWorkers() {
    // Data States
    const [workers, setWorkers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');

    // Modal states
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form inputs
    const [newWorker, setNewWorker] = useState({
        name: '',
        category: 'Electrician',
        phone: '',
        availability: 'Available'
    });

    const [editingWorkerData, setEditingWorkerData] = useState({
        name: '',
        category: 'Electrician',
        phone: '',
        availability: 'Available',
        performanceScore: 0
    });

    const [attendanceData, setAttendanceData] = useState({
        status: 'Present',
        date: new Date().toISOString().split('T')[0]
    });

    // Categories array
    const categories = ["Electrician", "Plumber", "Carpenter", "Cleaning", "Security", "IT Support"];

    // Fetch Workers directory
    const fetchWorkers = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing. Please sign in again.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/workers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                if (response.status === 401) throw new Error('Unauthorized');
                if (response.status === 403) throw new Error('Forbidden');
                throw new Error(`Server returned status ${response.status}`);
            }
            const data = await response.json();
            setWorkers(data || []);
        } catch (err) {
            console.error('Fetch workers error:', err);
            setError(err.message === 'Unauthorized' ? 'Session expired. Please log in again.' : 'Failed to connect to the server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, []);

    // Filter Workers list client-side
    const filteredWorkers = workers.filter(worker => {
        const matchesSearch = worker.name?.toLowerCase().includes(searchQuery.toLowerCase()) || worker.phone?.includes(searchQuery);
        const matchesCategory = categoryFilter ? worker.category === categoryFilter : true;
        const matchesAvailability = availabilityFilter ? worker.availability === availabilityFilter : true;
        return matchesSearch && matchesCategory && matchesAvailability;
    });

    // Handle Create Worker
    const handleAddWorkerSubmit = async (e) => {
        e.preventDefault();
        if (!newWorker.name.trim() || !newWorker.category) {
            alert('Name and Category are required.');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/workers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newWorker.name.trim(),
                    category: newWorker.category,
                    phone: newWorker.phone.trim(),
                    availability: newWorker.availability
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Worker created successfully!');
                setAddModalOpen(false);
                setNewWorker({ name: '', category: 'Electrician', phone: '', availability: 'Available' });
                fetchWorkers();
            } else {
                alert(data.message || 'Failed to create worker.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Could not create worker.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open Edit Modal & Populate Form
    const openEditModal = (worker) => {
        setSelectedWorker(worker);
        setEditingWorkerData({
            name: worker.name,
            category: worker.category,
            phone: worker.phone || '',
            availability: worker.availability,
            performanceScore: worker.performanceScore || 0
        });
        setEditModalOpen(true);
    };

    // Handle Edit Worker Submit
    const handleEditWorkerSubmit = async (e) => {
        e.preventDefault();
        if (!editingWorkerData.name.trim() || !editingWorkerData.category) {
            alert('Name and Category are required.');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/workers/${selectedWorker._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: editingWorkerData.name.trim(),
                    category: editingWorkerData.category,
                    phone: editingWorkerData.phone.trim(),
                    availability: editingWorkerData.availability,
                    performanceScore: Number(editingWorkerData.performanceScore)
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Worker updated successfully!');
                setEditModalOpen(false);
                setSelectedWorker(null);
                fetchWorkers();
            } else {
                alert(data.message || 'Failed to update worker.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Could not update worker.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Delete Worker
    const handleDeleteWorker = async (worker) => {
        if (!window.confirm(`Are you sure you want to permanently delete worker ${worker.name}?`)) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/workers/${worker._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                alert('Worker deleted successfully.');
                fetchWorkers();
            } else {
                alert(data.message || 'Failed to delete worker.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Could not delete worker.');
        }
    };

    // Open Attendance Modal
    const openAttendanceModal = (worker) => {
        setSelectedWorker(worker);
        setAttendanceData({
            status: 'Present',
            date: new Date().toISOString().split('T')[0]
        });
        setAttendanceModalOpen(true);
    };

    // Submit Attendance Record
    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/workers/${selectedWorker._id}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: attendanceData.status,
                    date: attendanceData.date
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Worker attendance recorded successfully!');
                setAttendanceModalOpen(false);
                setSelectedWorker(null);
                fetchWorkers();
            } else {
                alert(data.message || 'Failed to record attendance.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Could not submit attendance.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Aggregate statistics
    const totalCount = workers.length;
    const availableCount = workers.filter(w => w.availability === 'Available').length;
    const busyCount = workers.filter(w => w.availability === 'Busy').length;
    const offCount = workers.filter(w => w.availability === 'Off').length;

    return (
        <>
            <Header title="Workers Management" />
            <style>{`
                .workers-container {
                    padding: 30px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05);
                    border-top: 4px solid #eaecf4;
                }

                .card.border-blue { border-top-color: #4e73df; }
                .card.border-green { border-top-color: #1cc88a; }
                .card.border-orange { border-top-color: #f6c23e; }
                .card.border-red { border-top-color: #e74a3b; }

                .card h3 {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 10px 0 0;
                    color: #2d3748;
                }

                .card p {
                    font-size: 12px;
                    color: #718096;
                    margin: 5px 0 0;
                }

                .card-label {
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #a0aec0;
                }

                .filters-bar {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    align-items: center;
                    margin-bottom: 25px;
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .filter-input {
                    padding: 10px 12px;
                    border: 1px solid #d1d3e2;
                    border-radius: 6px;
                    font-size: 14px;
                    outline: none;
                    background: #fff;
                }

                .filter-input:focus {
                    border-color: #4e73df;
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

                .worker-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
                    gap: 25px;
                }

                .worker-item-card {
                    background: #fff;
                    border: 1px solid #eaecf4;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    transition: all 0.3s;
                    position: relative;
                }

                .worker-item-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 15px rgba(0,0,0,0.05);
                }

                .worker-name {
                    font-weight: 700;
                    color: #333;
                    font-size: 18px;
                    margin-bottom: 8px;
                }

                .worker-info {
                    color: #5a5c69;
                    font-size: 14px;
                    margin-bottom: 20px;
                    line-height: 1.6;
                }

                .status-chip {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .status-available { background: #e3fdf4; color: #1cc88a; }
                .status-busy { background: #fff5e6; color: #f6c23e; }
                .status-off { background: #fbecec; color: #e74a3b; }

                .card-actions {
                    display: flex;
                    gap: 10px;
                    border-top: 1px solid #eaecf4;
                    padding-top: 15px;
                    margin-top: 15px;
                    justify-content: flex-end;
                }

                .btn-action-sm {
                    padding: 6px 12px;
                    font-size: 12px;
                    font-weight: 600;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }

                .btn-edit { background: #f6c23e; color: white; }
                .btn-edit:hover { background: #e0b034; }
                .btn-delete { background: #e74a3b; color: white; }
                .btn-delete:hover { background: #be2e21; }
                .btn-attend { background: #4e73df; color: white; }
                .btn-attend:hover { background: #2e59d9; }

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
                    max-height: 90vh;
                    overflow-y: auto;
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

                .attendance-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                    font-size: 13px;
                }

                .attendance-table th, .attendance-table td {
                    padding: 8px 10px;
                    text-align: left;
                    border-bottom: 1px solid #eaecf4;
                }

                .attendance-table th {
                    background: #f8f9fc;
                    color: #858796;
                    font-weight: 700;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="workers-container">
                {/* Error Banner with Retry */}
                {error && (
                    <div className="status-message status-error">
                        <span>{error}</span>
                        <button className="btn-delete" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={fetchWorkers}>
                            Retry Loading
                        </button>
                    </div>
                )}

                {/* Metrics Cards */}
                <div className="stats-grid">
                    <div className="card border-blue">
                        <span className="card-label">Total Staff</span>
                        <h3>{totalCount}</h3>
                        <p>Registered Workers</p>
                    </div>
                    <div className="card border-green">
                        <span className="card-label">Available Staff</span>
                        <h3>{availableCount}</h3>
                        <p>Active and free to allot</p>
                    </div>
                    <div className="card border-orange">
                        <span className="card-label">Busy Staff</span>
                        <h3>{busyCount}</h3>
                        <p>Currently on complaints</p>
                    </div>
                    <div className="card border-red">
                        <span className="card-label">Off Duty</span>
                        <h3>{offCount}</h3>
                        <p>On leave or off shift</p>
                    </div>
                </div>

                {/* Filters and Actions Bar */}
                <div className="filters-bar">
                    <input
                        type="text"
                        placeholder="Search name or phone..."
                        className="filter-input"
                        style={{ flex: 1, minWidth: '220px' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className="filter-input"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        className="filter-input"
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                        <option value="Off">Off</option>
                    </select>
                    <button className="btn-add" onClick={() => setAddModalOpen(true)}>
                        <i className="fas fa-plus"></i> Add Worker
                    </button>
                </div>

                {/* Workers Directory Grid */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#858796' }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
                        <p>Loading workers directory...</p>
                    </div>
                ) : filteredWorkers.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#858796' }}>
                        <i className="fas fa-user-slash" style={{ fontSize: '48px', color: '#dddfeb', marginBottom: '15px' }}></i>
                        <p style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>No workers found matching selected criteria.</p>
                    </div>
                ) : (
                    <div className="worker-grid">
                        {filteredWorkers.map(worker => (
                            <div key={worker._id} className="worker-item-card">
                                <div className="worker-name">{worker.name}</div>
                                <div className="worker-info">
                                    <i className="fas fa-tools" style={{ width: '22px', color: '#4e73df' }}></i> {worker.category}<br/>
                                    <i className="fas fa-phone" style={{ width: '22px', color: '#858796' }}></i> {worker.phone || 'No phone number'}<br/>
                                    <i className="fas fa-clipboard-list" style={{ width: '22px', color: '#858796' }}></i> Active Tasks: {worker.assignedComplaints?.length || 0}<br/>
                                    <i className="fas fa-star" style={{ width: '22px', color: '#f6c23e' }}></i> Rating Score: {worker.performanceScore || 0}/5
                                </div>
                                <span className={`status-chip status-${worker.availability.toLowerCase()}`}>
                                    {worker.availability}
                                </span>
                                
                                <div className="card-actions">
                                    <button className="btn-action-sm btn-attend" title="Mark Attendance" onClick={() => openAttendanceModal(worker)}>
                                        <i className="fas fa-user-check"></i> Attendance
                                    </button>
                                    <button className="btn-action-sm btn-edit" title="Edit Profile" onClick={() => openEditModal(worker)}>
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button className="btn-action-sm btn-delete" title="Delete Worker" onClick={() => handleDeleteWorker(worker)}>
                                        <i className="fas fa-trash-alt"></i> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

                {/* Section 3: Worker Directory (Tabs) */}
                <div className="worker-card">
                    <h3 className="section-title">Maintenance Directory</h3>
                    
                    <div className="role-tabs">
                        {Object.keys(workersList).map(role => (
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
                        {(workersList[activeRole] || []).map(worker => (
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
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT WORKER MODAL */}
            {editModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title"><i className="fas fa-user-edit"></i> Edit Worker Profile</h3>
                            <button className="modal-close" onClick={() => setEditModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleEditWorkerSubmit}>
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editingWorkerData.name}
                                    onChange={(e) => setEditingWorkerData({ ...editingWorkerData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    className="form-control"
                                    value={editingWorkerData.category}
                                    onChange={(e) => setEditingWorkerData({ ...editingWorkerData, category: e.target.value })}
                                    required
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editingWorkerData.phone}
                                    onChange={(e) => setEditingWorkerData({ ...editingWorkerData, phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Availability</label>
                                <select
                                    className="form-control"
                                    value={editingWorkerData.availability}
                                    onChange={(e) => setEditingWorkerData({ ...editingWorkerData, availability: e.target.value })}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Busy">Busy</option>
                                    <option value="Off">Off</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Rating Score (0-5)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={editingWorkerData.performanceScore}
                                    onChange={(e) => setEditingWorkerData({ ...editingWorkerData, performanceScore: e.target.value })}
                                    min="0"
                                    max="5"
                                    step="0.1"
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

            {/* ATTENDANCE MODAL */}
            {attendanceModalOpen && selectedWorker && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title"><i className="fas fa-user-check"></i> Record Attendance: {selectedWorker.name}</h3>
                            <button className="modal-close" onClick={() => setAttendanceModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAttendanceSubmit}>
                            <div className="form-group">
                                <label>Attendance Status</label>
                                <select
                                    className="form-control"
                                    value={attendanceData.status}
                                    onChange={(e) => setAttendanceData({ ...attendanceData, status: e.target.value })}
                                >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Leave">Leave</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={attendanceData.date}
                                    onChange={(e) => setAttendanceData({ ...attendanceData, date: e.target.value })}
                                    required
                                />
                            </div>
                            
                            <div style={{ marginTop: '20px' }}>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4e73df', fontWeight: '700' }}>Recent Attendance History</h4>
                                {!selectedWorker.attendance || selectedWorker.attendance.length === 0 ? (
                                    <p style={{ margin: 0, fontSize: '12px', color: '#858796', fontStyle: 'italic' }}>No attendance history recorded.</p>
                                ) : (
                                    <table className="attendance-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedWorker.attendance.slice(-5).reverse().map((att, index) => (
                                                <tr key={index}>
                                                    <td>{new Date(att.date).toLocaleDateString('en-GB')}</td>
                                                    <td style={{ fontWeight: 600, color: att.status === 'Present' ? '#1cc88a' : att.status === 'Absent' ? '#e74a3b' : '#f6c23e' }}>
                                                        {att.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setAttendanceModalOpen(false)}>Close</button>
                                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Recording...' : 'Submit Attendance'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminWorkers;
