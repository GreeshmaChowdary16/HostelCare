import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${API_BASE_URL}/notifications`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                } else {
                    const err = await response.json();
                    setStatusMessage(err.message || 'Could not load notifications.');
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setStatusMessage('Unable to fetch notifications.');
            }
        };

        fetchNotifications();
    }, []);

    return (
        <>
            <Header title="Notifications" />

            <div className="container">
                {/* Fee Payment Alerts */}
                <div className="widget" style={{ borderLeft: '5px solid #e74a3b' }}>
                    <div className="widget-header">
                        <div className="widget-title" style={{ color: '#e74a3b' }}>Fee Payment Alerts</div>
                        <button className="btn-sm">Send Reminder</button>
                    </div>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '14px', color: '#858796' }}>Students Pending Fees</div>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: '#5a5c69' }}>45</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: '#858796' }}>Last Date of Payment</div>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: '#e74a3b' }}>25th Jan 2026</div>
                        </div>
                    </div>
                </div>

                <div className="widget">
                    <div className="widget-header">
                        <div className="widget-title">Recent Notifications</div>
                    </div>
                    {statusMessage && (
                        <div style={{ background: '#fff4e5', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
                            {statusMessage}
                        </div>
                    )}
                    {notifications.length === 0 ? (
                        <div style={{ padding: '30px', color: '#858796', textAlign: 'center' }}>
                            <i className="fas fa-bell-slash" style={{ fontSize: '32px', marginBottom: '12px', color: '#d1d3e2' }}></i>
                            <p>No notifications are available right now.</p>
                        </div>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {notifications.map((notif) => (
                                <li key={notif._id} style={{ padding: '18px 20px', borderBottom: '1px solid #f1f3f8', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flex: 1 }}>
                                        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#f8f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4e73df' }}>
                                            <i className="fas fa-bell"></i>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#333' }}>{notif.title}</div>
                                            <div style={{ margin: '8px 0', fontSize: '13px', color: '#5a5c69', lineHeight: 1.6 }}>{notif.content}</div>
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '11px', color: '#858796' }}>
                                                <span style={{ padding: '4px 10px', background: '#e8f0fe', borderRadius: '999px' }}>{notif.category}</span>
                                                <span style={{ padding: '4px 10px', background: '#f0fdf4', borderRadius: '999px' }}>Target: {notif.target}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                        <div style={{ fontSize: '12px', color: '#858796' }}>{notif.author?.name || 'System'}</div>
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
