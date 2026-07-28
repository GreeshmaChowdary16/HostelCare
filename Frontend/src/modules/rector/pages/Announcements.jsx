import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';
import socket from '../../../socket';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Event');

    const fetchAnnouncements = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/announcements`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAnnouncements(data);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    useEffect(() => {
        fetchAnnouncements();

        const onCreated = (announcement) => {
            setAnnouncements(prev => [announcement, ...prev]);
        };

        const onDeleted = ({ id }) => {
            setAnnouncements(prev => prev.filter(a => a._id !== id));
        };

        socket.on('announcement_created', onCreated);
        socket.on('announcement_deleted', onDeleted);

        return () => {
            socket.off('announcement_created', onCreated);
            socket.off('announcement_deleted', onDeleted);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;

        let color = '#4e73df';
        if (category === 'Maintenance') color = '#e74a3b';
        else if (category === 'Academic') color = '#1cc88a';
        else if (category === 'Account') color = '#f6c23e';
        else if (category === 'Other') color = '#858796';

        try {
            const response = await fetch(`${API_BASE_URL}/announcements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, category, color })
            });

            if (response.ok) {
                alert('Announcement posted successfully!');
                setTitle('');
                setContent('');
                setCategory('Event');
                setShowForm(false);
                fetchAnnouncements();
            } else {
                const data = await response.json();
                alert(`Failed to post: ${data.message}`);
            }
        } catch (error) {
            console.error('Error posting announcement:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Announcement deleted!');
                fetchAnnouncements();
            } else {
                const data = await response.json();
                alert(`Failed to delete: ${data.message}`);
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    const maintenanceAlerts = announcements.filter(a => a.category === 'Maintenance');
    const eventAlerts = announcements.filter(a => a.category !== 'Maintenance');

    return (
        <>
            <Header title="Announcements" />

            <div className="container">
                {/* Post New Form trigger */}
                <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                    <button 
                        onClick={() => setShowForm(!showForm)} 
                        className="btn-action" 
                        style={{ background: '#4e73df', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i> {showForm ? 'Close Form' : 'Post New Announcement'}
                    </button>
                </div>

                {showForm && (
                    <div className="widget" style={{ marginBottom: '30px', borderTop: '4px solid #4e73df' }}>
                        <div className="widget-header">
                            <div className="widget-title">New Announcement Details</div>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#5a5c69', marginBottom: '5px' }}>Title</label>
                                <input 
                                    type="text" 
                                    placeholder="Announcement Title" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required 
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#5a5c69', marginBottom: '5px' }}>Category</label>
                                <select 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)} 
                                    style={inputStyle}
                                >
                                    <option value="Event">Event</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Account">Account</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#5a5c69', marginBottom: '5px' }}>Content</label>
                                <textarea 
                                    placeholder="Write your announcement details here..." 
                                    value={content} 
                                    onChange={(e) => setContent(e.target.value)} 
                                    required 
                                    style={{ ...inputStyle, minHeight: '100px' }}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn-action bg-blue" 
                                style={{ alignSelf: 'flex-start', padding: '10px 25px', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                Publish Announcement
                            </button>
                        </form>
                    </div>
                )}

                <div className="dashboard-grid">
                    {/* Maintenance Alerts */}
                    <div className="col-1" style={{ gridColumn: 'span 1' }}>
                        <div className="widget">
                            <div className="widget-header">
                                <div className="widget-title"><i className="fas fa-tools"></i> Maintenance &amp; Utility Alerts</div>
                            </div>

                            {maintenanceAlerts.length === 0 ? (
                                <p style={{ fontSize: '14px', color: '#858796' }}>No active maintenance alerts.</p>
                            ) : (
                                maintenanceAlerts.map(ann => (
                                    <div key={ann._id} className="announcement-card" style={{ padding: '15px', borderLeft: `4px solid ${ann.color || '#e74a3b'}`, background: '#ffe3e3', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                            <i className="fas fa-faucet" style={{ color: ann.color || '#e74a3b', marginTop: '3px' }}></i>
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0', color: '#721c24' }}>{ann.title}</h4>
                                                <p style={{ margin: 0, fontSize: '13px', color: '#5a5c69' }}>
                                                    {ann.content}
                                                </p>
                                                <div style={{ marginTop: '8px', fontWeight: 600, fontSize: '11px', color: '#858796' }}>
                                                    Posted by: {ann.author?.name || 'Rector'} • {new Date(ann.createdAt).toLocaleDateString(undefined, {day: 'numeric', month: 'short'})}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Events & Schedules */}
                    <div className="col-2" style={{ gridColumn: 'span 1' }}>
                        <div className="widget">
                            <div className="widget-header">
                                <div className="widget-title"><i className="fas fa-calendar-alt"></i> Events &amp; Schedules</div>
                            </div>

                            {eventAlerts.length === 0 ? (
                                <p style={{ fontSize: '14px', color: '#858796' }}>No active events or schedules.</p>
                            ) : (
                                eventAlerts.map(ann => (
                                    <div key={ann._id} className="announcement-card" style={{ padding: '15px', borderLeft: `4px solid ${ann.color || '#4e73df'}`, background: '#f0f4ff', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                            <i className="fas fa-calendar-check" style={{ color: ann.color || '#4e73df', marginTop: '3px' }}></i>
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0', color: '#0c5460' }}>{ann.title}</h4>
                                                <p style={{ margin: 0, fontSize: '13px', color: '#5a5c69' }}>
                                                    {ann.content}
                                                </p>
                                                <div style={{ marginTop: '8px', fontWeight: 600, fontSize: '11px', color: '#858796' }}>
                                                    Posted by: {ann.author?.name || 'Rector'} • {new Date(ann.createdAt).toLocaleDateString(undefined, {day: 'numeric', month: 'short'})}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Announcement History */}
                <div className="widget">
                    <div className="widget-header">
                        <div className="widget-title">Announcement History</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Subject</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '15px', color: '#858796' }}>No announcement history.</td>
                                </tr>
                            ) : (
                                announcements.map(ann => (
                                    <tr key={ann._id}>
                                        <td>{new Date(ann.createdAt).toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                                        <td>{ann.category}</td>
                                        <td>{ann.title}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleDelete(ann._id)} 
                                                className="btn-action reject-btn" 
                                                style={{ background: '#e74a3b', color: 'white', padding: '5px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d3e2',
    outline: 'none',
    fontSize: '14px'
};

export default Announcements;
