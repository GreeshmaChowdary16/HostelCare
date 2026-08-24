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
    const [overdueAmount, setOverdueAmount] = useState(0);
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
                setFees(data.fees || []);
                setSummary(data.summary || {
                    totalBilled: 0,
                    totalPaid: 0,
                    totalPending: 0,
                    pendingInvoices: 0
                });

                // Calculate overdue sum from fees list
                const overdueSum = (data.fees || [])
                    .filter(f => f.status === 'Overdue')
                    .reduce((acc, f) => acc + (f.amount - (f.paidAmount || 0)), 0);
                setOverdueAmount(overdueSum);
            } else {
                setError(data.message || 'Error occurred while loading fee data.');
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
        setTransactionId(`TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`);
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

    return (
        <>
            <Header title="Student Fee Portal" />
            <style>{`
                .fees-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1100;
                    padding: 15px;
                }

                .modal-content {
                    background: #fff;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 500px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    animation: fadeIn 0.3s ease-out;
                }

                .modal-body {
                    padding: 20px 25px;
                }

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding: 15px 25px;
                    border-top: 1px solid #e3e6f0;
                    background: #f8f9fc;
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                }

                .form-group {
                    margin-bottom: 15px;
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
                    transition: border-color 0.2s;
                }

                .form-control:focus {
                    border-color: #4e73df;
                }

                .invoice-table-container {
                    overflow-x: auto;
                    margin-top: 15px;
                }

                .payment-details {
                    font-size: 11px;
                    color: #858796;
                    margin-top: 4px;
                    line-height: 1.4;
                }

                .payment-details strong {
                    color: #5a5c69;
                }

                .error-box {
                    background: #fff5f5;
                    border-left: 5px solid #e74a3b;
                    color: #5a5c69;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    align-items: flex-start;
                }

                .retry-btn {
                    padding: 8px 16px;
                    background: #e74a3b;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .retry-btn:hover {
                    background: #be2e21;
                }

                .skeleton-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .skeleton-card {
                    height: 120px;
                    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
                    background-size: 200% 100%;
                    animation: loading-shimmer 1.5s infinite;
                    border-radius: 12px;
                }

                .skeleton-table {
                    height: 300px;
                    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
                    background-size: 200% 100%;
                    animation: loading-shimmer 1.5s infinite;
                    border-radius: 12px;
                }

                @keyframes loading-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            <div className="container">
                {isLoading ? (
                    <div className="skeleton-container">
                        <div className="fees-grid">
                            <div className="skeleton-card"></div>
                            <div className="skeleton-card"></div>
                            <div className="skeleton-card"></div>
                            <div className="skeleton-card"></div>
                        </div>
                        <div className="skeleton-table"></div>
                    </div>
                ) : error ? (
                    <div className="error-box">
                        <div>
                            <h4 style={{ margin: '0 0 5px 0', color: '#e74a3b', fontWeight: 700 }}><i className="fas fa-exclamation-triangle"></i> Error Loading Fees</h4>
                            <p style={{ margin: 0 }}>{error}</p>
                        </div>
                        <button className="retry-btn" onClick={fetchFeeData}>
                            <i className="fas fa-sync-alt"></i> Retry Fetching
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Summary cards */}
                        <div className="fees-grid">
                            <div className="card bg-blue">
                                <span className="card-label">Total Billed</span>
                                <h3>₹{summary.totalBilled?.toLocaleString('en-IN') || 0}</h3>
                                <p>All generated invoices</p>
                            </div>

                            <div className="card bg-teal">
                                <span className="card-label">Paid Amount</span>
                                <h3>₹{summary.totalPaid?.toLocaleString('en-IN') || 0}</h3>
                                <p>Successful payments</p>
                            </div>

                            <div className="card bg-orange">
                                <span className="card-label">Pending Amount</span>
                                <h3>₹{summary.totalPending?.toLocaleString('en-IN') || 0}</h3>
                                <p>Awaiting settlement</p>
                            </div>

                            <div className="card bg-red">
                                <span className="card-label">Overdue Fees</span>
                                <h3>₹{overdueAmount?.toLocaleString('en-IN') || 0}</h3>
                                <p>Passed due date</p>
                            </div>
                        </div>

                        {/* Invoice Table Widget */}
                        <div className="widget">
                            <div className="widget-header">
                                <h3 className="widget-title">Fee Invoices & Payments</h3>
                                <span style={{ fontSize: '13px', color: '#858796', fontWeight: 600 }}>
                                    {summary.pendingInvoices} Pending Invoices
                                </span>
                            </div>

                            {fees.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#858796' }}>
                                    <i className="fas fa-receipt" style={{ fontSize: '48px', color: '#dddfeb', marginBottom: '15px' }}></i>
                                    <p style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>No fee records found.</p>
                                </div>
                            ) : (
                                <div className="invoice-table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Invoice ID</th>
                                                <th>Fee Description</th>
                                                <th>Academic Details</th>
                                                <th>Amount</th>
                                                <th>Paid</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                                <th>Payment Info</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fees.map((fee) => {
                                                const outstanding = fee.amount - (fee.paidAmount || 0);
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
                                                            <div style={{ fontWeight: 600, color: '#333' }}>{fee.feeType}</div>
                                                            {fee.remarks && <div style={{ fontSize: '11px', color: '#858796', fontStyle: 'italic' }}>"{fee.remarks}"</div>}
                                                        </td>
                                                        <td>
                                                            <div>{fee.academicYear}</div>
                                                            <div style={{ fontSize: '11px', color: '#858796' }}>{fee.semester}</div>
                                                        </td>
                                                        <td style={{ fontWeight: 600 }}>₹{fee.amount?.toLocaleString('en-IN')}</td>
                                                        <td style={{ color: '#1cc88a', fontWeight: 600 }}>₹{fee.paidAmount?.toLocaleString('en-IN') || 0}</td>
                                                        <td style={{ whiteSpace: 'nowrap' }}>
                                                            {new Date(fee.dueDate).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td>
                                                            <span className={`status-badge ${badgeClass}`}>
                                                                {fee.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {fee.paidAmount > 0 ? (
                                                                <div className="payment-details">
                                                                    <div>Method: <strong>{fee.paymentMethod || 'N/A'}</strong></div>
                                                                    {fee.transactionId && <div>Txn ID: <strong>{fee.transactionId}</strong></div>}
                                                                    {fee.paymentDate && (
                                                                        <div>Date: <strong>{new Date(fee.paymentDate).toLocaleDateString('en-GB')}</strong></div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span style={{ fontSize: '12px', color: '#c5c7d6', fontStyle: 'italic' }}>No payment</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {fee.status !== 'Paid' ? (
                                                                <button
                                                                    type="button"
                                                                    className="btn-action approve-btn"
                                                                    onClick={() => openPaymentModal(fee)}
                                                                >
                                                                    <i className="fas fa-credit-card"></i> Pay Now
                                                                </button>
                                                            ) : (
                                                                <span style={{ color: '#1cc88a', fontSize: '12px', fontWeight: 700 }}>
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
                        <div className="modal-content widget" style={{ margin: 0, padding: 0 }}>
                            <div className="widget-header" style={{ padding: '20px 25px 15px', borderBottom: '1px solid #e3e6f0', marginBottom: 0 }}>
                                <h3 className="widget-title" style={{ color: '#4e73df' }}>
                                    <i className="fas fa-credit-card"></i> Payment Simulator
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setPaymentModalOpen(false)}
                                    style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#858796' }}
                                >
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handlePaymentSubmit}>
                                <div className="modal-body">
                                    <div style={{ background: '#f8f9fc', padding: '12px 15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eaecf4' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                                            <span>Fee Type:</span>
                                            <strong style={{ color: '#333' }}>{selectedFee.feeType}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                                            <span>Total Amount:</span>
                                            <strong style={{ color: '#333' }}>₹{selectedFee.amount}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                            <span>Outstanding:</span>
                                            <strong style={{ color: '#e74a3b' }}>₹{selectedFee.amount - (selectedFee.paidAmount || 0)}</strong>
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
                                            <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                                            <option value="Card">Credit / Debit Card</option>
                                            <option value="Net Banking">Net Banking</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
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
                                        <label htmlFor="remarks">Remarks (Optional)</label>
                                        <input
                                            type="text"
                                            id="remarks"
                                            className="form-control"
                                            placeholder="Notes about payment"
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn-action"
                                        style={{ background: '#e74a3b', color: 'white' }}
                                        onClick={() => setPaymentModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-action"
                                        style={{ background: '#1cc88a', color: 'white' }}
                                        disabled={isPaying}
                                    >
                                        {isPaying ? 'Processing...' : 'Confirm Simulated Payment'}
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
