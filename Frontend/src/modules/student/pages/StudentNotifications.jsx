import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../config';

function StudentNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setStatusMessage('Session expired. Please log in.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const backendNotifications = await response.json();
                const sorted = (backendNotifications || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setNotifications(sorted);
            } else {
                const err = await response.json();
                console.error('Error loading notifications:', err.message || err);
                setStatusMessage('Could not load system notifications.');
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            setStatusMessage('Unable to fetch system notifications.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleDismiss = (id) => {
        const updated = notifications.filter(n => n._id !== id);
        setNotifications(updated);
        setStatusMessage('Notification dismissed.');
        setTimeout(() => setStatusMessage(''), 2500);
    };

    const handleNotifClick = (notif) => {
        if (notif.type === 'fee') {
            navigate('/student/settings');
        } else if (notif.type === 'gatepass') {
            navigate('/student/gatepass');
        } else if (notif.type === 'attendance') {
            navigate('/student/attendance');
        } else {
            navigate('/student/announcements');
        }
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
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .notif-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 12px rgba(0,0,0,0.06);
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

                .notif-content {
                    font-size: 14px;
                    color: #5a5c69;
                    line-height: 1.5;
                    margin-bottom: 10px;
                }

                .notif-meta {
                    display: flex;
                    gap: 12px;
                    font-size: 11px;
                    color: #858796;
                    flex-wrap: wrap;
                }

                .meta-tag {
                    padding: 3px 8px;
                    background: #f8f9fc;
                    border-radius: 4px;
                    font-weight: 600;
                }

                .btn-dismiss {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: transparent;
                    border: none;
                    color: #b7b9cc;
                    cursor: pointer;
                    font-size: 16px;
                    transition: color 0.2s;
                    z-index: 2;
                }

                .btn-dismiss:hover {
                    color: #e74a3b;
                }

                .empty-alert {
                    text-align: center;
                    padding: 40px 20px;
                    background: #fff;
                    border-radius: 12px;
                    border: 1px solid #eaecf4;
                    color: #858796;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="notif-container">
                <div className="notif-actions">
                    <button className="btn-clear-all" onClick={handleDismissAll}>
                        <i className="fas fa-trash-alt"></i> Clear All Alerts
                    </button>
                    {statusMessage && (
                        <div className="status-toast">{statusMessage}</div>
                    )}
                </div>

                {isLoading ? (
                    <div className="empty-alert">
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '10px', color: '#4e73df' }}></i>
                        <p>Loading alerts...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="empty-alert">
                        <i className="fas fa-bell-slash" style={{ fontSize: '32px', marginBottom: '15px', color: '#dddfeb' }}></i>
                        <h4 style={{ margin: '0 0 5px 0', color: '#5a5c69' }}>All Clear!</h4>
                        <p style={{ margin: 0 }}>No notifications are available right now.</p>
                    </div>
                ) : (
                    <div className="notif-list">
                        {notifications.map(notif => (
                            <div className="notif-card" key={notif._id}>
                                <div 
                                    className="notif-icon-wrapper"
                                    style={{ 
                                        background: getIconBackground(notif.type, notif.category)
                                    }}
                                >
                                    {getIcon(notif.type, notif.category)}
                                </div>
                                <div className="notif-details">
                                    <div className="notif-title">{notif.title}</div>
                                    <div className="notif-content">{notif.content}</div>
                                    <div className="notif-meta">
                                        <span className="meta-tag">Category: {notif.category}</span>
                                        <span className="meta-tag">Date: {new Date(notif.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button 
                                    className="btn-dismiss" 
                                    onClick={() => handleDismiss(notif._id)}
                                    title="Dismiss notification"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default StudentNotifications;
