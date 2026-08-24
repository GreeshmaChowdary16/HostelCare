import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const FeesManagement = ({ role }) => {
    // Tab State: 'dashboard' | 'single' | 'bulk'
    const [activeTab, setActiveTab] = useState('dashboard');

    // Data States
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({
        totalInvoices: 0,
        totalBilled: 0,
        totalCollected: 0,
        totalPending: 0,
        collectionPercentage: 0,
        counts: { paid: 0, pending: 0, overdue: 0, partial: 0 }
    });

    // Loading & Error States
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [feeTypeFilter, setFeeTypeFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');

    // Single Invoice Form State
    const [singleInvoice, setSingleInvoice] = useState({
        student: '',
        feeType: 'Hostel Fee',
        academicYear: '2025-2026',
        semester: 'Semester 1',
        amount: '',
        dueDate: '',
        remarks: ''
    });

    // Bulk Invoice Form State
    const [bulkInvoice, setBulkInvoice] = useState({
        branch: '',
        year: '',
        feeType: 'Hostel Fee',
        academicYear: '2025-2026',
        semester: 'Semester 1',
        amount: '',
        dueDate: '',
        remarks: ''
    });

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingFee, setEditingFee] = useState(null);

    // Form Submission States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

    // Fetch All Data
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing. Please sign in again.');
            setIsLoading(false);
            return;
        }

        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            // 1. Fetch Stats
            const statsRes = await fetch(`${API_BASE_URL}/fees/stats`, { headers });
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setStats(statsData.stats);
                }
            }

            // 2. Fetch Fees
            // Build backend query parameters for search, status, and feeType
            const queryParams = new URLSearchParams();
            if (searchTerm) queryParams.append('search', searchTerm);
            if (statusFilter) queryParams.append('status', statusFilter);
            if (feeTypeFilter) queryParams.append('feeType', feeTypeFilter);

            const feesRes = await fetch(`${API_BASE_URL}/fees?${queryParams.toString()}`, { headers });
            if (!feesRes.ok) {
                if (feesRes.status === 401) throw new Error('Unauthorized');
                if (feesRes.status === 403) throw new Error('Forbidden');
                throw new Error('Server error');
            }
            const feesData = await feesRes.json();
            if (feesData.success) {
                setFees(feesData.fees || []);
            }

            // 3. Fetch Students for Select Dropdown
            const studentsRes = await fetch(`${API_BASE_URL}/students`, { headers });
            if (studentsRes.ok) {
                const studentsData = await studentsRes.json();
                setStudents(studentsData || []);
            }
        } catch (err) {
            console.error('Fees Management fetch error:', err);
            setError(err.message === 'Unauthorized' ? 'Session expired. Please log in again.' : 'Failed to connect to the server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchTerm, statusFilter, feeTypeFilter]);

    // Client-side filtering for branch and year (since backend doesn't filter them directly)
    const filteredFees = fees.filter(fee => {
        if (branchFilter && fee.student?.branch !== branchFilter) return false;
        if (yearFilter && fee.student?.year !== yearFilter) return false;
        return true;
    });

    // Handle Create Single Invoice
    const handleSingleSubmit = async (e) => {
        e.preventDefault();
        setActionMessage({ type: '', text: '' });

        // Validations
        if (!singleInvoice.student) {
            alert('Please select a student.');
            return;
        }
        if (Number(singleInvoice.amount) <= 0) {
            alert('Amount must be greater than 0.');
            return;
        }
        if (!singleInvoice.dueDate) {
            alert('Please select a due date.');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/fees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    student: singleInvoice.student,
                    feeType: singleInvoice.feeType,
                    academicYear: singleInvoice.academicYear,
                    semester: singleInvoice.semester,
                    amount: Number(singleInvoice.amount),
                    dueDate: singleInvoice.dueDate,
                    remarks: singleInvoice.remarks
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setActionMessage({ type: 'success', text: 'Invoice created successfully!' });
                setSingleInvoice({
                    student: '',
                    feeType: 'Hostel Fee',
                    academicYear: '2025-2026',
                    semester: 'Semester 1',
                    amount: '',
                    dueDate: '',
                    remarks: ''
                });
                setActiveTab('dashboard');
                fetchData();
            } else {
                setActionMessage({ type: 'error', text: data.message || 'Failed to create invoice.' });
            }
        } catch (err) {
            console.error(err);
            setActionMessage({ type: 'error', text: 'Network error. Could not submit invoice.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Create Bulk Invoices
    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        setActionMessage({ type: '', text: '' });

        // Validations
        if (Number(bulkInvoice.amount) <= 0) {
            alert('Amount must be greater than 0.');
            return;
        }
        if (!bulkInvoice.dueDate) {
            alert('Please select a due date.');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            const payload = {
                feeType: bulkInvoice.feeType,
                academicYear: bulkInvoice.academicYear,
                semester: bulkInvoice.semester,
                amount: Number(bulkInvoice.amount),
                dueDate: bulkInvoice.dueDate,
                remarks: bulkInvoice.remarks
            };
            if (bulkInvoice.branch) payload.branch = bulkInvoice.branch;
            if (bulkInvoice.year) payload.year = bulkInvoice.year;

            const response = await fetch(`${API_BASE_URL}/fees/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setActionMessage({ type: 'success', text: data.message || 'Bulk invoices created successfully!' });
                setBulkInvoice({
                    branch: '',
                    year: '',
                    feeType: 'Hostel Fee',
                    academicYear: '2025-2026',
                    semester: 'Semester 1',
                    amount: '',
                    dueDate: '',
                    remarks: ''
                });
                setActiveTab('dashboard');
                fetchData();
            } else {
                setActionMessage({ type: 'error', text: data.message || 'Failed to create bulk invoices.' });
            }
        } catch (err) {
            console.error(err);
            setActionMessage({ type: 'error', text: 'Network error. Could not process bulk request.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Delete Invoice
    const handleDeleteFee = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this invoice?')) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/fees/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok && data.success) {
                alert('Invoice deleted successfully.');
                fetchData();
            } else {
                alert(data.message || 'Failed to delete invoice.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Unable to delete invoice.');
        }
    };

    // Open Edit Modal
    const openEditModal = (fee) => {
        setEditingFee({
            _id: fee._id,
            feeType: fee.feeType,
            academicYear: fee.academicYear,
            semester: fee.semester,
            amount: fee.amount,
            dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '',
            status: fee.status,
            remarks: fee.remarks || ''
        });
        setEditModalOpen(true);
    };

    // Submit Edit Invoice
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (Number(editingFee.amount) <= 0) {
            alert('Amount must be greater than 0.');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/fees/${editingFee._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    feeType: editingFee.feeType,
                    academicYear: editingFee.academicYear,
                    semester: editingFee.semester,
                    amount: Number(editingFee.amount),
                    dueDate: editingFee.dueDate,
                    status: editingFee.status,
                    remarks: editingFee.remarks
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                alert('Invoice updated successfully.');
                setEditModalOpen(false);
                setEditingFee(null);
                fetchData();
            } else {
                alert(data.message || 'Failed to update invoice.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Unable to update invoice.');
        }
    };

    return (
        <div className="container">
            <style>{`
                .container {
                    padding: 30px;
                    max-width: 1600px;
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
                    transition: transform 0.2s;
                    border: 1px solid rgba(0,0,0,0.02);
                }

                .card:hover {
                    transform: translateY(-2px);
                }

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

                .bg-blue { border-top: 4px solid #4e73df; }
                .bg-teal { border-top: 4px solid #1cc88a; }
                .bg-orange { border-top: 4px solid #f6c23e; }
                .bg-red { border-top: 4px solid #e74a3b; }

                .tabs-header {
                    display: flex;
                    border-bottom: 2px solid #e3e6f0;
                    margin-bottom: 25px;
                    gap: 15px;
                }

                .tab-btn {
                    padding: 12px 20px;
                    font-weight: 600;
                    font-size: 14px;
                    border: none;
                    background: none;
                    color: #858796;
                    cursor: pointer;
                    position: relative;
                    transition: color 0.2s;
                }

                .tab-btn.active {
                    color: #4e73df;
                }

                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #4e73df;
                }

                .filters-bar {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    align-items: center;
                    margin-bottom: 20px;
                    background: #fff;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .filter-input {
                    padding: 8px 12px;
                    border: 1px solid #d1d3e2;
                    border-radius: 6px;
                    font-size: 13px;
                    outline: none;
                    background: #fff;
                }

                .filter-input:focus {
                    border-color: #4e73df;
                }

                .table-responsive {
                    overflow-x: auto;
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    padding: 15px 20px;
                    text-align: left;
                    font-size: 14px;
                    border-bottom: 1px solid #e3e6f0;
                }

                th {
                    background: #f8f9fc;
                    color: #858796;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 11px;
                }

                .btn-icon {
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 14px;
                    padding: 5px;
                    border-radius: 4px;
                    transition: background 0.2s;
                }

                .btn-edit { color: #4e73df; }
                .btn-edit:hover { background: #eaecf4; }
                .btn-delete { color: #e74a3b; }
                .btn-delete:hover { background: #fadbd8; }

                .form-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 30px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    max-width: 700px;
                    margin: 0 auto;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group.full-width {
                    grid-column: span 2;
                }

                .form-group label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    color: #4e73df;
                    margin-bottom: 6px;
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

                .btn-submit {
                    background: #4e73df;
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.2s;
                }

                .btn-submit:hover {
                    background: #2e59d9;
                }

                .status-message {
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    font-weight: 500;
                }

                .status-success { background: #e6fffa; color: #1cc88a; border: 1px solid #c6f6d5; }
                .status-error { background: #fff5f5; color: #e74a3b; border: 1px solid #fed7d7; }

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
                }

                .modal-content {
                    background: #fff;
                    border-radius: 12px;
                    padding: 30px;
                    width: 90%;
                    max-width: 600px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
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

                @media (max-width: 768px) {
                    .form-grid { grid-template-columns: 1fr; }
                    .form-group.full-width { grid-column: span 1; }
                }
            `}</style>

            {/* Error Banner with Retry */}
            {error && (
                <div className="status-message status-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{error}</span>
                    <button className="btn-submit" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={fetchData}>
                        Retry Loading
                    </button>
                </div>
            )}

            {/* Tabs Navigation */}
            <div className="tabs-header">
                <button
                    className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard & Invoices
                </button>
                <button
                    className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('single');
                        setActionMessage({ type: '', text: '' });
                    }}
                >
                    Create Single Invoice
                </button>
                <button
                    className={`tab-btn ${activeTab === 'bulk' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('bulk');
                        setActionMessage({ type: '', text: '' });
                    }}
                >
                    Create Bulk Invoices
                </button>
            </div>

            {/* 1. DASHBOARD & INVOICES TAB */}
            {activeTab === 'dashboard' && (
                <>
                    {/* Stats Metrics Cards */}
                    <div className="stats-grid">
                        <div className="card bg-blue">
                            <span className="card-label">Total Invoices</span>
                            <h3>{stats.totalInvoices || 0}</h3>
                            <p>₹{stats.totalBilled?.toLocaleString('en-IN') || 0} Total Billed</p>
                        </div>
                        <div className="card bg-teal">
                            <span className="card-label">Total Collections</span>
                            <h3>₹{stats.totalCollected?.toLocaleString('en-IN') || 0}</h3>
                            <p>{stats.counts?.paid || 0} Settled Invoices</p>
                        </div>
                        <div className="card bg-orange">
                            <span className="card-label">Pending Collections</span>
                            <h3>₹{stats.totalPending?.toLocaleString('en-IN') || 0}</h3>
                            <p>{(stats.counts?.pending || 0) + (stats.counts?.partial || 0)} Pending/Partial</p>
                        </div>
                        <div className="card bg-red">
                            <span className="card-label">Overdue Invoices</span>
                            <h3>{stats.counts?.overdue || 0}</h3>
                            <p>Passed payment deadline</p>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="filters-bar">
                        <input
                            type="text"
                            placeholder="Search name, roll, receipt..."
                            className="filter-input"
                            style={{ flex: 1, minWidth: '200px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="filter-input"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Partial">Partial</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                        <select
                            className="filter-input"
                            value={feeTypeFilter}
                            onChange={(e) => setFeeTypeFilter(e.target.value)}
                        >
                            <option value="">All Fee Types</option>
                            <option value="Hostel Fee">Hostel Fee</option>
                            <option value="Mess Fee">Mess Fee</option>
                            <option value="Maintenance Fee">Maintenance Fee</option>
                            <option value="Caution Deposit">Caution Deposit</option>
                            <option value="Other">Other</option>
                        </select>
                        <select
                            className="filter-input"
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                        >
                            <option value="">All Branches</option>
                            <option value="Computer Science & Engineering">CSE</option>
                            <option value="Electronics & Communication">ECE</option>
                            <option value="Electrical Engineering">EE</option>
                            <option value="Mechanical Engineering">ME</option>
                            <option value="Civil Engineering">Civil</option>
                            <option value="Information Technology">IT</option>
                        </select>
                        <select
                            className="filter-input"
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                        >
                            <option value="">All Years</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                    </div>

                    {/* Table View */}
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#858796' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
                            <p>Loading fee invoices...</p>
                        </div>
                    ) : filteredFees.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#858796' }}>
                            <i className="fas fa-file-invoice-dollar" style={{ fontSize: '48px', color: '#dddfeb', marginBottom: '15px' }}></i>
                            <p style={{ fontSize: '16px', fontWeight: 500 }}>No fee records matching filters found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Invoice ID</th>
                                        <th>Student Details</th>
                                        <th>Academic Info</th>
                                        <th>Fee Type</th>
                                        <th>Amount</th>
                                        <th>Paid</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Payment Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFees.map((fee) => {
                                        let badgeClass = 'status-new';
                                        if (fee.status === 'Paid') badgeClass = 'status-resolved';
                                        else if (fee.status === 'Partial') badgeClass = 'status-progress';
                                        else if (fee.status === 'Overdue') badgeClass = 'status-pending';

                                        return (
                                            <tr key={fee._id}>
                                                <td style={{ fontWeight: 600, fontSize: '13px' }}>
                                                    {fee.receiptNo || fee._id.substring(fee._id.length - 8).toUpperCase()}
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: '#333' }}>{fee.student?.name || 'N/A'}</div>
                                                    <div style={{ fontSize: '11px', color: '#858796' }}>Roll: {fee.student?.rollNo || 'N/A'}</div>
                                                </td>
                                                <td>
                                                    <div>{fee.student?.branch || 'N/A'}</div>
                                                    <div style={{ fontSize: '11px', color: '#858796' }}>{fee.student?.year || 'N/A'} ({fee.semester})</div>
                                                </td>
                                                <td style={{ fontWeight: 500 }}>{fee.feeType}</td>
                                                <td style={{ fontWeight: 600 }}>₹{fee.amount?.toLocaleString('en-IN')}</td>
                                                <td style={{ color: '#1cc88a', fontWeight: 600 }}>₹{fee.paidAmount?.toLocaleString('en-IN') || 0}</td>
                                                <td>
                                                    {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString('en-GB') : 'N/A'}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${badgeClass}`}>
                                                        {fee.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {fee.paymentDate ? (
                                                        <div>
                                                            <div>{new Date(fee.paymentDate).toLocaleDateString('en-GB')}</div>
                                                            <div style={{ fontSize: '10px', color: '#858796' }}>Method: {fee.paymentMethod}</div>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontStyle: 'italic', color: '#c5c7d6', fontSize: '12px' }}>Unpaid</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            className="btn-icon btn-edit"
                                                            title="Edit Invoice"
                                                            onClick={() => openEditModal(fee)}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn-icon btn-delete"
                                                            title="Delete Invoice"
                                                            onClick={() => handleDeleteFee(fee._id)}
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* 2. CREATE SINGLE INVOICE TAB */}
            {activeTab === 'single' && (
                <div className="form-card animate-fadeIn">
                    <h3 className="modal-title" style={{ marginBottom: '20px', borderBottom: '1px solid #e3e6f0', paddingBottom: '15px' }}>
                        Create Single Student Invoice
                    </h3>

                    {actionMessage.text && (
                        <div className={`status-message ${actionMessage.type === 'success' ? 'status-success' : 'status-error'}`}>
                            {actionMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleSingleSubmit} className="form-grid">
                        <div className="form-group full-width">
                            <label htmlFor="select-student">Select Student *</label>
                            <select
                                id="select-student"
                                className="form-control"
                                value={singleInvoice.student}
                                onChange={(e) => setSingleInvoice({ ...singleInvoice, student: e.target.value })}
                                required
                            >
                                <option value="">-- Search and Select Student --</option>
                                {students.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name} ({s.rollNo || 'No Roll No'}) — {s.branch} ({s.year})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="fee-type">Fee Type *</label>
                            <select
                                id="fee-type"
                                className="form-control"
                                value={singleInvoice.feeType}
                                onChange={(e) => setSingleInvoice({ ...singleInvoice, feeType: e.target.value })}
                            >
                                <option value="Hostel Fee">Hostel Fee</option>
                                <option value="Mess Fee">Mess Fee</option>
                                <option value="Maintenance Fee">Maintenance Fee</option>
                                <option value="Caution Deposit">Caution Deposit</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="amount">Amount (₹) *</label>
                            <input
                                type="number"
                                id="amount"
                                className="form-control"
                                value={singleInvoice.amount}
                                onChange={(e) => setSingleInvoice({ ...singleInvoice, amount: e.target.value })}
                                min="1"
                                placeholder="Enter invoice amount"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="academic-year">Academic Year</label>
                            <input
                                type="text"
                                id="academic-year"
                                className="form-control"
                                value={singleInvoice.academicYear}
                                onChange={(e) => setSingleInvoice({ ...singleInvoice, academicYear: e.target.value })}
                                placeholder="e.g. 2025-2026"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="semester">Semester</label>
                            <select
                                id="semester"
                                className="form-control"
                                value={singleInvoice.semester}
                                onChange={(e) => setSingleInvoice({ ...singleInvoice, semester: e.target.value })}
                            >
                                <option value="Semester 1">Semester 1</option>
                                <option value="Semester 2">Semester 2</option>
                                <option value="Semester 3">Semester 3</option>
                                <option value="Semester 4">Semester 4</option>
                                <option value="Semester 5">Semester 5</option>
                                <option value="Semester 6">Semester 6</option>
                                <option value="Semester 7">Semester 7</option>
                                <option value="Semester 8">Semester 8</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="due-date">Due Date *</label>
                            <input
                                type="date"
                                id="due-date"
                                className="form-control"
                                value={singleInvoice.dueDate}
                                onChange={(e) => setSingleInvoice({ ...singleInvoice, dueDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="remarks">Remarks</label>
                            <input
                                type="text"
                                id="remarks"
                                className="form-control"
                                value={singleInvoice.remarks}
                                onChange={(e) => setSingleInvoice({ ...singleInvoice, remarks: e.target.value })}
                                placeholder="Invoice description or notes"
                            />
                        </div>

                        <div className="form-group full-width" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: 0 }}>
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => setActiveTab('dashboard')}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Invoice'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 3. CREATE BULK INVOICES TAB */}
            {activeTab === 'bulk' && (
                <div className="form-card animate-fadeIn">
                    <h3 className="modal-title" style={{ marginBottom: '20px', borderBottom: '1px solid #e3e6f0', paddingBottom: '15px' }}>
                        Generate Bulk Invoices
                    </h3>

                    {actionMessage.text && (
                        <div className={`status-message ${actionMessage.type === 'success' ? 'status-success' : 'status-error'}`}>
                            {actionMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleBulkSubmit} className="form-grid">
                        <div className="form-group">
                            <label htmlFor="bulk-branch">Branch Filter (Optional)</label>
                            <select
                                id="bulk-branch"
                                className="form-control"
                                value={bulkInvoice.branch}
                                onChange={(e) => setBulkInvoice({ ...bulkInvoice, branch: e.target.value })}
                            >
                                <option value="">All Branches</option>
                                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                                <option value="Electronics & Communication">Electronics & Communication</option>
                                <option value="Electrical Engineering">Electrical Engineering</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Civil Engineering">Civil Engineering</option>
                                <option value="Information Technology">Information Technology</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="bulk-year">Academic Year Filter (Optional)</label>
                            <select
                                id="bulk-year"
                                className="form-control"
                                value={bulkInvoice.year}
                                onChange={(e) => setBulkInvoice({ ...bulkInvoice, year: e.target.value })}
                            >
                                <option value="">All Years</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="bulk-fee-type">Fee Type *</label>
                            <select
                                id="bulk-fee-type"
                                className="form-control"
                                value={bulkInvoice.feeType}
                                onChange={(e) => setBulkInvoice({ ...bulkInvoice, feeType: e.target.value })}
                            >
                                <option value="Hostel Fee">Hostel Fee</option>
                                <option value="Mess Fee">Mess Fee</option>
                                <option value="Maintenance Fee">Maintenance Fee</option>
                                <option value="Caution Deposit">Caution Deposit</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="bulk-amount">Amount (₹) *</label>
                            <input
                                type="number"
                                id="bulk-amount"
                                className="form-control"
                                value={bulkInvoice.amount}
                                onChange={(e) => setBulkInvoice({ ...bulkInvoice, amount: e.target.value })}
                                min="1"
                                placeholder="Enter invoice amount"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bulk-acad-year">Academic Session</label>
                            <input
                                type="text"
                                id="bulk-acad-year"
                                className="form-control"
                                value={bulkInvoice.academicYear}
                                onChange={(e) => setBulkInvoice({ ...bulkInvoice, academicYear: e.target.value })}
                                placeholder="e.g. 2025-2026"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bulk-semester">Semester</label>
                            <select
                                id="bulk-semester"
                                className="form-control"
                                value={bulkInvoice.semester}
                                onChange={(e) => setBulkInvoice({ ...bulkInvoice, semester: e.target.value })}
                            >
                                <option value="Semester 1">Semester 1</option>
                                <option value="Semester 2">Semester 2</option>
                                <option value="Semester 3">Semester 3</option>
                                <option value="Semester 4">Semester 4</option>
                                <option value="Semester 5">Semester 5</option>
                                <option value="Semester 6">Semester 6</option>
                                <option value="Semester 7">Semester 7</option>
                                <option value="Semester 8">Semester 8</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="bulk-due-date">Due Date *</label>
                            <input
                                type="date"
                                id="bulk-due-date"
                                className="form-control"
                                value={bulkInvoice.dueDate}
                                onChange={(e) => setBulkInvoice({ ...bulkInvoice, dueDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="bulk-remarks">Remarks</label>
                            <input
                                type="text"
                                id="bulk-remarks"
                                className="form-control"
                                value={bulkInvoice.remarks}
                                onChange={(e) => setBulkInvoice({ ...bulkInvoice, remarks: e.target.value })}
                                placeholder="Invoice description or notes"
                            />
                        </div>

                        <div className="form-group full-width" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: 0 }}>
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => setActiveTab('dashboard')}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Generating...' : 'Generate Bulk Invoices'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* EDIT INVOICE MODAL */}
            {editModalOpen && editingFee && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fadeIn">
                        <div className="modal-header">
                            <h3 className="modal-title">Edit Fee Invoice</h3>
                            <button className="modal-close" onClick={() => setEditModalOpen(false)}>
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="form-grid">
                            <div className="form-group">
                                <label htmlFor="edit-fee-type">Fee Type</label>
                                <select
                                    id="edit-fee-type"
                                    className="form-control"
                                    value={editingFee.feeType}
                                    onChange={(e) => setEditingFee({ ...editingFee, feeType: e.target.value })}
                                    required
                                >
                                    <option value="Hostel Fee">Hostel Fee</option>
                                    <option value="Mess Fee">Mess Fee</option>
                                    <option value="Maintenance Fee">Maintenance Fee</option>
                                    <option value="Caution Deposit">Caution Deposit</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-amount">Amount (₹)</label>
                                <input
                                    type="number"
                                    id="edit-amount"
                                    className="form-control"
                                    value={editingFee.amount}
                                    onChange={(e) => setEditingFee({ ...editingFee, amount: e.target.value })}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-academic-year">Academic Year</label>
                                <input
                                    type="text"
                                    id="edit-academic-year"
                                    className="form-control"
                                    value={editingFee.academicYear}
                                    onChange={(e) => setEditingFee({ ...editingFee, academicYear: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-semester">Semester</label>
                                <select
                                    id="edit-semester"
                                    className="form-control"
                                    value={editingFee.semester}
                                    onChange={(e) => setEditingFee({ ...editingFee, semester: e.target.value })}
                                    required
                                >
                                    <option value="Semester 1">Semester 1</option>
                                    <option value="Semester 2">Semester 2</option>
                                    <option value="Semester 3">Semester 3</option>
                                    <option value="Semester 4">Semester 4</option>
                                    <option value="Semester 5">Semester 5</option>
                                    <option value="Semester 6">Semester 6</option>
                                    <option value="Semester 7">Semester 7</option>
                                    <option value="Semester 8">Semester 8</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-due-date">Due Date</label>
                                <input
                                    type="date"
                                    id="edit-due-date"
                                    className="form-control"
                                    value={editingFee.dueDate}
                                    onChange={(e) => setEditingFee({ ...editingFee, dueDate: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-status">Status</label>
                                <select
                                    id="edit-status"
                                    className="form-control"
                                    value={editingFee.status}
                                    onChange={(e) => setEditingFee({ ...editingFee, status: e.target.value })}
                                    required
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Partial">Partial</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="edit-remarks">Remarks</label>
                                <input
                                    type="text"
                                    id="edit-remarks"
                                    className="form-control"
                                    value={editingFee.remarks}
                                    onChange={(e) => setEditingFee({ ...editingFee, remarks: e.target.value })}
                                />
                            </div>

                            <div className="form-group full-width modal-footer" style={{ marginBottom: 0 }}>
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeesManagement;
