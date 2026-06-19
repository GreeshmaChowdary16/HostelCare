import React, { useState } from 'react';
import Header from '../../../components/Header';

const StudentComplaints = () => {
    const [complaints, setComplaints] = useState({
        electrician: { problem: '', proof: null },
        plumber: { problem: '', proof: null },
        carpenter: { problem: '', proof: null },
        cleaning: {
            washroom: { problem: '', proof: null },
            room: { problem: '', proof: null }
        }
    });

    const handleInputChange = (section, field, value, subSection = null) => {
        if (subSection) {
            setComplaints(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [subSection]: {
                        ...prev[section][subSection],
                        [field]: value
                    }
                }
            }));
        } else {
            setComplaints(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const handleSubmit = (section, subSection = null) => {
        const data = subSection ? complaints[section][subSection] : complaints[section];
        console.log(`Submitting ${section}${subSection ? ' - ' + subSection : ''} complaint:`, data);
        alert(`Complaint for ${section}${subSection ? ' (' + subSection + ')' : ''} submitted successfully!`);
    };

    const renderComplaintSection = (title, icon, section, color, subSection = null) => {
        const data = subSection ? complaints[section][subSection] : complaints[section];
        const displayTitle = subSection ? `${subSection.charAt(0).toUpperCase() + subSection.slice(1)}` : title;
        const isNested = subSection !== null;

        return (
            <div className={isNested ? "" : "widget"} style={{ 
                marginBottom: isNested ? '0' : '25px', 
                borderTop: isNested ? 'none' : `5px solid ${color}`,
                padding: isNested ? '15px' : '25px',
                background: isNested ? `${color}05` : '#fff',
                borderRadius: isNested ? '12px' : '15px',
                border: isNested ? `1px dashed ${color}40` : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ 
                        width: '45px', 
                        height: '45px', 
                        borderRadius: '12px', 
                        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`, 
                        color: color, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '22px',
                        boxShadow: `0 4px 10px ${color}15`
                    }}>
                        <i className={`fas ${icon}`}></i>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#2d3436', fontWeight: 700 }}>{displayTitle}</h3>
                        {!isNested && <div style={{ fontSize: '12px', color: '#858796' }}>Report {title.toLowerCase()} issues</div>}
                    </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#4a4a4a', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        What is the problem?
                    </label>
                    <textarea 
                        className="form-control" 
                        placeholder={`Please describe the issue with the ${displayTitle.toLowerCase()}...`}
                        value={data.problem}
                        onChange={(e) => handleInputChange(section, 'problem', e.target.value, subSection)}
                        style={{ 
                            width: '100%', 
                            padding: '12px 15px', 
                            borderRadius: '10px', 
                            border: '1px solid #e3e6f0', 
                            minHeight: '100px', 
                            fontSize: '14px',
                            transition: 'border-color 0.2s',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = color}
                        onBlur={(e) => e.target.style.borderColor = '#e3e6f0'}
                    />
                </div>

                <div style={{ marginBottom: '22px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#4a4a4a', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Proof that it is not working
                    </label>
                    <div style={{ 
                        border: '2px dashed #d1d3e2', 
                        borderRadius: '10px', 
                        padding: '25px 15px', 
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#f8f9fc',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = color;
                        e.currentTarget.style.background = `${color}05`;
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#d1d3e2';
                        e.currentTarget.style.background = '#f8f9fc';
                    }}
                    >
                        <input 
                            type="file" 
                            style={{ display: 'none' }} 
                            id={`file-${section}${subSection || ''}`}
                            onChange={(e) => handleInputChange(section, 'proof', e.target.files[0], subSection)}
                        />
                        <label htmlFor={`file-${section}${subSection || ''}`} style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                            <i className="fas fa-camera" style={{ fontSize: '28px', color: '#b7b9cc', marginBottom: '12px' }}></i>
                            <div style={{ fontSize: '14px', color: '#858796', fontWeight: 500 }}>
                                {data.proof ? (
                                    <span style={{ color: color, fontWeight: 700 }}><i className="fas fa-check-circle"></i> {data.proof.name}</span>
                                ) : (
                                    'Click to capture or upload photo/video'
                                )}
                            </div>
                            <div style={{ fontSize: '11px', color: '#b7b9cc', marginTop: '5px' }}>Max size: 10MB (JPG, PNG, MP4)</div>
                        </label>
                    </div>
                </div>

                <button 
                    onClick={() => handleSubmit(section, subSection)}
                    className="btn-action" 
                    style={{ 
                        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`, 
                        color: 'white', 
                        border: 'none', 
                        width: '100%', 
                        padding: '14px', 
                        fontWeight: 800,
                        borderRadius: '10px',
                        boxShadow: `0 4px 15px ${color}40`,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontSize: '13px'
                    }}
                >
                    Submit {displayTitle} Complaint
                </button>
            </div>
        );
    };

    return (
        <>
            <Header title="New Complaint" />
            <div className="container" style={{ paddingBottom: '60px' }}>
                <div style={{ 
                    background: 'white', 
                    padding: '30px', 
                    borderRadius: '20px', 
                    marginBottom: '30px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    borderLeft: '8px solid #4e73df',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: '28px', color: '#2e59d9', fontWeight: 800, marginBottom: '8px', margin: 0 }}>Lodge a Complaint</h2>
                        <p style={{ color: '#858796', fontSize: '15px', margin: 0 }}>Please provide accurate details to help us resolve the issue quickly.</p>
                    </div>
                    <div style={{ fontSize: '40px', color: '#e3e6f0' }}>
                        <i className="fas fa-tools"></i>
                    </div>
                </div>

                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    {renderComplaintSection('Electrician', 'fa-bolt', 'electrician', '#f6c23e')}
                    {renderComplaintSection('Plumber', 'fa-faucet', 'plumber', '#36b9cc')}
                    {renderComplaintSection('Carpenter', 'fa-hammer', 'carpenter', '#e74a3b')}
                    
                    {/* Cleaning Section */}
                    <div className="widget" style={{ borderTop: '5px solid #1cc88a', gridColumn: '1 / -1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ 
                                width: '45px', 
                                height: '45px', 
                                borderRadius: '12px', 
                                background: 'linear-gradient(135deg, #1cc88a20 0%, #1cc88a10 100%)', 
                                color: '#1cc88a', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: '22px',
                                boxShadow: '0 4px 10px rgba(28, 200, 138, 0.15)'
                            }}>
                                <i className="fas fa-broom"></i>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', color: '#2d3436', fontWeight: 800 }}>Cleaning Services</h3>
                                <div style={{ fontSize: '12px', color: '#858796' }}>Maintenance for hygiene and sanitation</div>
                            </div>
                        </div>

                        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: 0 }}>
                            {renderComplaintSection('Cleaning', 'fa-restroom', 'cleaning', '#1cc88a', 'washroom')}
                            {renderComplaintSection('Cleaning', 'fa-bed', 'cleaning', '#1cc88a', 'room')}
                        </div>
                    </div>
                </div>

                {/* Past Complaints History Section */}
                <div className="widget" style={{ marginTop: '40px', borderTop: '5px solid #858796' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ 
                                width: '45px', 
                                height: '45px', 
                                borderRadius: '12px', 
                                background: 'linear-gradient(135deg, #85879620 0%, #85879610 100%)', 
                                color: '#858796', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: '22px'
                            }}>
                                <i className="fas fa-history"></i>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', color: '#2d3436', fontWeight: 800 }}>Past Complaints History</h3>
                                <div style={{ fontSize: '12px', color: '#858796' }}>Track the status of your previous reports</div>
                            </div>
                        </div>
                        <button style={{ 
                            background: 'none', 
                            border: '1px solid #d1d3e2', 
                            padding: '8px 15px', 
                            borderRadius: '8px', 
                            fontSize: '13px', 
                            color: '#858796',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}>
                            View All <i className="fas fa-chevron-right" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '12px 15px', background: '#f8f9fc', color: '#858796', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', borderRadius: '10px 0 0 10px' }}>Complaint ID</th>
                                    <th style={{ textAlign: 'left', padding: '12px 15px', background: '#f8f9fc', color: '#858796', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Category</th>
                                    <th style={{ textAlign: 'left', padding: '12px 15px', background: '#f8f9fc', color: '#858796', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Issue Details</th>
                                    <th style={{ textAlign: 'left', padding: '12px 15px', background: '#f8f9fc', color: '#858796', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Date Submitted</th>
                                    <th style={{ textAlign: 'left', padding: '12px 15px', background: '#f8f9fc', color: '#858796', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', borderRadius: '0 10px 10px 0' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { id: '#C-992', cat: 'Electrician', icon: 'fa-bolt', color: '#f6c23e', issue: 'Fan regulator sparking in room', date: '12 May 2026', status: 'Resolved' },
                                    { id: '#C-985', cat: 'Cleaning', icon: 'fa-restroom', color: '#1cc88a', issue: 'Washroom tile maintenance', date: '10 May 2026', status: 'Resolved' },
                                    { id: '#C-970', cat: 'Plumber', icon: 'fa-faucet', color: '#36b9cc', issue: 'Washbasin blockage', date: '08 May 2026', status: 'Resolved' },
                                    { id: '#C-955', cat: 'Carpenter', icon: 'fa-hammer', color: '#e74a3b', issue: 'Broken chair leg', date: '05 May 2026', status: 'Resolved' }
                                ].map((past, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f3f9' }}>
                                        <td style={{ padding: '15px', fontWeight: 700, color: '#4e73df', fontSize: '14px' }}>{past.id}</td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: past.color, fontWeight: 700, fontSize: '13px' }}>
                                                <i className={`fas ${past.icon}`}></i> {past.cat}
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px', color: '#5a5c69', fontSize: '14px' }}>{past.issue}</td>
                                        <td style={{ padding: '15px', color: '#858796', fontSize: '13px' }}>{past.date}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ 
                                                padding: '5px 12px', 
                                                borderRadius: '20px', 
                                                fontSize: '11px', 
                                                fontWeight: 800, 
                                                textTransform: 'uppercase',
                                                background: '#e6fffa',
                                                color: '#1cc88a',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}>
                                                <i className="fas fa-check-circle"></i> {past.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentComplaints;
