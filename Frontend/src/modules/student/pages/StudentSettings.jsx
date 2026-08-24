import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const StudentSettings = () => {
    const [activeMenu, setActiveMenu] = useState('security');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Profile State
    const [fullName, setFullName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [branch, setBranch] = useState('');
    const [year, setYear] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [parentPhone, setParentPhone] = useState('');
    const [roomInfo, setRoomInfo] = useState('');

    // Notification Preferences State
    const [notifPrefs, setNotifPrefs] = useState({
        email: true,
        sms: true,
        desktop: false,
        messAlerts: true,
        gatepassAlerts: true,
        announcements: true
    });

    // Real Notifications State
    const [notifList, setNotifList] = useState([]);

    const handleToggle = (key) => {
        setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const removeNotif = (id) => {
        setNotifList(prev => prev.filter(n => n._id !== id));
    };

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const getNotifMeta = (type) => {
        if (type === 'fee') return { icon: 'fa-file-invoice-dollar', color: '#e74a3b' };
        if (type === 'gatepass') return { icon: 'fa-check-circle', color: '#1cc88a' };
        if (type === 'attendance') return { icon: 'fa-calendar-check', color: '#f6c23e' };
        return { icon: 'fa-bell', color: '#4e73df' };
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch Profile
            try {
                const res = await fetch(`${API_BASE_URL}/auth/me`, { headers });
                if (res.ok) {
                    const data = await res.json();
                    setFullName(data.name || '');
                    setRollNo(data.rollNo || '');
                    setBranch(data.branch || '');
                    setYear(data.year || '');
                    setEmail(data.email || '');
                    setPhone(data.phone || '');
                    setParentPhone(data.parentPhone || '');
                    setRoomInfo(data.roomInfo || '');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }

            // Fetch System Notifications
            try {
                const res = await fetch(`${API_BASE_URL}/notifications`, { headers });
                if (res.ok) {
                    const data = await res.json();
                    setNotifList(data || []);
                }
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };
        fetchData();
    }, []);

    const handleSaveProfile = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ name: fullName, email, phone, parentPhone }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update');
            alert('Profile updated successfully');
            localStorage.setItem('name', fullName);
            localStorage.setItem('email', email);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Password update failed');
            alert('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            <Header title="Account Settings" />
            <style>{`
                .container {
                    padding: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .settings-grid {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 30px;
                    align-items: flex-start;
                }
                @media (max-width: 768px) {
                    .settings-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .sidebar-menu {
                    background: white;
                    border-radius: 12px;
                    padding: 15px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    border: 1px solid #eaecf4;
                }
                .menu-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 18px;
                    border-radius: 8px;
                    color: #858796;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 5px;
                }
                .menu-item:last-child {
                    margin-bottom: 0;
                }
                .menu-item:hover, .menu-item.active {
                    background: #f8f9fc;
                    color: #4e73df;
                }
                .settings-content {
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    border: 1px solid #eaecf4;
                }
                .widget-header {
                    border-bottom: 2px solid #eaecf4;
                    padding-bottom: 15px;
                    margin-bottom: 25px;
                }
                .widget-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #5a5c69;
                }
                .form-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                @media (max-width: 576px) {
                    .form-grid-2 {
                        grid-template-columns: 1fr;
                    }
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .input-group label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #5a5c69;
                }
                .input-group input {
                    padding: 10px 12px;
                    border: 1px solid #d1d3e2;
                    border-radius: 6px;
                    font-family: inherit;
                    font-size: 14px;
                    outline: none;
                }
                .input-group input:focus {
                    border-color: #4e73df;
                }
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 24px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: #1cc88a;
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
            `}</style>

            <div className="container">
                <div className="settings-grid">
                    <div className="sidebar-menu">
                        <div className={`menu-item ${activeMenu === 'profile' ? 'active' : ''}`} onClick={() => setActiveMenu('profile')}>
                            <i className="fas fa-user"></i> Edit Profile
                        </div>
                        <div className={`menu-item ${activeMenu === 'security' ? 'active' : ''}`} onClick={() => setActiveMenu('security')}>
                            <i className="fas fa-lock"></i> Security
                        </div>
                        <div className={`menu-item ${activeMenu === 'notifications' ? 'active' : ''}`} onClick={() => setActiveMenu('notifications')}>
                            <i className="fas fa-bell"></i> Alerts &amp; Activity
                        </div>
                    </div>

                    <div className="settings-content">
                        {activeMenu === 'profile' && (
                            <>
                                <div className="widget-header">
                                    <div className="widget-title">Edit Profile Details</div>
                                </div>
                                <form>
                                    <div className="form-grid-2">
                                        <div className="input-group">
                                            <label>Full Name</label>
                                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                        </div>
                                        <div className="input-group">
                                            <label>Roll Number</label>
                                            <input type="text" value={rollNo} readOnly style={{ background: '#f8f9fc', color: '#858796' }} />
                                        </div>
                                    </div>

                                    <div className="form-grid-2">
                                        <div className="input-group">
                                            <label>Branch</label>
                                            <input type="text" value={branch} readOnly style={{ background: '#f8f9fc', color: '#858796' }} />
                                        </div>
                                        <div className="input-group">
                                            <label>Academic Year</label>
                                            <input type="text" value={year} readOnly style={{ background: '#f8f9fc', color: '#858796' }} />
                                        </div>
                                    </div>

                                    <div className="form-grid-2">
                                        <div className="input-group">
                                            <label>Email Address</label>
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className="input-group">
                                            <label>Contact Mobile</label>
                                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-grid-2">
                                        <div className="input-group">
                                            <label>Parent / Guardian Contact</label>
                                            <input type="text" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
                                        </div>
                                        <div className="input-group">
                                            <label>Room Allocation</label>
                                            <input type="text" value={roomInfo} readOnly style={{ background: '#f8f9fc', color: '#858796' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #e3e6f0', paddingTop: '20px' }}>
                                        <button type="button" onClick={handleSaveProfile} className="btn-action view-btn" style={{ padding: '10px 25px', fontSize: '14px', background: '#4e73df', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
                                    </div>
                                </form>
                            </>
                        )}

                        {activeMenu === 'security' && (
                            <>
                                <div className="widget-header">
                                    <div className="widget-title">Update Password</div>
                                </div>

                                <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba', fontSize: '13px' }}>
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
                                        <button type="button" onClick={handleUpdatePassword} className="btn-action view-btn" style={{ padding: '10px 25px', fontSize: '14px', background: '#4e73df', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>Update Password</button>
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
                                    {notifList.length > 0 ? notifList.map(notif => {
                                        const meta = getNotifMeta(notif.type);
                                        return (
                                            <li key={notif._id} style={{ padding: '15px', borderBottom: '1px solid #f1f3f8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <div style={{ background: `${meta.color}15`, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', color: meta.color }}>
                                                        <i className={`fas ${meta.icon}`}></i>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 500, color: '#5a5c69', fontSize: '14px' }}>{notif.title}</div>
                                                        <div style={{ fontSize: '12px', color: '#858796' }}>{new Date(notif.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeNotif(notif._id)} style={{ background: 'none', border: 'none', color: '#e74a3b', cursor: 'pointer', fontSize: '13px' }}>
                                                    <i className="fas fa-trash-alt"></i> Clear
                                                </button>
                                            </li>
                                        );
                                    }) : (
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
