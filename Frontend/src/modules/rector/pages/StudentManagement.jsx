import React, { useState } from 'react';
import Header from '../../../components/Header';

const StudentManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <>
            <Header title="Student Management" />
            <style>{`
                .container {
                    padding: 30px;
                    max-width: 1600px;
                    margin: 0 auto;
                }

                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .metric-card {
                    padding: 25px;
                    border-radius: 8px;
                    color: white;
                    min-height: 120px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .bg-blue { background: #4e73df; }
                .bg-green { background: #1cc88a; }
                .bg-yellow { background: #f6c23e; }
                .bg-red { background: #e74a3b; }

                .metric-label {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 10px;
                    opacity: 0.9;
                }

                .metric-value {
                    font-size: 42px;
                    font-weight: 700;
                    margin-bottom: 5px;
                    line-height: 1;
                }

                .metric-desc {
                    font-size: 13px;
                    opacity: 0.8;
                }

                /* Layout Grid */
                .content-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 25px;
                }

                .card {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
                    padding: 25px;
                    margin-bottom: 25px;
                }

                .card-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                /* Table */
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .data-table th {
                    text-align: left;
                    padding: 12px 15px;
                    background: #f8f9fc;
                    color: #858796;
                    font-weight: 700;
                    font-size: 13px;
                    border-radius: 4px;
                }

                .data-table td {
                    padding: 18px 15px;
                    color: #5a5c69;
                    font-size: 14px;
                    border-bottom: 1px solid #f8f9fc;
                }

                .btn-view {
                    background: #e8f0fe;
                    color: #4e73df;
                    border: none;
                    padding: 6px 15px;
                    border-radius: 4px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }

                /* State Cards */
                .state-distribution {
                    display: flex;
                    gap: 20px;
                }
                
                .state-card {
                    border: 1px solid #e3e6f0;
                    border-left: 4px solid #4e73df;
                    border-radius: 6px;
                    padding: 20px;
                    flex: 1;
                }

                .state-card.gujarat { border-left-color: #1cc88a; }
                .state-card.others { border-left-color: #f6c23e; }

                .state-name {
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 5px;
                }

                .state-count {
                    font-size: 28px;
                    font-weight: 700;
                    color: #4e73df;
                    margin-bottom: 5px;
                }
                .gujarat .state-count { color: #1cc88a; }
                .others .state-count { color: #f6c23e; }

                .state-sub {
                    font-size: 12px;
                    color: #858796;
                }

                /* Sidebar Stats */
                .sidebar-stat-box {
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                }

                .box-green { background: #e0fcf4; color: #0f6848; }
                .box-red { background: #fadbd8; color: #721c24; }

                .box-label { font-weight: 700; font-size: 15px; margin-bottom: 5px; }
                .box-sub { font-size: 12px; opacity: 0.8; }
                .box-value { font-size: 24px; font-weight: 700; float: right; }

                .btn-full {
                    width: 100%;
                    padding: 12px;
                    background: #e8f0fe;
                    color: #4e73df;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 5px;
                }

                .search-input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #d1d3e2;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    font-size: 14px;
                }

                .btn-search {
                    width: 100%;
                    padding: 12px;
                    background: #eaecf4;
                    color: #5a5c69;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                }

                @media (max-width: 992px) {
                    .metrics-grid { grid-template-columns: 1fr 1fr; }
                    .content-grid { grid-template-columns: 1fr; }
                    .state-distribution { flex-direction: column; }
                }
            `}</style>

            <div className="container">
                {/* Metrics Row */}
                <div className="metrics-grid">
                    <div className="metric-card bg-blue">
                        <div className="metric-label">Total Girls</div>
                        <div className="metric-value">235</div>
                        <div className="metric-desc">Registered</div>
                    </div>
                    <div className="metric-card bg-green">
                        <div className="metric-label">Present</div>
                        <div className="metric-value">211</div>
                        <div className="metric-desc">In Hostel</div>
                    </div>
                    <div className="metric-card bg-yellow">
                        <div className="metric-label">One Day Leave</div>
                        <div className="metric-value">10</div>
                        <div className="metric-desc">Returning Tomorrow</div>
                    </div>
                    <div className="metric-card bg-red">
                        <div className="metric-label">Hometown Leave</div>
                        <div className="metric-value">14</div>
                        <div className="metric-desc">Long Leave</div>
                    </div>
                </div>

                <div className="content-grid">
                    {/* Left Column */}
                    <div className="left-column">
                        {/* Floor-Wise Breakdown */}
                        <div className="card">
                            <div className="card-title">Floor-Wise Breakdown</div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Floor</th>
                                        <th>Total</th>
                                        <th>Present</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ fontWeight: 500 }}>Ground</td>
                                        <td>60</td>
                                        <td>54</td>
                                        <td><button className="btn-view">View</button></td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 500 }}>1st Floor</td>
                                        <td>58</td>
                                        <td>50</td>
                                        <td><button className="btn-view">View</button></td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 500 }}>2nd Floor</td>
                                        <td>62</td>
                                        <td>59</td>
                                        <td><button className="btn-view">View</button></td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 500 }}>3rd Floor</td>
                                        <td>55</td>
                                        <td>48</td>
                                        <td><button className="btn-view">View</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* State-Wise Distribution */}
                        <div className="card">
                            <div className="card-title"><i className="fas fa-map-marked-alt"></i> State-Wise Distribution</div>
                            <div className="state-distribution">
                                <div className="state-card">
                                    <div className="state-name">Maharashtra</div>
                                    <div className="state-count">145</div>
                                    <div className="state-sub">Local / Nearby</div>
                                </div>
                                <div className="state-card gujarat">
                                    <div className="state-name">Gujarat</div>
                                    <div className="state-count">45</div>
                                    <div className="state-sub">Neighboring State</div>
                                </div>
                                <div className="state-card others">
                                    <div className="state-name">Other States</div>
                                    <div className="state-count">45</div>
                                    <div className="state-sub">MP, KA, etc.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="right-column">
                        {/* Local Guardian Info */}
                        <div className="card">
                            <div className="card-title"><i className="fas fa-user-friends"></i> Local Guardian Info</div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '13px', color: '#858796', marginBottom: '5px' }}>Non-Local Girls (Out of State)</div>
                                <div style={{ fontSize: '28px', fontWeight: 700, color: '#5a5c69' }}>90</div>
                            </div>

                            <div className="sidebar-stat-box box-green">
                                <span className="box-value">72</span>
                                <div className="box-label">With Guardian</div>
                                <div className="box-sub">Have relatives in city</div>
                            </div>

                            <div className="sidebar-stat-box box-red">
                                <span className="box-value">18</span>
                                <div className="box-label">No Guardian</div>
                                <div className="box-sub">No local relatives</div>
                            </div>

                            <button className="btn-full">View List</button>
                        </div>

                        {/* Search Student */}
                        <div className="card">
                            <div className="card-title">Search Student</div>

                            <input
                                type="text"
                                className="search-input"
                                placeholder="Enter Name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <button className="btn-search">Search</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentManagement;
