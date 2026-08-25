import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const StudentFees = () => {
    const [fees, setFees] = useState([]);
    const [summary, setSummary] = useState({
        totalBilled: 0,
        totalPaid: 0,
        totalPending: 0,
        pendingInvoices: 0
    });
    const [nextDueDate, setNextDueDate] = useState(null);
    const [latestPaidDate, setLatestPaidDate] = useState(null);
    const [latestTxnId, setLatestTxnId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Payment Simulator Modal State
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [transactionId, setTransactionId] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isPaying, setIsPaying] = useState(false);

    const fetchFeeData = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing. Please sign in again.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/fees/my-fees`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                setError('Unauthorized access. Please login again.');
                return;
            }

            if (response.status === 403) {
                setError('Access forbidden. You do not have permission to view fees.');
                return;
            }

            if (!response.ok) {
                setError(`Failed to retrieve fees (Server returned status ${response.status})`);
                return;
            }

            const data = await response.json();
            if (data.success) {
                // Focus strictly on Hostel Fee records - remove any Academic/Tuition fee records
                const hostelFees = (data.fees || []).filter(f => 
                    !f.feeType?.toLowerCase().includes('academic') && 
                    !f.feeType?.toLowerCase().includes('tuition') &&
                    !f.feeType?.toLowerCase().includes('college')
                );

                let totalBilled = 0;
                let totalPaid = 0;
                let pendingCount = 0;

                hostelFees.forEach(f => {
                    totalBilled += Number(f.amount || 0);
                    totalPaid += Number(f.paidAmount || 0);
                    if (f.status !== 'Paid') pendingCount++;
                });

                const totalPending = Math.max(0, totalBilled - totalPaid);

                setFees(hostelFees);
                setSummary({
                    totalBilled,
                    totalPaid,
                    totalPending,
                    pendingInvoices: pendingCount
                });

                // Find next due date for unpaid fees
                const unpaid = hostelFees.filter(f => f.status !== 'Paid');
                if (unpaid.length > 0) {
                    unpaid.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                    setNextDueDate(unpaid[0].dueDate);
                } else {
                    setNextDueDate(null);
                }

                // Find latest payment info
                const paidList = hostelFees.filter(f => f.paidAmount > 0 && f.paymentDate);
                if (paidList.length > 0) {
                    paidList.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
                    setLatestPaidDate(paidList[0].paymentDate);
                    setLatestTxnId(paidList[0].transactionId || '');
                } else {
                    setLatestPaidDate(null);
                    setLatestTxnId('');
                }
            } else {
                setError(data.message || 'Error occurred while loading hostel fee data.');
            }
        } catch (err) {
            console.error('Fetch fees error:', err);
            setError('Unable to connect to the server. Please check your network connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeeData();
    }, []);

    const openPaymentModal = (fee) => {
        setSelectedFee(fee);
        // Default payment amount to outstanding fee
        const outstanding = fee.amount - (fee.paidAmount || 0);
        setPaymentAmount(outstanding);
        setPaymentMethod('UPI');
        setTransactionId(`TXN-HOSTEL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`);
        setRemarks('');
        setPaymentModalOpen(true);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFee || !paymentAmount || Number(paymentAmount) <= 0) {
            alert('Please enter a valid payment amount.');
            return;
        }

        const outstanding = selectedFee.amount - (selectedFee.paidAmount || 0);
        if (Number(paymentAmount) > outstanding) {
            alert(`Payment amount cannot exceed the outstanding balance of ₹${outstanding}.`);
            return;
        }

        setIsPaying(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/fees/${selectedFee._id}/pay`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amountPaid: Number(paymentAmount),
                    paymentMethod,
                    transactionId,
                    remarks
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                alert(`Success: ${data.message}`);
                setPaymentModalOpen(false);
                setSelectedFee(null);
                // Refresh data from backend to sync summary and lists
                await fetchFeeData();
            } else {
                alert(`Payment recording failed: ${data.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Payment error:', err);
            alert('Failed to connect to backend to record payment.');
        } finally {
            setIsPaying(false);
        }
    };

    const isHostelFeePaid = summary.totalBilled > 0 && summary.totalPending === 0;
    const isHostelFeeUnpaid = summary.totalPending > 0;

    return (
        <>
            <Header title="Hostel Fee Portal" />
            <style>{`
                .container {
                    padding: 30px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .fees-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                /* Primary Hostel Fee Hero Card */
                .hostel-hero-card {
                    background: #ffffff;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    margin-bottom: 30px;
                    border: 1px solid #e3e6f0;
                    border-left: 6px solid ${isHostelFeePaid ? '#1cc88a' : isHostelFeeUnpaid ? '#e74a3b' : '#4e73df'};
                }

                .hostel-hero-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .hero-title-group {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .hero-icon {
                    width: 55px;
                    height: 55px;
                    border-radius: 14px;
                    background: ${isHostelFeePaid ? '#e6fffa' : isHostelFeeUnpaid ? '#fff5f5' : '#e8f0fe'};
                    color: ${isHostelFeePaid ? '#1cc88a' : isHostelFeeUnpaid ? '#e74a3b' : '#4e73df'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                }

                .hero-title {
                    font-size: 24px;
                    font-weight: 800;
                    color: #2d3748;
                    margin: 0 0 4px 0;
                }

                .hero-subtitle {
                    font-size: 13px;
                    color: #858796;
                    margin: 0;
                }

                .hero-status-badge {
                    padding: 8px 20px;
                    border-radius: 30px;
                    font-size: 14px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: ${isHostelFeePaid ? '#e6fffa' : isHostelFeeUnpaid ? '#fff5f5' : '#f8f9fc'};
                    color: ${isHostelFeePaid ? '#1cc88a' : isHostelFeeUnpaid ? '#e74a3b' : '#858796'};
                    border: 1px solid ${isHostelFeePaid ? '#b2f5ea' : isHostelFeeUnpaid ? '#fed7d7' : '#e2e8f0'};
                }

                .hero-details-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #f1f3f8;
                }

                .hero-detail-box {
                    background: #f8f9fc;
                    padding: 18px 20px;
                    border-radius: 12px;
                    border: 1px solid #eaecf4;
                }

                .hero-detail-label {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #858796;
                    margin-bottom: 6px;
                    letter-spacing: 0.5px;
                }

                .hero-detail-value {
                    font-size: 22px;
                    font-weight: 800;
                    color: #2d3748;
                    margin: 0;
                }

                .hero-detail-subtext {
                    font-size: 12px;
                    color: #858796;
                    margin-top: 4px;
                }

                /* Tables & Cards */
                .widget {
                    background: #fff;
                    border-radius: 14px;
                    padding: 25px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                    border: 1px solid #e3e6f0;
                    margin-bottom: 30px;
                }

                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #f1f3f8;
                }

                .widget-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #2d3748;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .invoice-table-container {
                    width: 100%;
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th {
                    background: #f8f9fc;
                    color: #858796;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 2px solid #e3e6f0;
                }

                td {
                    padding: 15px;
                    font-size: 14px;
                    color: #5a5c69;
                    border-bottom: 1px solid #f1f3f8;
                    vertical-align: middle;
                }

                tr:hover td {
                    background-color: #fdfdfd;
                }

                .status-badge-paid {
                    background: #e6fffa;
                    color: #1cc88a;
                    border: 1px solid #b2f5ea;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 800;
                    text-transform: uppercase;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }

                .status-badge-unpaid {
                    background: #fff5f5;
                    color: #e74a3b;
                    border: 1px solid #fed7d7;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 800;
                    text-transform: uppercase;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }

                .btn-pay-now {
                    background: #4e73df;
                    color: #ffffff;
                    border: none;
                    padding: 8px 18px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s;
                    box-shadow: 0 2px 6px rgba(78, 115, 223, 0.2);
                }

                .btn-pay-now:hover {
                    background: #2e59d9;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 10px rgba(78, 115, 223, 0.3);
                }

                /* Modal */
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
                    padding: 20px;
                }

                .modal-content {
                    background: white;
                    border-radius: 14px;
                    width: 100%;
                    max-width: 520px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                }

                .modal-header {
                    padding: 20px 25px;
                    border-bottom: 1px solid #eaecf4;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-body {
                    padding: 25px;
                }

                .form-group {
                    margin-bottom: 18px;
                }

                .form-group label {
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 6px;
                }

                .form-control {
                    width: 100%;
                    padding: 10px 14px;
                    border: 1px solid #d1d3e2;
                    border-radius: 8px;
                    font-size: 14px;
                    box-sizing: border-box;
                    font-family: inherit;
                }

                .form-control:focus {
                    outline: none;
                    border-color: #4e73df;
                }

                .modal-footer {
                    padding: 15px 25px;
                    background: #f8f9fc;
                    border-top: 1px solid #eaecf4;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }

                .error-box {
                    background: #fff5f5;
                    border: 1px solid #fed7d7;
                    padding: 20px;
                    border-radius: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }
            `}</style>

            <div className="container">
                {isLoading ? (
                    <div className="widget" style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '36px', color: '#4e73df', marginBottom: '15px' }}></i>
                        <p style={{ margin: 0, color: '#858796', fontSize: '15px' }}>Loading your hostel fee details...</p>
                    </div>
                ) : error ? (
                    <div className="error-box">
                        <div>
                            <h4 style={{ margin: '0 0 5px 0', color: '#e74a3b', fontWeight: 700 }}>
                                <i className="fas fa-exclamation-triangle"></i> Error Loading Hostel Fees
                            </h4>
                            <p style={{ margin: 0, color: '#5a5c69' }}>{error}</p>
                        </div>
                        <button className="btn-pay-now" style={{ background: '#e74a3b' }} onClick={fetchFeeData}>
                            <i className="fas fa-sync-alt"></i> Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {/* 1. Primary Hostel Fee Status Card */}
                        <div className="hostel-hero-card">
                            <div className="hostel-hero-header">
                                <div className="hero-title-group">
                                    <div className="hero-icon">
                                        <i className="fas fa-hotel"></i>
                                    </div>
                                    <div>
                                        <h2 className="hero-title">Hostel Fee Status</h2>
                                        <p className="hero-subtitle">Official hostel accommodation &amp; boarding fee tracking</p>
                                    </div>
                                </div>
                                <div>
                                    {fees.length === 0 ? (
                                        <span className="hero-status-badge">No Invoices</span>
                                    ) : isHostelFeePaid ? (
                                        <span className="hero-status-badge">
                                            <i className="fas fa-check-circle"></i> Status: Paid
                                        </span>
                                    ) : (
                                        <span className="hero-status-badge">
                                            <i className="fas fa-exclamation-circle"></i> Status: Not Paid
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="hero-details-grid">
                                <div className="hero-detail-box">
                                    <div className="hero-detail-label">Total Hostel Fee</div>
                                    <div className="hero-detail-value">₹{summary.totalBilled?.toLocaleString('en-IN') || 0}</div>
                                    <div className="hero-detail-subtext">Total billed amount</div>
                                </div>

                                {isHostelFeePaid ? (
                                    <>
                                        <div className="hero-detail-box" style={{ background: '#e6fffa', borderColor: '#b2f5ea' }}>
                                            <div className="hero-detail-label" style={{ color: '#1cc88a' }}>Paid Amount</div>
                                            <div className="hero-detail-value" style={{ color: '#1cc88a' }}>₹{summary.totalPaid?.toLocaleString('en-IN') || 0}</div>
                                            <div className="hero-detail-subtext" style={{ color: '#1cc88a' }}>
                                                <i className="fas fa-check-double"></i> 100% Settled
                                            </div>
                                        </div>

                                        <div className="hero-detail-box">
                                            <div className="hero-detail-label">Paid On</div>
                                            <div className="hero-detail-value" style={{ fontSize: '18px' }}>
                                                {latestPaidDate ? new Date(latestPaidDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Settled'}
                                            </div>
                                            <div className="hero-detail-subtext">
                                                {latestTxnId ? `Ref: ${latestTxnId}` : 'Payment verified'}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="hero-detail-box" style={{ background: '#fff5f5', borderColor: '#fed7d7' }}>
                                            <div className="hero-detail-label" style={{ color: '#e74a3b' }}>Amount Due</div>
                                            <div className="hero-detail-value" style={{ color: '#e74a3b' }}>₹{summary.totalPending?.toLocaleString('en-IN') || 0}</div>
                                            <div className="hero-detail-subtext" style={{ color: '#e74a3b', fontWeight: 600 }}>
                                                Requires Immediate Payment
                                            </div>
                                        </div>

                                        <div className="hero-detail-box">
                                            <div className="hero-detail-label">Payment Due Date</div>
                                            <div className="hero-detail-value" style={{ fontSize: '18px', color: '#2d3748' }}>
                                                {nextDueDate ? new Date(nextDueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </div>
                                            <div className="hero-detail-subtext">
                                                {summary.pendingInvoices} Pending Invoice{summary.pendingInvoices !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 2. Key Metrics Grid */}
                        <div className="fees-grid">
                            <div className="card border-blue">
                                <span className="card-label">Total Hostel Fee</span>
                                <h3>₹{summary.totalBilled?.toLocaleString('en-IN') || 0}</h3>
                                <p>Total accommodation fee</p>
                            </div>

                            <div className="card border-teal">
                                <span className="card-label">Paid Amount</span>
                                <h3>₹{summary.totalPaid?.toLocaleString('en-IN') || 0}</h3>
                                <p>Confirmed payments</p>
                            </div>

                            <div className={`card ${summary.totalPending > 0 ? 'border-red' : 'border-teal'}`}>
                                <span className="card-label">Due Amount</span>
                                <h3 style={{ color: summary.totalPending > 0 ? '#e74a3b' : '#1cc88a' }}>
                                    ₹{summary.totalPending?.toLocaleString('en-IN') || 0}
                                </h3>
                                <p>{summary.totalPending > 0 ? 'Pending payment' : 'Zero dues remaining'}</p>
                            </div>

                            <div className="card border-orange">
                                <span className="card-label">Overall Status</span>
                                <h3 style={{ fontSize: '22px', textTransform: 'uppercase', color: isHostelFeePaid ? '#1cc88a' : isHostelFeeUnpaid ? '#e74a3b' : '#858796' }}>
                                    {fees.length === 0 ? 'No Fee' : isHostelFeePaid ? 'Paid' : 'Not Paid'}
                                </h3>
                                <p>{fees.length === 0 ? 'No records' : isHostelFeePaid ? 'Hostel Fee Settled' : `${summary.pendingInvoices} invoice(s) due`}</p>
                            </div>
                        </div>

                        {/* 3. Hostel Fee Invoices & Receipts Breakdown Table */}
                        <div className="widget">
                            <div className="widget-header">
                                <h3 className="widget-title">
                                    <i className="fas fa-file-invoice-dollar" style={{ color: '#4e73df' }}></i>
                                    Hostel Fee Invoices &amp; Receipts
                                </h3>
                                <span style={{ fontSize: '13px', color: '#858796', fontWeight: 600 }}>
                                    {summary.pendingInvoices > 0 ? `${summary.pendingInvoices} Unpaid Invoice(s)` : 'All Invoices Cleared'}
                                </span>
                            </div>

                            {fees.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '50px 20px', color: '#858796' }}>
                                    <i className="fas fa-receipt" style={{ fontSize: '48px', color: '#dddfeb', marginBottom: '15px' }}></i>
                                    <h4 style={{ color: '#5a5c69', margin: '0 0 5px 0' }}>No Hostel Fee Records</h4>
                                    <p style={{ fontSize: '14px', margin: 0 }}>No hostel fee invoices have been generated for your account yet.</p>
                                </div>
                            ) : (
                                <div className="invoice-table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Receipt / Invoice No</th>
                                                <th>Fee Description</th>
                                                <th>Total Amount</th>
                                                <th>Paid Amount</th>
                                                <th>Due Amount</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                                <th>Payment Info</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fees.map((fee) => {
                                                const outstanding = Math.max(0, fee.amount - (fee.paidAmount || 0));
                                                const isPaid = fee.status === 'Paid';

                                                return (
                                                    <tr key={fee._id}>
                                                        <td style={{ fontWeight: 700, color: '#4e73df', fontSize: '13px' }}>
                                                            {fee.receiptNo || `#HOSTEL-${fee._id.substring(fee._id.length - 6).toUpperCase()}`}
                                                        </td>
                                                        <td>
                                                            <div style={{ fontWeight: 700, color: '#2d3748' }}>
                                                                {fee.feeType || 'Hostel Fee'}
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: '#858796' }}>
                                                                {fee.academicYear} • {fee.semester}
                                                            </div>
                                                            {fee.remarks && (
                                                                <div style={{ fontSize: '11px', color: '#a0aec0', fontStyle: 'italic' }}>
                                                                    "{fee.remarks}"
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td style={{ fontWeight: 700, color: '#2d3748' }}>
                                                            ₹{fee.amount?.toLocaleString('en-IN')}
                                                        </td>
                                                        <td style={{ color: '#1cc88a', fontWeight: 700 }}>
                                                            ₹{fee.paidAmount?.toLocaleString('en-IN') || 0}
                                                        </td>
                                                        <td style={{ color: outstanding > 0 ? '#e74a3b' : '#1cc88a', fontWeight: 700 }}>
                                                            ₹{outstanding.toLocaleString('en-IN')}
                                                        </td>
                                                        <td style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>
                                                            {new Date(fee.dueDate).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td>
                                                            {isPaid ? (
                                                                <span className="status-badge-paid">
                                                                    <i className="fas fa-check-circle"></i> Paid
                                                                </span>
                                                            ) : (
                                                                <span className="status-badge-unpaid">
                                                                    <i className="fas fa-clock"></i> Not Paid
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {fee.paidAmount > 0 ? (
                                                                <div style={{ fontSize: '12px', color: '#5a5c69' }}>
                                                                    <div>Method: <strong>{fee.paymentMethod || 'Online'}</strong></div>
                                                                    {fee.transactionId && <div>Txn ID: <strong>{fee.transactionId}</strong></div>}
                                                                    {fee.paymentDate && (
                                                                        <div style={{ color: '#858796' }}>
                                                                            Paid On: {new Date(fee.paymentDate).toLocaleDateString('en-GB')}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span style={{ fontSize: '12px', color: '#a0aec0', fontStyle: 'italic' }}>
                                                                    Awaiting payment
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {!isPaid ? (
                                                                <button
                                                                    type="button"
                                                                    className="btn-pay-now"
                                                                    onClick={() => openPaymentModal(fee)}
                                                                >
                                                                    <i className="fas fa-credit-card"></i> Pay Now
                                                                </button>
                                                            ) : (
                                                                <span style={{ color: '#1cc88a', fontSize: '13px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                    <i className="fas fa-check-double"></i> Settled
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Payment Simulator Modal */}
                {paymentModalOpen && selectedFee && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#4e73df', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="fas fa-credit-card"></i> Pay Hostel Fee
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setPaymentModalOpen(false)}
                                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#858796' }}
                                >
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handlePaymentSubmit}>
                                <div className="modal-body">
                                    <div style={{ background: '#f8f9fc', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #eaecf4' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                            <span style={{ color: '#858796' }}>Fee Category:</span>
                                            <strong style={{ color: '#2d3748' }}>{selectedFee.feeType || 'Hostel Fee'}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                            <span style={{ color: '#858796' }}>Total Fee Amount:</span>
                                            <strong style={{ color: '#2d3748' }}>₹{selectedFee.amount?.toLocaleString('en-IN')}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                            <span style={{ color: '#858796' }}>Already Paid:</span>
                                            <strong style={{ color: '#1cc88a' }}>₹{(selectedFee.paidAmount || 0).toLocaleString('en-IN')}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingTop: '6px', borderTop: '1px solid #e3e6f0' }}>
                                            <span style={{ fontWeight: 700, color: '#e74a3b' }}>Remaining Due:</span>
                                            <strong style={{ color: '#e74a3b', fontSize: '16px' }}>₹{(selectedFee.amount - (selectedFee.paidAmount || 0)).toLocaleString('en-IN')}</strong>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="amountPaid">Amount to Pay (₹)</label>
                                        <input
                                            type="number"
                                            id="amountPaid"
                                            className="form-control"
                                            min="1"
                                            max={selectedFee.amount - (selectedFee.paidAmount || 0)}
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="paymentMethod">Payment Method</label>
                                        <select
                                            id="paymentMethod"
                                            className="form-control"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            required
                                        >
                                            <option value="UPI">UPI (GooglePay / PhonePe / Paytm / BHIM)</option>
                                            <option value="Net Banking">Net Banking (SBI / HDFC / ICICI / Axis)</option>
                                            <option value="Debit Card">Debit / Credit Card (Visa / MasterCard / RuPay)</option>
                                            <option value="Bank Transfer">Bank Transfer / NEFT / RTGS</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="transactionId">Transaction Reference ID (Simulated)</label>
                                        <input
                                            type="text"
                                            id="transactionId"
                                            className="form-control"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label htmlFor="remarks">Payment Remarks (Optional)</label>
                                        <input
                                            type="text"
                                            id="remarks"
                                            className="form-control"
                                            placeholder="e.g. Hostel Fee 1st Installment"
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        style={{ background: '#eaecf4', color: '#5a5c69', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                                        onClick={() => setPaymentModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-pay-now"
                                        style={{ background: '#1cc88a' }}
                                        disabled={isPaying}
                                    >
                                        {isPaying ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-check"></i> Confirm Payment</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default StudentFees;
