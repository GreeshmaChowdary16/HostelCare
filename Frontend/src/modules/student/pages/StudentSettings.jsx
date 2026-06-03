import React, { useState } from 'react';
import Header from '../../../components/Header';

const StudentSettings = () => {
    const [activeMenu, setActiveMenu] = useState('security');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Profile State
    const [fullName, setFullName] = useState('Anjali Sharma');
    const [rollNo, setRollNo] = useState('2022CS1045');
    const [branch, setBranch] = useState('Computer Science & Engineering');
    const [year, setYear] = useState('3rd Year');
    const [email, setEmail] = useState('anjali.s@student.edu');
    const [phone, setPhone] = useState('+91 70001 23456');
    const [parentPhone, setParentPhone] = useState('+91 94444 55555');
    const [roomInfo, setRoomInfo] = useState('Girls Hostel A - Room 302');

    // Notification Preferences State
    const [notifPrefs, setNotifPrefs] = useState({
        email: true,
        sms: true,
        desktop: false,
        messAlerts: true,
        gatepassAlerts: true,
        announcements: true
    });

    // Existing Notifications State
    const [notifList, setNotifList] = useState([
        { id: 1, title: 'Gate pass approved for weekend', time: '10 mins ago', type: 'gatepass', icon: 'fa-check-circle', color: '#1cc88a' },
        { id: 2, title: 'Special Dinner: Paneer Butter Masala', time: '1 hour ago', type: 'mess', icon: 'fa-utensils', color: '#f6c23e' },
        { id: 3, title: 'Hostel Night announcement', time: '5 hours ago', type: 'info', icon: 'fa-bullhorn', color: '#4e73df' }
    ]);

    const handleToggle = (key) => {
        setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const removeNotif = (id) => {
        setNotifList(prev => prev.filter(n => n.id !== id));
    };

    return (
        <>
            <Header title="My Account Settings" />

            <div className="container">
                <style>{`
                    .toggle-switch {
                        position: relative;
                        display: inline-block;
                        width: 46px;
                        height: 24px;
                    }
                    .toggle-switch input { opacity: 0; width: 0; height: 0; }
                    .slider {
                        position: absolute;
                        cursor: pointer;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background-color: #ccc;
                        transition: .4s;
                        border-radius: 24px;
                    }
                    .slider:before {
                        position: absolute;
                        content: "";
                        height: 18px; width: 18px;
                        left: 3px; bottom: 3px;
                        background-color: white;
                        transition: .4s;
                        border-radius: 50%;
                    }
                    input:checked + .slider { background-color: #4e73df; }
                    input:checked + .slider:before { transform: translateX(22px); }
                `}</style>

                <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 3fr' }}>
                    {/* Settings Sidebar */}
                    <div className="widget" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ background: '#FFFFFF', padding: '15px', borderBottom: '1px solid #e3e6f0', fontWeight: 600, color: 'var(--text-primary)' }}>
                            <i className="fas fa-user-circle"></i> Student Profile
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li onClick={() => setActiveMenu('profile')} style={{ padding: '12px 20px', borderLeft: activeMenu === 'profile' ? '3px solid var(--primary)' : '3px solid transparent', background: activeMenu === 'profile' ? '#f0f4f8' : 'transparent', color: activeMenu === 'profile' ? 'var(--primary)' : '#6e707e', cursor: 'pointer', transition: '0.2s' }}>
                                <i className="fas fa-id-card" style={{ width: '20px' }}></i> Personal Info
                            </li>
                            <li onClick={() => setActiveMenu('security')} style={{ padding: '12px 20px', borderLeft: activeMenu === 'security' ? '3px solid var(--primary)' : '3px solid transparent', background: activeMenu === 'security' ? '#f0f4f8' : 'transparent', color: activeMenu === 'security' ? 'var(--primary)' : '#6e707e', fontWeight: 500, cursor: 'pointer' }}>
                                <i className="fas fa-lock" style={{ width: '20px' }}></i> Password & Security
                            </li>
                            <li onClick={() => setActiveMenu('notifications')} style={{ padding: '12px 20px', borderLeft: activeMenu === 'notifications' ? '3px solid var(--primary)' : '3px solid transparent', background: activeMenu === 'notifications' ? '#f0f4f8' : 'transparent', color: activeMenu === 'notifications' ? 'var(--primary)' : '#6e707e', cursor: 'pointer', transition: '0.2s' }}>
                                <i className="fas fa-bell" style={{ width: '20px' }}></i> Notifications
                            </li>
                        </ul>
                    </div>

                    {/* Settings Content */}
                    <div className="widget">
                        {activeMenu === 'profile' && (
                            <>
                                <div className="widget-header">
                                    <div className="widget-title">Academic & Personal Details</div>
                                </div>

                                <form>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Full Name</label>
                                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Roll Number</label>
                                            <input type="text" value={rollNo} readOnly style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px', background: '#f8f9fc' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Branch</label>
                                            <input type="text" value={branch} readOnly style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px', background: '#f8f9fc' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Current Year</label>
                                            <input type="text" value={year} readOnly style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px', background: '#f8f9fc' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Phone Number</label>
                                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Email Address</label>
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Parent's Contact</label>
                                            <input type="text" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Hostel Block/Room</label>
                                            <input type="text" value={roomInfo} readOnly style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px', background: '#f8f9fc' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #e3e6f0', paddingTop: '20px' }}>
                                        <button type="button" className="btn-action view-btn" style={{ padding: '10px 25px', fontSize: '14px' }}>Save Changes</button>
                                        <button type="button" className="btn-sm" style={{ fontSize: '14px', background: 'white', border: '1px solid #d1d3e2' }}>Cancel</button>
                                    </div>
                                </form>
                            </>
                        )}

                        {activeMenu === 'security' && (
                            <>
                                <div className="widget-header">
                                    <div className="widget-title">Update Password</div>
                                </div>

                                <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
                                    <i className="fas fa-info-circle"></i> Security Tip: Use a combination of letters, numbers and special characters.
                                </div>

                                <form>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Current Password</label>
                                        <input type="password" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>New Password</label>
                                        <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Confirm New Password</label>
                                        <input type="password" placeholder="Re-enter new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #e3e6f0', paddingTop: '20px' }}>
                                        <button type="button" className="btn-action view-btn" style={{ padding: '10px 25px', fontSize: '14px' }}>Update Password</button>
                                        <button type="button" className="btn-sm" style={{ fontSize: '14px', background: 'white', border: '1px solid #d1d3e2' }}>Cancel</button>
                                    </div>
                                </form>
                            </>
                        )}

                        {activeMenu === 'notifications' && (
                            <>
                                <div className="widget-header">
                                    <div className="widget-title">Alert Preferences</div>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f3f8' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#5a5c69' }}>Mess Menu Alerts</div>
                                            <div style={{ fontSize: '13px', color: '#858796' }}>Get notified about today's special menu</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={notifPrefs.messAlerts} onChange={() => handleToggle('messAlerts')} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f3f8' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#5a5c69' }}>Gate Pass Status</div>
                                            <div style={{ fontSize: '13px', color: '#858796' }}>Receive alerts when gate pass is approved/rejected</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={notifPrefs.gatepassAlerts} onChange={() => handleToggle('gatepassAlerts')} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#5a5c69' }}>Hostel Announcements</div>
                                            <div style={{ fontSize: '13px', color: '#858796' }}>Updates about events, holidays, and maintenance</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={notifPrefs.announcements} onChange={() => handleToggle('announcements')} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="widget-header" style={{ marginTop: '20px' }}>
                                    <div className="widget-title">Dismiss Notifications</div>
                                </div>

                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {notifList.length > 0 ? notifList.map(notif => (
                                        <li key={notif.id} style={{ padding: '15px', borderBottom: '1px solid #f1f3f8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ background: `${notif.color}15`, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: notif.color }}>
                                                    <i className={`fas ${notif.icon}`}></i>
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500, color: '#5a5c69', fontSize: '14px' }}>{notif.title}</div>
                                                    <div style={{ fontSize: '12px', color: '#858796' }}>{notif.time}</div>
                                                </div>
                                            </div>
                                            <button onClick={() => removeNotif(notif.id)} style={{ background: 'none', border: 'none', color: '#e74a3b', cursor: 'pointer', fontSize: '13px' }}>
                                                <i className="fas fa-trash-alt"></i> Clear
                                            </button>
                                        </li>
                                    )) : (
                                        <div style={{ padding: '30px', textAlign: 'center', color: '#858796' }}>
                                            <i className="fas fa-bell-slash" style={{ fontSize: '32px', marginBottom: '10px', opacity: 0.3 }}></i>
                                            <p>All clear! No recent notifications.</p>
                                        </div>
                                    )}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentSettings;
