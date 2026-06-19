import React from 'react';
import Header from '../../../components/Header';

const Notifications = () => {
    return (
        <>
            <Header title="Notifications" />

            <div className="container">
                {/* Fee Payment Alerts */}
                <div className="widget" style={{ borderLeft: '5px solid #e74a3b' }}>
                    <div className="widget-header">
                        <div className="widget-title" style={{ color: '#e74a3b' }}>Fee Payment Alerts</div>
                        <button className="btn-sm">Send Reminder</button>
                    </div>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '14px', color: '#858796' }}>Students Pending Fees</div>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: '#5a5c69' }}>45</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: '#858796' }}>Last Date of Payment</div>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: '#e74a3b' }}>25th Jan 2026</div>
                        </div>
                    </div>
                </div>

                <div className="widget">
                    <div className="widget-header">
                        <div className="widget-title">Recent Activities</div>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ padding: '15px', borderBottom: '1px solid #f1f3f8', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#e7f3ff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4e73df' }}>
                                <i className="fas fa-exclamation-circle"></i>
                            </div>
                            <div>
                                <div style={{ fontWeight: 500, color: '#5a5c69' }}>New complaint registered</div>
                                <div style={{ fontSize: '12px', color: '#858796' }}>2 mins ago</div>
                            </div>
                        </li>
                        <li style={{ padding: '15px', borderBottom: '1px solid #f1f3f8', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#e6fffa', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1cc88a' }}>
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div>
                                <div style={{ fontWeight: 500, color: '#5a5c69' }}>Gate pass approved</div>
                                <div style={{ fontSize: '12px', color: '#858796' }}>1 hour ago</div>
                            </div>
                        </li>
                        <li style={{ padding: '15px', borderBottom: '1px solid #f1f3f8', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#fff8e1', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f6c23e' }}>
                                <i className="fas fa-bullhorn"></i>
                            </div>
                            <div>
                                <div style={{ fontWeight: 500, color: '#5a5c69' }}>Announcement posted</div>
                                <div style={{ fontSize: '12px', color: '#858796' }}>Yesterday</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Notifications;
