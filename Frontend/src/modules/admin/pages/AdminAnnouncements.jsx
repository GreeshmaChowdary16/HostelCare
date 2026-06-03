import React, { useState } from 'react';
import Header from '../../../components/Header';

function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([
        { id: 1, title: 'Fee Payment Deadline', audience: 'Students', date: '2026-05-10', content: 'Last date for fee payment is 15th May.' },
        { id: 2, title: 'Monthly Meeting', audience: 'Rectors', date: '2026-05-09', content: 'All rectors must attend the monthly meeting tomorrow at 10 AM.' }
    ]);

    const [newStudentAnnouncement, setNewStudentAnnouncement] = useState({ title: '', content: '' });
    const [newRectorAnnouncement, setNewRectorAnnouncement] = useState({ title: '', content: '' });

    const handleAddAnnouncement = (audience) => {
        const newAnnouncement = audience === 'Students' ? newStudentAnnouncement : newRectorAnnouncement;
        if (!newAnnouncement.title || !newAnnouncement.content) return;

        setAnnouncements([
            {
                id: Date.now(),
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                audience: audience,
                date: new Date().toISOString().split('T')[0]
            },
            ...announcements
        ]);

        if (audience === 'Students') {
            setNewStudentAnnouncement({ title: '', content: '' });
        } else {
            setNewRectorAnnouncement({ title: '', content: '' });
        }
    };

    return (
        <>
            <Header title="Announcements" />
            <style>{`
                .announcements-container {
                    padding: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }
                .card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                }
                .section-title {
                    margin: 0 0 20px 0;
                    color: #5a5c69;
                    font-size: 18px;
                    border-bottom: 2px solid #eaecf4;
                    padding-bottom: 10px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-control {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #d1d3e2;
                    border-radius: 4px;
                    margin-top: 5px;
                    font-family: inherit;
                }
                .btn-submit {
                    background: #4e73df;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .btn-submit:hover {
                    background: #2e59d9;
                }
                .btn-rector {
                    background: #1cc88a;
                }
                .btn-rector:hover {
                    background: #17a673;
                }
                .forms-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .announcement-item {
                    border-left: 4px solid #4e73df;
                    padding: 15px;
                    background: #f8f9fc;
                    margin-bottom: 15px;
                    border-radius: 4px;
                }
                .announcement-item.Rectors {
                    border-left-color: #1cc88a;
                }
                .announcement-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                .announcement-title {
                    font-weight: bold;
                    color: #333;
                }
                .badge {
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: bold;
                }
                .badge-Students { background: #e8f0fe; color: #4e73df; }
                .badge-Rectors { background: #e3fdf4; color: #1cc88a; }
                @media (max-width: 768px) {
                    .forms-grid { grid-template-columns: 1fr; }
                }
            `}</style>
            
            <div className="announcements-container">
                {/* Latest Announcements Section */}
                <div className="card">
                    <h3 className="section-title">Latest Announcements</h3>
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className={`announcement-item ${announcement.audience}`}>
                            <div className="announcement-header">
                                <div className="announcement-title">{announcement.title}</div>
                                <div>
                                    <span className={`badge badge-${announcement.audience}`} style={{ marginRight: '10px' }}>
                                        {announcement.audience}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#858796' }}>{announcement.date}</span>
                                </div>
                            </div>
                            <div style={{ color: '#5a5c69', fontSize: '14px' }}>
                                {announcement.content}
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && <p style={{ color: '#858796' }}>No announcements available.</p>}
                </div>

                {/* Create Announcements Section */}
                <div className="forms-grid">
                    {/* Students Form */}
                    <div className="card">
                        <h3 className="section-title">New Announcement for Students</h3>
                        <div className="form-group">
                            <label>Title</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="e.g. Mess Timing Changed"
                                value={newStudentAnnouncement.title}
                                onChange={(e) => setNewStudentAnnouncement({...newStudentAnnouncement, title: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea 
                                className="form-control" 
                                rows="4" 
                                placeholder="Write the announcement details here..."
                                value={newStudentAnnouncement.content}
                                onChange={(e) => setNewStudentAnnouncement({...newStudentAnnouncement, content: e.target.value})}
                            ></textarea>
                        </div>
                        <button className="btn-submit" onClick={() => handleAddAnnouncement('Students')}>
                            <i className="fas fa-paper-plane"></i> Send to Students
                        </button>
                    </div>

                    {/* Rectors Form */}
                    <div className="card">
                        <h3 className="section-title">New Announcement for Rectors</h3>
                        <div className="form-group">
                            <label>Title</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="e.g. Monthly Report Submission"
                                value={newRectorAnnouncement.title}
                                onChange={(e) => setNewRectorAnnouncement({...newRectorAnnouncement, title: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea 
                                className="form-control" 
                                rows="4" 
                                placeholder="Write the announcement details here..."
                                value={newRectorAnnouncement.content}
                                onChange={(e) => setNewRectorAnnouncement({...newRectorAnnouncement, content: e.target.value})}
                            ></textarea>
                        </div>
                        <button className="btn-submit btn-rector" onClick={() => handleAddAnnouncement('Rectors')}>
                            <i className="fas fa-paper-plane"></i> Send to Rectors
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminAnnouncements;
