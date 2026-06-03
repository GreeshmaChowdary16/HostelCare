import React from 'react';
import Header from '../../../components/Header';

const StudentAnnouncements = () => {
    const announcements = [
        { id: 1, title: 'Annual Hostel Night 2026', date: '25 Jan 2026', content: 'We are excited to announce the Annual Hostel Night. All students are invited for a night of music, dance and dinner.', category: 'Event', color: '#4e73df' },
        { id: 2, title: 'Maintenance: Water Supply Interruption', date: '24 Jan 2026', content: 'There will be a temporary interruption in water supply tomorrow between 10 AM and 2 PM due to tank cleaning.', category: 'Maintenance', color: '#e74a3b' },
        { id: 3, title: 'New Library Timings', date: '22 Jan 2026', content: 'Starting next week, the hostel library will be open until 11 PM to assist with exam preparation.', category: 'Academic', color: '#1cc88a' },
        { id: 4, title: 'Mess Fee Revision', date: '20 Jan 2026', content: 'Please note the revised mess fee structure for the upcoming semester as discussed in the student committee meeting.', category: 'Account', color: '#f6c23e' }
    ];

    return (
        <>
            <Header title="Announcements" />

            <div className="container">
                <div className="widget">
                    <div className="widget-header">
                        <div className="widget-title">Latest Updates</div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '12px', color: '#858796' }}>Filter by:</span>
                            <select style={{ fontSize: '12px', border: '1px solid #d1d3e2', borderRadius: '4px' }}>
                                <option>All Categories</option>
                                <option>Events</option>
                                <option>Maintenance</option>
                                <option>Academic</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '10px' }}>
                        {announcements.map(ann => (
                            <div key={ann.id} style={{ 
                                border: '1px solid #e3e6f0', 
                                borderRadius: '8px', 
                                overflow: 'hidden',
                                transition: '0.3s',
                                cursor: 'pointer',
                                ':hover': { transform: 'translateY(-5px)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }
                            }}>
                                <div style={{ background: ann.color, height: '4px' }}></div>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ 
                                            fontSize: '10px', 
                                            textTransform: 'uppercase', 
                                            fontWeight: 700, 
                                            color: ann.color,
                                            background: `${ann.color}15`,
                                            padding: '2px 8px',
                                            borderRadius: '4px'
                                        }}>{ann.category}</span>
                                        <span style={{ fontSize: '11px', color: '#858796' }}>{ann.date}</span>
                                    </div>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#5a5c69' }}>{ann.title}</h4>
                                    <p style={{ fontSize: '13px', color: '#858796', lineHeight: '1.5', margin: 0 }}>
                                        {ann.content}
                                    </p>
                                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f1f3f8', textAlign: 'right' }}>
                                        <button style={{ background: 'none', border: 'none', color: ann.color, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                            Read More <i className="fas fa-arrow-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentAnnouncements;
