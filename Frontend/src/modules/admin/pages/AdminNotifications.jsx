import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Info');
    const [target, setTarget] = useState('All');
    const [statusMessage, setStatusMessage] = useState('');

    // Preloaded system logs
    const systemLogs = [
        { id: 1, action: 'User Registration', detail: 'New student account registered (Anjali Sharma, 2022CS1045)', time: '10 mins ago', type: 'user' },
        { id: 2, action: 'Gate Pass Status Change', detail: 'Rector Mrs. Priya Kumar approved gate pass for Lucknow', time: '1 hour ago', type: 'gatepass' },
        { id: 3, action: 'Complaint Resolved', detail: 'Complaint #302: "Taps leaking" resolved by Plumber Suresh Verma', time: '2 hours ago', type: 'complaint' },
        { id: 4, action: 'Mess Menu Updated', detail: 'Admin Mr. System Admin updated Friday dinner menu details', time: 'Yesterday', type: 'mess' },
        { id: 5, action: 'Rector Assigned', detail: 'Rector Priya Kumar assigned to Girls Hostel A', time: '2 days ago', type: 'admin' }
    ];

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
                setStatusMessage('Could not load notifications.');
            }
        };

        fetchNotifications();
    }, []);

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setStatusMessage('Title and message content are required.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setStatusMessage('Please login to broadcast notifications.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                    category,
                    target,
                })
            });

            const data = await response.json();
            if (response.ok) {
                setStatusMessage('Notification broadcasted successfully!');
                setTitle('');
                setContent('');
                setCategory('Info');
                setTarget('All');
                setNotifications(prev => [data.notification, ...prev]);
            } else {
                setStatusMessage(data.message || 'Failed to broadcast notification.');
            }
        } catch (error) {
            console.error('Error broadcasting notification:', error);
            setStatusMessage('Server error while broadcasting notification.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to stop/delete this broadcast?')) return;
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setNotifications(prev => prev.filter(n => n._id !== id));
                setStatusMessage('Broadcast deleted.');
            } else {
                setStatusMessage(data.message || 'Failed to delete broadcast.');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
            setStatusMessage('Server error while deleting broadcast.');
        }
    };

    const getCategoryBadgeColor = (cat) => {
        switch (cat) {
            case 'Emergency': return 'badge-danger';
            case 'Warning': return 'badge-warning';
            default: return 'badge-info';
        }
    };

    const getTargetBadgeColor = (targ) => {
        switch (targ) {
            case 'Students': return 'target-student';
            case 'Rectors': return 'target-rector';
            default: return 'target-all';
        }
    };

    return (
        <>
            <Header title="System Notifications" />
            <style>{`
                .notif-dashboard {
                    padding: 30px;
                    max-width: 1600px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 30px;
                    align-items: flex-start;
                }

                @media (max-width: 1024px) {
                    .notif-dashboard {
                        grid-template-columns: 1fr;
                    }
                }

                .card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05);
                    border: 1px solid #eaecf4;
                }

                .card-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #eaecf4;
                    padding-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .form-group {
                    margin-bottom: 18px;
                }

                .form-group label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    color: #5a5c69;
                    margin-bottom: 6px;
                }

                .form-control {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #d1d3e2;
                    border-radius: 6px;
                    font-family: inherit;
                    font-size: 14px;
                    color: #4e73df;
                    background: #fff;
                    transition: border-color 0.2s;
                }

                .form-control:focus {
                    border-color: #4e73df;
                    outline: none;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .btn-primary {
                    background: #4e73df;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: background 0.2s, transform 0.1s;
                    width: 100%;
                    box-shadow: 0 4px 6px rgba(78, 115, 223, 0.15);
                }

                .btn-primary:hover {
                    background: #2e59d9;
                }

                .btn-primary:active {
                    transform: scale(0.98);
                }

                .status-toast {
                    padding: 12px 15px;
                    background: #e3fdf4;
                    color: #1cc88a;
                    border: 1px solid #c7f3e1;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    animation: fadeIn 0.3s ease;
                }

                /* Active broadcasts list */
                .broadcast-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .broadcast-item {
                    border-left: 5px solid #4e73df;
                    background: #f8f9fc;
                    padding: 20px;
                    border-radius: 0 8px 8px 0;
                    position: relative;
                    transition: transform 0.2s;
                    border: 1px solid #eaecf4;
                    border-left: 5px solid #4e73df;
                }

                .broadcast-item:hover {
                    transform: translateX(4px);
                }

                .broadcast-item.emergency { border-left-color: #e74a3b; }
                .broadcast-item.warning { border-left-color: #f6c23e; }
                .broadcast-item.info { border-left-color: #36b9cc; }

                .broadcast-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 8px;
                    padding-right: 35px;
                }

                .broadcast-title {
                    font-weight: 700;
                    color: #333;
                    font-size: 15px;
                }

                .broadcast-badges {
                    display: flex;
                    gap: 8px;
                    margin-top: 4px;
                }

                .badge {
                    font-size: 10px;
                    font-weight: 700;
                    padding: 3px 8px;
                    border-radius: 10px;
                    text-transform: uppercase;
                }

                .badge-danger { background: #fadbd8; color: #e74a3b; }
                .badge-warning { background: #fff3cd; color: #856404; }
                .badge-info { background: #e3f2fd; color: #004085; }

                .target-student { background: #e8f0fe; color: #1a73e8; }
                .target-rector { background: #fce8e6; color: #d93025; }
                .target-all { background: #e6fffa; color: #155724; }

                .broadcast-content {
                    font-size: 13px;
                    color: #5a5c69;
                    line-height: 1.5;
                }

                .broadcast-footer {
                    margin-top: 10px;
                    font-size: 11px;
                    color: #858796;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .btn-delete {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: transparent;
                    color: #858796;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    transition: color 0.2s;
                }

                .btn-delete:hover {
                    color: #e74a3b;
                }

                /* Logs timeline */
                .timeline {
                    list-style: none;
                    padding: 0;
                    position: relative;
                }

                .timeline::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 20px;
                    width: 2px;
                    background: #eaecf4;
                }

                .timeline-item {
                    position: relative;
                    padding-left: 50px;
                    margin-bottom: 25px;
                }

                .timeline-marker {
                    position: absolute;
                    left: 10px;
                    top: 3px;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: #fff;
                    border: 3px solid #4e73df;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1;
                }

                .timeline-marker.user { border-color: #1cc88a; }
                .timeline-marker.complaint { border-color: #f6c23e; }
                .timeline-marker.gatepass { border-color: #e74a3b; }
                .timeline-marker.mess { border-color: #36b9cc; }

                .timeline-content {
                    background: #f8f9fc;
                    padding: 12px 15px;
                    border-radius: 8px;
                    border: 1px solid #eaecf4;
                }

                .timeline-time {
                    font-size: 10px;
                    color: #858796;
                    margin-top: 5px;
                }

                .timeline-action {
                    font-size: 12px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 3px;
                }

                .timeline-detail {
                    font-size: 12px;
                    color: #5a5c69;
                }
            `}</style>

            <div className="notif-dashboard">
                {/* Left Column: Composer */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {statusMessage && <div className="status-toast">{statusMessage}</div>}

                    <div className="card">
                        <h3 className="card-title">
                            <i className="fas fa-bullhorn"></i> Broadcast Notification
                        </h3>
                        <form onSubmit={handleBroadcast}>
                            <div className="form-group">
                                <label>Notification Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter alert title..."
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category / Level</label>
                                    <select
                                        className="form-control"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="Info">Info / Updates</option>
                                        <option value="Warning">Warning</option>
                                        <option value="Emergency">Emergency</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Target Audience</label>
                                    <select
                                        className="form-control"
                                        value={target}
                                        onChange={(e) => setTarget(e.target.value)}
                                    >
                                        <option value="All">All Users</option>
                                        <option value="Students">Students Only</option>
                                        <option value="Rectors">Rectors Only</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Message Details</label>
                                <textarea
                                    className="form-control"
                                    rows="5"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Type the announcement details here..."
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary">
                                <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
                                Broadcast Alert
                            </button>
                        </form>
                    </div>

                    <div className="card">
                        <h3 className="card-title">
                            <i className="fas fa-history"></i> System Activity Logs
                        </h3>
                        <ul className="timeline">
                            {systemLogs.map(log => (
                                <li key={log.id} className="timeline-item">
                                    <span className={`timeline-marker ${log.type}`}></span>
                                    <div className="timeline-content">
                                        <div className="timeline-action">{log.action}</div>
                                        <div className="timeline-detail">{log.detail}</div>
                                        <div className="timeline-time">{log.time}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Active Broadcasts */}
                <div className="card">
                    <h3 className="card-title">
                        <i className="fas fa-broadcast-tower"></i> Active Broadcasts Center
                    </h3>
                    {notifications.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center', color: '#858796' }}>
                            <i className="fas fa-info-circle" style={{ fontSize: '32px', marginBottom: '10px', opacity: 0.5 }}></i>
                            <p>No active alerts. Add an alert using the form on the left.</p>
                        </div>
                    ) : (
                        <div className="broadcast-list">
                            {notifications.map((notif) => (
                                <div key={notif.id} className={`broadcast-item ${notif.category.toLowerCase()}`}>
                                    <button className="btn-delete" onClick={() => handleDelete(notif.id)} title="Delete alert">
                                        <i className="fas fa-times"></i>
                                    </button>
                                    <div className="broadcast-header">
                                        <div>
                                            <div className="broadcast-title">{notif.title}</div>
                                            <div className="broadcast-badges">
                                                <span className={`badge ${getCategoryBadgeColor(notif.category)}`}>
                                                    {notif.category}
                                                </span>
                                                <span className={`badge ${getTargetBadgeColor(notif.target)}`}>
                                                    To: {notif.target}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="broadcast-content">{notif.content}</div>
                                    <div className="broadcast-footer">
                                        <span>Sent by: Chief Administrator</span>
                                        <span>{new Date(notif.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AdminNotifications;
