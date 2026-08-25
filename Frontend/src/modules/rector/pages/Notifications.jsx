import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [pendingFeesCount, setPendingFeesCount] = useState('N/A');
    const [lastPaymentDate, setLastPaymentDate] = useState('N/A');
    const [isLoading, setIsLoading] = useState(true);
    const [isSendingReminder, setIsSendingReminder] = useState(false);

    const fetchData = async () => {

        setIsLoading(true);
        setStatusMessage('');
        const token = localStorage.getItem('token');
        if (!token) {
            setStatusMessage('Session expired. Please log in.');
            setIsLoading(false);
            return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            // 1. Fetch system notifications
            try {
                const response = await fetch(`${API_BASE_URL}/notifications`, { headers });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data || []);
                }
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }

            // 2. Fetch fee stats
            try {
                const statsRes = await fetch(`${API_BASE_URL}/fees/stats`, { headers });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    if (statsData.success && statsData.stats) {
                        const counts = statsData.stats.counts;
                        const pendingTotal = (counts.pending || 0) + (counts.overdue || 0) + (counts.partial || 0);
                        setPendingFeesCount(pendingTotal);
                    }
                }
            } catch (err) {
                console.error('Error fetching fee stats:', err);
            }

            // 3. Fetch all fees to find the closest upcoming due date
            try {
                const feesRes = await fetch(`${API_BASE_URL}/fees`, { headers });
                if (feesRes.ok) {
                    const feesData = await feesRes.json();
                    const unpaidFees = feesData.filter(f => f.status === 'Pending' || f.status === 'Overdue' || f.status === 'Partial');
                    if (unpaidFees.length > 0) {
                        // Find closest due date
                        const sortedDates = unpaidFees
                            .map(f => new Date(f.dueDate))
                            .filter(d => !isNaN(d))
                            .sort((a, b) => a - b);
                        if (sortedDates.length > 0) {
                            setLastPaymentDate(sortedDates[0].toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
                        }
                    } else {
                        setLastPaymentDate('No pending due dates');
                    }
                }
            } catch (err) {
                console.error('Error fetching fees list:', err);
            }
        } catch (error) {
            console.error('General notifications fetch error:', error);
            setStatusMessage('Unable to load some notification metrics.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSendReminder = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setIsSendingReminder(true);
        setStatusMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: 'Fee Payment Reminder',
                    content: 'Please clear any pending hostel fees before the payment deadline.',
                    category: 'Warning',
                    target: 'Students'
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Could not send reminder.');
            setStatusMessage('Fee reminder sent to students.');
        } catch (error) {
            setStatusMessage(error.message);
        } finally {
            setIsSendingReminder(false);
        }
    };

    return (
        <>
            <Header title="Notifications" />

            <div className="container" style={{ padding: '30px', maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {/* Fee Payment Alerts */}
                <div className="widget" style={{ background: '#ffffff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', borderLeft: '5px solid #e74a3b', border: '1px solid #eaecf4', borderLeftWidth: '5px' }}>
                    <div className="widget-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eaecf4', paddingBottom: '15px' }}>
                        <div className="widget-title" style={{ fontSize: '18px', fontWeight: 700, color: '#e74a3b' }}>Fee Payment Alerts</div>
                        <button className="btn-sm" style={{ padding: '6px 12px', background: '#e74a3b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }} onClick={fetchData}>
                            Refresh Alerts
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '14px', color: '#858796', fontWeight: 500 }}>Unpaid/Pending Fee Invoices</div>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: '#5a5c69', marginTop: '5px' }}>{pendingFeesCount}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: '#858796', fontWeight: 500 }}>Next Impending Due Date</div>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: '#e74a3b', marginTop: '5px' }}>{lastPaymentDate}</div>
                        </div>
                    </div>
                </div>

                <div className="widget" style={{ background: '#ffffff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #eaecf4' }}>
                    <div className="widget-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eaecf4', paddingBottom: '15px' }}>
                        <div className="widget-title" style={{ fontSize: '18px', fontWeight: 700, color: '#5a5c69' }}>Recent System Notifications</div>
                    </div>
                    {statusMessage && (
                        <div style={{ background: '#fff4e5', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
                            {statusMessage}
                        </div>
                    )}
                    {isLoading ? (
                        <div style={{ padding: '30px', color: '#858796', textAlign: 'center' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '12px', color: '#4e73df' }}></i>
                            <p>Loading recent alerts...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div style={{ padding: '30px', color: '#858796', textAlign: 'center' }}>
                            <i className="fas fa-bell-slash" style={{ fontSize: '32px', marginBottom: '12px', color: '#d1d3e2' }}></i>
                            <p>No system notifications are available right now.</p>
                        </div>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {notifications.map((notif) => (
                                <li key={notif._id} style={{ padding: '18px 20px', borderBottom: '1px solid #f1f3f8', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
                                        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#f8f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4e73df', flexShrink: 0 }}>
                                            <i className="fas fa-bell"></i>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#333' }}>{notif.title}</div>
                                            <div style={{ margin: '8px 0', fontSize: '13px', color: '#5a5c69', lineHeight: 1.6 }}>{notif.content}</div>
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '11px', color: '#858796' }}>
                                                <span style={{ padding: '4px 10px', background: '#e8f0fe', borderRadius: '999px', fontWeight: 600 }}>{notif.category}</span>
                                                <span style={{ padding: '4px 10px', background: '#f0fdf4', borderRadius: '999px', fontWeight: 600 }}>Target: {notif.target}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                        <div style={{ fontSize: '12px', color: '#858796', fontWeight: 600 }}>{notif.author?.name || 'System'}</div>
                                        <div style={{ fontSize: '11px', color: '#c3c6d9', marginTop: '8px' }}>{new Date(notif.createdAt).toLocaleString()}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default Notifications;
