import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';
import socket from '../../../socket';

const StudentAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [expandedId, setExpandedId] = useState(null);

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

    const filteredAnnouncements = filterCategory === 'All' 
        ? announcements 
        : announcements.filter(ann => ann.category.toLowerCase() === filterCategory.toLowerCase());

    return (
        <>
            <Header title="Announcements" />

            <div className="container">
                <div className="widget">
                    <div className="widget-header">
                        <div className="widget-title">Latest Updates</div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '12px', color: '#858796' }}>Filter by:</span>
                            <select 
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                style={{ fontSize: '12px', border: '1px solid #d1d3e2', borderRadius: '4px' }}
                            >
                                <option value="All">All Categories</option>
                                <option value="Event">Events</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Academic">Academic</option>
                                <option value="Account">Account</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '10px' }}>
                        {filteredAnnouncements.length === 0 ? (
                            <div style={{ padding: '20px', color: '#858796', gridColumn: '1 / -1', textAlign: 'center' }}>No announcements found.</div>
                        ) : (
                            filteredAnnouncements.map(ann => (
                                <div key={ann._id} style={{ 
                                    border: '1px solid #e3e6f0', 
                                    borderRadius: '8px', 
                                    overflow: 'hidden',
                                    transition: '0.3s',
                                    cursor: 'pointer',
                                    ':hover': { transform: 'translateY(-5px)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }
                                }}>
                                    <div style={{ background: ann.color || '#4e73df', height: '4px' }}></div>
                                    <div style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span style={{ 
                                                fontSize: '10px', 
                                                textTransform: 'uppercase', 
                                                fontWeight: 700, 
                                                color: ann.color || '#4e73df',
                                                background: `${ann.color || '#4e73df'}15`,
                                                padding: '2px 8px',
                                                borderRadius: '4px'
                                            }}>{ann.category}</span>
                                            <span style={{ fontSize: '11px', color: '#858796' }}>{new Date(ann.createdAt).toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                                        </div>
                                        <h4 style={{ margin: '0 0 10px 0', color: '#5a5c69' }}>{ann.title}</h4>
                                        <p style={{ fontSize: '13px', color: '#858796', lineHeight: '1.5', margin: 0 }}>
                                            {expandedId === ann._id ? ann.content : ann.content.length > 120 ? `${ann.content.slice(0, 120)}...` : ann.content}
                                        </p>
                                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f1f3f8', textAlign: 'right' }}>
                                            <button 
                                                type="button"
                                                onClick={() => setExpandedId(expandedId === ann._id ? null : ann._id)}
                                                style={{ background: 'none', border: 'none', color: ann.color || '#4e73df', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                {expandedId === ann._id ? 'Show Less' : 'Read More'} <i className="fas fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentAnnouncements;
