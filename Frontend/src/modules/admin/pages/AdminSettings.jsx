import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL, getImageUrl } from '../../../config';

const AdminSettings = () => {
    const [activeMenu, setActiveMenu] = useState('profile');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Profile State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [office, setOffice] = useState('');
    const [bio, setBio] = useState('');
    const [statusMsg, setStatusMsg] = useState('');

    // Profile Photo State
    const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || '');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [removePhotoFlag, setRemovePhotoFlag] = useState(false);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: getAuthHeader()
                });
                if (res.ok) {
                    const data = await res.json();
                    setFullName(data.name || '');
                    setEmail(data.email || '');
                    setPhone(data.phone || '');
                    setOffice(data.office || '');
                    setBio(data.bio || '');
                    setProfileImage(data.profileImage || '');
                    localStorage.setItem('profileImage', data.profileImage || '');
                }
            } catch (err) {
                console.error('Error fetching admin profile:', err);
            }
        };
        fetchProfile();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be under 5MB');
                return;
            }
            setSelectedFile(file);
            setRemovePhotoFlag(false);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleRemovePhoto = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setProfileImage('');
        setRemovePhotoFlag(true);
    };

    const handleSaveProfile = async (e) => {
        if (e) e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', fullName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('office', office);
            formData.append('bio', bio);

            if (selectedFile) {
                formData.append('profileImage', selectedFile);
            } else if (removePhotoFlag) {
                formData.append('removeProfileImage', 'true');
            }

            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update');

            alert('Profile & Photo updated successfully');
            const updatedUser = data.user || data;
            const updatedPhoto = updatedUser.profileImage || '';

            setProfileImage(updatedPhoto);
            setSelectedFile(null);
            setPreviewUrl('');
            setRemovePhotoFlag(false);

            localStorage.setItem('name', fullName);
            localStorage.setItem('email', email);
            localStorage.setItem('profileImage', updatedPhoto);
            window.dispatchEvent(new Event('profileUpdate'));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdatePassword = async (e) => {
        if (e) e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update password');
            alert('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            alert(err.message);
        }
    };

    // Notification Preferences State
    const [notifPrefs, setNotifPrefs] = useState({
        email: true,
        sms: true,
        desktop: true,
        reports: true,
        complaints: true
    });

    // Existing Notifications State
    const [notifList, setNotifList] = useState([
        { id: 1, title: 'Monthly report pending', time: '10 mins ago', type: 'report', icon: 'fa-file-alt', color: '#4e73df' },
        { id: 2, title: 'System maintenance scheduled', time: '2 hours ago', type: 'system', icon: 'fa-cog', color: '#858796' },
        { id: 3, title: 'Urgent: Rector meeting today', time: '4 hours ago', type: 'urgent', icon: 'fa-exclamation-triangle', color: '#e74a3b' }
    ]);

    const handleToggle = (key) => {
        setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const removeNotif = (id) => {
        setNotifList(prev => prev.filter(n => n.id !== id));
    };

    return (
        <>
            <Header title="System Settings" />

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
                            <i className="fas fa-cogs"></i> Settings Menu
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li onClick={() => setActiveMenu('security')} style={{ padding: '12px 20px', borderLeft: activeMenu === 'security' ? '3px solid var(--primary)' : '3px solid transparent', background: activeMenu === 'security' ? '#f0f4f8' : 'transparent', color: activeMenu === 'security' ? 'var(--primary)' : '#6e707e', fontWeight: 500, cursor: 'pointer' }}>
                                <i className="fas fa-shield-alt" style={{ width: '20px' }}></i> Security & Password
                            </li>
                            <li onClick={() => setActiveMenu('profile')} style={{ padding: '12px 20px', borderLeft: activeMenu === 'profile' ? '3px solid var(--primary)' : '3px solid transparent', background: activeMenu === 'profile' ? '#f0f4f8' : 'transparent', color: activeMenu === 'profile' ? 'var(--primary)' : '#6e707e', cursor: 'pointer', transition: '0.2s' }}>
                                <i className="fas fa-user-cog" style={{ width: '20px' }}></i> Profile
                            </li>
                            <li onClick={() => setActiveMenu('notifications')} style={{ padding: '12px 20px', borderLeft: activeMenu === 'notifications' ? '3px solid var(--primary)' : '3px solid transparent', background: activeMenu === 'notifications' ? '#f0f4f8' : 'transparent', color: activeMenu === 'notifications' ? 'var(--primary)' : '#6e707e', cursor: 'pointer', transition: '0.2s' }}>
                                <i className="fas fa-bell" style={{ width: '20px' }}></i> Notifications
                            </li>
                        </ul>
                    </div>

                    {/* Settings Content */}
                    <div className="widget">
                        {activeMenu === 'security' && (
                            <>
                                <div className="widget-header">
                                    <div className="widget-title">Change Password</div>
                                </div>

                                <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
                                    <i className="fas fa-exclamation-triangle"></i> For security reasons, you will be logged out after changing your password.
                                </div>

                                <form onSubmit={handleUpdatePassword}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Current Password</label>
                                        <input type="password" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>New Password</label>
                                        <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                        <small style={{ color: '#858796', marginTop: '5px', display: 'block' }}>Minimum 8 characters, mixed case and special characters.</small>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Confirm New Password</label>
                                        <input type="password" placeholder="Re-enter new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #e3e6f0', paddingTop: '20px' }}>
                                        <button type="submit" className="btn-action view-btn" style={{ padding: '10px 25px', fontSize: '14px' }}>Update Password</button>
                                        <button type="button" onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }} className="btn-sm" style={{ fontSize: '14px', background: 'white', border: '1px solid #d1d3e2' }}>Cancel</button>
                                    </div>
                                </form>
                            </>
                        )}

                        {activeMenu === 'profile' && (
                            <>
                                <div className="widget-header">
                                    <div className="widget-title">Profile Settings</div>
                                </div>

                                <form onSubmit={handleSaveProfile}>
                                    {/* Profile Photo Manager */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', padding: '15px', background: '#f8f9fc', borderRadius: '10px', border: '1px dashed #d1d3e2' }}>
                                        <div style={{ width: '85px', height: '85px', borderRadius: '50%', overflow: 'hidden', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', border: '3px solid #fff', flexShrink: 0 }}>
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : profileImage ? (
                                                <img src={getImageUrl(profileImage)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <i className="fas fa-user-shield" style={{ fontSize: '34px', color: '#1cc88a' }}></i>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#333' }}>Administrator Profile Photo</h4>
                                            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#858796' }}>Upload an official administrator photo for your account (JPG, PNG up to 5MB).</p>
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                <label style={{ padding: '8px 16px', fontSize: '13px', background: '#1cc88a', color: 'white', borderRadius: '5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                                                    <i className="fas fa-camera"></i> {selectedFile ? 'Change Selected File' : 'Upload Photo'}
                                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                                                </label>
                                                {(selectedFile || profileImage) && (
                                                    <button type="button" onClick={handleRemovePhoto} style={{ padding: '8px 16px', fontSize: '13px', background: '#fff', border: '1px solid #e74a3b', color: '#e74a3b', borderRadius: '5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                                                        <i className="fas fa-trash-alt"></i> Remove Photo
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Full Name</label>
                                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Email Address</label>
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Phone Number</label>
                                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>Office Block</label>
                                            <input type="text" value={office} onChange={(e) => setOffice(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px' }} />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#5a5c69' }}>System Bio / Responsibilities</label>
                                        <textarea rows="4" placeholder="Describe your administrative role..." value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px', resize: 'vertical' }}></textarea>
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #e3e6f0', paddingTop: '20px' }}>
                                        <button type="submit" className="btn-action view-btn" style={{ padding: '10px 25px', fontSize: '14px' }}>Save Changes</button>
                                    </div>
                                </form>
                            </>
                        )}

                        {activeMenu === 'notifications' && (
                            <>
                                <div className="widget-header">
                                    <div className="widget-title">Notification Preferences</div>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f3f8' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#5a5c69' }}>Email Notifications</div>
                                            <div style={{ fontSize: '13px', color: '#858796' }}>Receive system updates via email</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={notifPrefs.email} onChange={() => handleToggle('email')} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f3f8' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#5a5c69' }}>SMS Notifications</div>
                                            <div style={{ fontSize: '13px', color: '#858796' }}>Receive urgent alerts via text message</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={notifPrefs.sms} onChange={() => handleToggle('sms')} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#5a5c69' }}>Desktop Notifications</div>
                                            <div style={{ fontSize: '13px', color: '#858796' }}>Show browser push notifications</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={notifPrefs.desktop} onChange={() => handleToggle('desktop')} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="widget-header" style={{ marginTop: '20px' }}>
                                    <div className="widget-title">Manage Recent Notifications</div>
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
                                                <i className="fas fa-trash-alt"></i> Remove
                                            </button>
                                        </li>
                                    )) : (
                                        <div style={{ padding: '30px', textAlign: 'center', color: '#858796' }}>
                                            <i className="fas fa-bell-slash" style={{ fontSize: '32px', marginBottom: '10px', opacity: 0.3 }}></i>
                                            <p>No notifications to manage.</p>
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

export default AdminSettings;
