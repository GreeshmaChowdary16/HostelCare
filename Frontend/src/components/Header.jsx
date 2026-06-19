import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ title }) => {
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [mailOpen, setMailOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    // Helper to get module prefix
    const getModulePath = (path) => {
        if (location.pathname.startsWith('/admin')) return `/admin${path}`;
        if (location.pathname.startsWith('/rector')) return `/rector${path}`;
        if (location.pathname.startsWith('/student')) return `/student${path}`;
        return path;
    };

    return (
        <>
            {/* Header */}
            <div className="topbar">
                <Link to={getModulePath('/dashboard')} className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <i className="fas fa-building"></i> HostelCare
                </Link>
                <div className="user-profile">
                    {/* Notification Dropdown */}
                    <div
                        className={`icon-dropdown ${notificationOpen ? 'active' : ''}`}
                        onClick={() => setNotificationOpen(!notificationOpen)}
                    >
                        <i className="fas fa-bell"></i>
                        <div className="dropdown-menu extended">
                            <div className="dropdown-header">Notifications Center</div>
                            <a href="#" className="dropdown-list-item">
                                <div className="icon-circle" style={{ background: '#e74a3b' }}>
                                    <i className="fas fa-calendar-times"></i>
                                </div>
                                <div className="content">
                                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>Fee Payment Deadline</span>
                                    <div className="small-text">Today is the last day for fee payment without fine.</div>
                                </div>
                            </a>
                            <a href="#" className="dropdown-list-item">
                                <div className="icon-circle" style={{ background: '#4e73df' }}>
                                    <i className="fas fa-bullhorn"></i>
                                </div>
                                <div className="content">
                                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>New Announcement</span>
                                    <div className="small-text">Annual Hostel Night registrations are now open!</div>
                                </div>
                            </a>
                            <Link to={getModulePath('/notifications')} style={{ display: 'block', textAlign: 'center', padding: '10px', fontSize: '12px', color: '#858796', textDecoration: 'none' }}>
                                Show All Alerts
                            </Link>
                        </div>
                    </div>

                    {/* Mail Dropdown */}
                    <div
                        className={`icon-dropdown ${mailOpen ? 'active' : ''}`}
                        onClick={() => setMailOpen(!mailOpen)}
                    >
                        <i className="fas fa-envelope"></i>
                        <div className="dropdown-menu extended">
                            <div className="dropdown-header">Message Center</div>
                            <a href="#" className="dropdown-list-item">
                                <div className="icon-circle" style={{ background: '#f6c23e' }}>
                                    <i className="fas fa-file-invoice-dollar"></i>
                                </div>
                                <div className="content">
                                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>Fee Status Alert</span>
                                    <div className="small-text">Your pending fee of ₹12,500 is due by 15th Feb.</div>
                                </div>
                            </a>
                            <a href="#" className="dropdown-list-item">
                                <div className="icon-circle" style={{ background: '#e74a3b' }}>
                                    <i className="fas fa-calendar-check"></i>
                                </div>
                                <div className="content">
                                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>Attendance Alert</span>
                                    <div className="small-text">Your attendance is not recorded today. Please mark your presence.</div>
                                </div>
                            </a>
                            <a href="#" style={{ display: 'block', textAlign: 'center', padding: '10px', fontSize: '12px', color: '#858796', textDecoration: 'none' }}>
                                Read More Messages
                            </a>
                        </div>
                    </div>

                    <div
                        className={`profile-dropdown ${profileOpen ? 'active' : ''}`}
                        onClick={() => setProfileOpen(!profileOpen)}
                    >
                        <div className="user-avatar">
                            {location.pathname.startsWith('/student') ? <i className="fas fa-user-graduate"></i> : 
                             location.pathname.startsWith('/rector') ? <i className="fas fa-female"></i> : 
                             <i className="fas fa-user-shield"></i>}
                        </div>
                        <span>
                            {location.pathname.startsWith('/student') ? 'Student User' : 
                             location.pathname.startsWith('/rector') ? 'Mrs. Priya Kumar' : 
                             'Administrator'} 
                            <i className="fas fa-chevron-down" style={{ marginLeft: '5px', fontSize: '12px' }}></i>
                        </span>
                        <div className="dropdown-menu">
                            <Link to="/login" className="dropdown-item"><i className="fas fa-sign-out-alt"></i> Sign Out</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-header">
                <h2>{title}</h2>
            </div>

            {/* Navigation */}
            <div className="navbar">
                <Link to={getModulePath('/dashboard')} className={isActive(getModulePath('/dashboard')) ? 'active' : ''}><i className="fas fa-tachometer-alt"></i> Dashboard</Link>
                {location.pathname.startsWith('/admin') && (
                    <>
                        <Link to="/admin/rectors" className={isActive('/admin/rectors') ? 'active' : ''}><i className="fas fa-user-tie"></i> Rectors</Link>
                        <Link to="/admin/workers" className={isActive('/admin/workers') ? 'active' : ''}><i className="fas fa-tools"></i> Workers</Link>
                    </>
                )}
                {location.pathname.startsWith('/rector') && (
                    <>
                        <Link to="/rector/students" className={isActive('/rector/students') ? 'active' : ''}><i className="fas fa-users"></i> Students</Link>
                        <Link to="/rector/gatepass" className={isActive('/rector/gatepass') ? 'active' : ''}><i className="fas fa-id-card"></i> Gate Pass</Link>
                    </>
                )}
                {location.pathname.startsWith('/student') && (
                    <>
                        <Link to="/student/attendance" className={isActive('/student/attendance') ? 'active' : ''}><i className="fas fa-calendar-check"></i> Attendance</Link>
                        <Link to="/student/gatepass" className={isActive('/student/gatepass') ? 'active' : ''}><i className="fas fa-id-card"></i> Gate Pass</Link>
                    </>
                )}
                <Link to={getModulePath('/mess-menu')} className={isActive(getModulePath('/mess-menu')) ? 'active' : ''}><i className="fas fa-utensils"></i> Mess Menu</Link>
                {(location.pathname.startsWith('/admin') || location.pathname.startsWith('/rector')) && (
                    <Link to={getModulePath('/reports')} className={isActive(getModulePath('/reports')) ? 'active' : ''}><i className="fas fa-chart-line"></i> Reports</Link>
                )}
                <Link to={getModulePath('/complaints')} className={isActive(getModulePath('/complaints')) ? 'active' : ''}><i className="fas fa-exclamation-circle"></i> Complaints</Link>
                <Link to={getModulePath('/announcements')} className={isActive(getModulePath('/announcements')) ? 'active' : ''}><i className="fas fa-bullhorn"></i> Announcements</Link>
                <Link to={getModulePath('/settings')} className={isActive(getModulePath('/settings')) ? 'active' : ''}><i className="fas fa-cog"></i> Settings</Link>
            </div>
        </>
    );

};

export default Header;
