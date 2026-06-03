import React from 'react';
import Header from '../../../components/Header';

const Announcements = () => {
    return (
        <>
            <Header title="Announcements" />

            <div className="container">
                <div className="dashboard-grid">
                    {/* Maintenance Alerts */}
                    <div className="col-1" style={{ gridColumn: 'span 1' }}>
                        <div className="widget">
                            <div className="widget-header">
                                <div className="widget-title"><i className="fas fa-tools"></i> Maintenance &amp; Utility Alerts</div>
                                <button className="btn-sm">Post New</button>
                            </div>

                            <div className="announcement-card" style={{ padding: '15px', borderLeft: '4px solid #f6c23e', background: '#fff8e1', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <i className="fas fa-faucet" style={{ color: '#f6c23e', marginTop: '3px' }}></i>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', color: '#856404' }}>Water Supply Interruption</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#856404' }}>
                                            Water supply will be stopped for overhead tank cleaning.
                                        </p>
                                        <div style={{ marginTop: '8px', fontWeight: 600, fontSize: '13px' }}>
                                            <i className="far fa-clock"></i> Today, 10:00 AM - 03:00 PM
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="announcement-card" style={{ padding: '15px', borderLeft: '4px solid #e74a3b', background: '#ffe3e3', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <i className="fas fa-bolt" style={{ color: '#e74a3b', marginTop: '3px' }}></i>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', color: '#721c24' }}>Scheduled Power Cut</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#721c24' }}>
                                            Electricity maintenance work in Block A and B.
                                        </p>
                                        <div style={{ marginTop: '8px', fontWeight: 600, fontSize: '13px' }}>
                                            <i className="far fa-clock"></i> Tomorrow, 02:00 PM - 05:00 PM
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Events & Schedules */}
                    <div className="col-2" style={{ gridColumn: 'span 1' }}>
                        <div className="widget">
                            <div className="widget-header">
                                <div className="widget-title"><i className="fas fa-calendar-alt"></i> Events &amp; Schedules</div>
                                <button className="btn-sm">Post New</button>
                            </div>

                            <div className="announcement-card" style={{ padding: '15px', borderLeft: '4px solid #4e73df', background: '#f0f4ff', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <i className="fas fa-door-closed" style={{ color: '#4e73df', marginTop: '3px' }}></i>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', color: '#0c5460' }}>Gate Closing Timings (College Fest)</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#5a5c69' }}>
                                            Due to the Annual Cultural Fest, the main gate will close late.
                                        </p>
                                        <div style={{ marginTop: '8px', fontWeight: 600, fontSize: '13px' }}>
                                            <i className="fas fa-history"></i> Extended till 11:00 PM (25th - 27th Jan)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="announcement-card" style={{ padding: '15px', borderLeft: '4px solid #1cc88a', background: '#e3f9f1', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <i className="fas fa-utensils" style={{ color: '#1cc88a', marginTop: '3px' }}></i>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', color: '#155724' }}>Special Mess Timings</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#155724' }}>
                                            Dinner will be served early on Republic Day.
                                        </p>
                                        <div style={{ marginTop: '8px', fontWeight: 600, fontSize: '13px' }}>
                                            <i className="far fa-clock"></i> 26th Jan: 07:00 PM - 08:30 PM
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Announcement History */}
                <div className="widget">
                    <div className="widget-header">
                        <div className="widget-title">Announcement History</div>
                        <button className="btn-sm">View Archive</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Subject</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>15 Jan 2026</td>
                                <td>Maintenance</td>
                                <td>WiFi Upgradation</td>
                                <td><span className="status-badge status-resolved">Completed</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Announcements;
