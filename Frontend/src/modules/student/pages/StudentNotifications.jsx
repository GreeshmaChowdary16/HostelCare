import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

function StudentNotifications() {
    const personalAlerts = [
        {
            id: 'pers-1',
            title: 'Pending Fee Reminder',
            content: 'Your pending fee of ₹12,500 for the current semester is due by 15th Feb 2026. Please clear it online to avoid late fee penalties.',
            category: 'Emergency',
            type: 'fee',
            createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
            id: 'pers-2',
            title: 'Gate Pass Approved',
            content: 'Your gate pass request for Home Visit (Lucknow) from 12th Feb to 15th Feb has been Approved by rector Mrs. Priya Kumar.',
            category: 'Info',
            type: 'gatepass',
            createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
        },
        {
            id: 'pers-3',
            title: 'Attendance Alert',
            content: 'Your overall attendance for this month is 92%. Please make sure to mark attendance daily to keep it above the minimum 75% requirement.',
            category: 'Warning',
            type: 'attendance',
            createdAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
        }
    ];

    const [notifications, setNotifications] = useState([...personalAlerts]);
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
                    const backendNotifications = await response.json();
                    const combined = [...personalAlerts, ...backendNotifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setNotifications(combined);
                } else {
                    const err = await response.json();
                    console.error('Error loading notifications:', err.message || err);
                    setStatusMessage('Could not load system notifications.');
                }
            } catch (error) {
                console.error('Error loading notifications:', error);
                setStatusMessage('Unable to fetch system notifications.');
            }
        };

        fetchNotifications();
    }, []);

    const handleDismiss = (id) => {
        const updated = notifications.filter(n => n.id !== id);
        setNotifications(updated);
        setStatusMessage('Notification dismissed.');
        setTimeout(() => setStatusMessage(''), 2500);
    };

    const handleDismissAll = () => {
        if (notifications.length === 0) return;
        if (!window.confirm('Dismiss all alerts?')) return;
        setNotifications([]);
        setStatusMessage('All notifications cleared.');
        setTimeout(() => setStatusMessage(''), 2500);
    };

    const getIcon = (type, category) => {
        if (type === 'fee') return <i className="fas fa-file-invoice-dollar" style={{ color: '#e74a3b' }}></i>;
        if (type === 'gatepass') return <i className="fas fa-id-card" style={{ color: '#1cc88a' }}></i>;
        if (type === 'attendance') return <i className="fas fa-calendar-check" style={{ color: '#f6c23e' }}></i>;
        
        switch (category) {
            case 'Emergency': return <i className="fas fa-exclamation-triangle" style={{ color: '#e74a3b' }}></i>;
            case 'Warning': return <i className="fas fa-exclamation-circle" style={{ color: '#f6c23e' }}></i>;
            default: return <i className="fas fa-info-circle" style={{ color: '#4e73df' }}></i>;
        }
    };

    const getIconBackground = (type, category) => {
        if (type === 'fee') return '#fff5f5';
        if (type === 'gatepass') return '#e6fffa';
        if (type === 'attendance') return '#fffdf0';

        switch (category) {
            case 'Emergency': return '#fff5f5';
            case 'Warning': return '#fffdf0';
            default: return '#e8f0fe';
        }
    };

    return (
        <>
            <Header title="Your Notifications" />
            <style>{`
                .notif-container {
                    padding: 30px;
                    max-width: 1000px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .notif-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                }

                .btn-clear-all {
                    background: transparent;
                    border: 1px solid #d1d3e2;
                    color: #858796;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }

                .btn-clear-all:hover {
                    background: #f8f9fc;
                    border-color: #858796;
                    color: #5a5c69;
                }

                .status-toast {
                    padding: 10px 15px;
                    background: #eff6ff;
                    color: #1d4ed8;
                    border: 1px solid #bfdbfe;
                    border-radius: 6px;
                    font-size: 13px;
                    animation: fadeIn 0.2s ease;
                }

                .notif-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .notif-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.04);
                    border: 1px solid #eaecf4;
                    display: flex;
                    gap: 20px;
                    position: relative;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .notif-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 12px rgba(0,0,0,0.04);
                }

                .notif-icon-wrapper {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    flex-shrink: 0;
                }

                .notif-details {
                    flex: 1;
                    padding-right: 25px;
                }

                .notif-title {
                    font-weight: 700;
                    color: #333;
                    font-size: 16px;
                    margin-bottom: 5px;
                }

                .notif-text {
                    font-size: 13px;
                    color: #6e707e;
                    line-height: 1.6;
                }

                .notif-meta {
                    margin-top: 10px;
                    display: flex;
                    gap: 15px;
                    font-size: 11px;
                    color: #858796;
                }

                .meta-tag {
                    background: #f8f9fc;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .meta-tag-emergency { color: #e74a3b; background: #fff5f5; }
                .meta-tag-warning { color: #856404; background: #fffdf0; }
                .meta-tag-info { color: #1a73e8; background: #e8f0fe; }

                .btn-dismiss {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: transparent;
                    color: #b7b9cc;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    transition: color 0.2s;
                }

                .btn-dismiss:hover {
                    color: #e74a3b;
                }

                .empty-state {
                    background: #fff;
                    border-radius: 12px;
                    padding: 50px 30px;
                    text-align: center;
                    color: #858796;
                    border: 1px solid #eaecf4;
                }

                .empty-state i {
                    font-size: 40px;
                    color: #dddfeb;
                    margin-bottom: 15px;
                }

                .empty-state p {
                    font-size: 15px;
                    margin: 0;
                }
            `}</style>

            <div className="notif-container">
                <div className="notif-actions">
                    <span style={{ fontSize: '14px', color: '#858796', fontWeight: 500 }}>
                        {notifications.length} {notifications.length === 1 ? 'Notification' : 'Notifications'} remaining
                    </span>
                    {notifications.length > 0 && (
                        <button className="btn-clear-all" onClick={handleDismissAll}>
                            <i className="fas fa-trash-alt"></i> Clear All
                        </button>
                    )}
                </div>

                {statusMessage && <div className="status-toast">{statusMessage}</div>}

                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-bell-slash"></i>
                        <p>You're all caught up! No new notifications.</p>
                    </div>
                ) : (
                    <div className="notif-list">
                        {notifications.map((notif) => (
                            <div key={notif.id} className="notif-card">
                                <button className="btn-dismiss" onClick={() => handleDismiss(notif.id)} title="Dismiss alert">
                                    <i className="fas fa-times"></i>
                                </button>
                                <div 
                                    className="notif-icon-wrapper" 
                                    style={{ background: getIconBackground(notif.type, notif.category) }}
                                >
                                    {getIcon(notif.type, notif.category)}
                                </div>
                                <div className="notif-details">
                                    <div className="notif-title">{notif.title}</div>
                                    <div className="notif-text">{notif.content}</div>
                                    <div className="notif-meta">
                                        <span className={`meta-tag meta-tag-${(notif.category || 'Info').toLowerCase()}`}>
                                            {notif.category || 'Info'}
                                        </span>
                                        <span>
                                            {new Date(notif.createdAt).toLocaleDateString(undefined, {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default StudentNotifications;
