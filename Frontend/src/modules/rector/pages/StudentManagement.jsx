import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const StudentManagement = () => {
    // Student list & Stats states
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        byBranch: {},
        byYear: {},
        byFloor: {},
        guardianCount: 0
    });

    // Loading & Error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [floorFilter, setFloorFilter] = useState('');
    const [wingFilter, setWingFilter] = useState('');

    // Modal state for student details view
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStudentData = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token missing. Please log in again.');
            setIsLoading(false);
            return;
        }

        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            // 1. Fetch Stats
            const statsRes = await fetch(`${API_BASE_URL}/students/stats`, { headers });
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            // 2. Fetch Students List
            const queryParams = new URLSearchParams();
            if (searchQuery) queryParams.append('search', searchQuery);
            if (branchFilter) queryParams.append('branch', branchFilter);
            if (yearFilter) queryParams.append('year', yearFilter);
            if (floorFilter !== '') queryParams.append('floor', floorFilter);

            const listRes = await fetch(`${API_BASE_URL}/students?${queryParams.toString()}`, { headers });
            if (!listRes.ok) {
                if (listRes.status === 401) throw new Error('Unauthorized');
                if (listRes.status === 403) throw new Error('Forbidden');
                throw new Error(`Server returned status ${listRes.status}`);
            }
            const listData = await listRes.json();
            setStudents(listData || []);

        } catch (err) {
            console.error('Student Management load error:', err);
            setError(err.message === 'Unauthorized' ? 'Session expired. Please log in again.' : 'Failed to connect to the server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentData();
    }, [searchQuery, branchFilter, yearFilter, floorFilter]);

    // Apply Wing filter client-side since the backend doesn't support wing parameters directly
    const filteredStudents = students.filter(student => {
        if (wingFilter && !student.roomInfo?.toLowerCase().includes(wingFilter.toLowerCase())) {
            return false;
        }
        return true;
    });

    const openDetailsModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setSelectedStudent(null);
        setIsModalOpen(false);
    };

    // Calculate dynamic values for metrics
    const totalStudentsCount = stats.total || 0;
    const guardianCountValue = stats.guardianCount || 0;
    const noGuardianCountValue = Math.max(0, totalStudentsCount - guardianCountValue);

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
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
                    box-shadow: 0 4px 6px rgba(0,0,0,0.04);
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
                    font-size: 36px;
                    font-weight: 700;
                    margin-bottom: 5px;
                    line-height: 1;
                }

                .metric-desc {
                    font-size: 13px;
                    opacity: 0.8;
                }

                .filters-bar {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    align-items: center;
                    margin-bottom: 25px;
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .filter-input {
                    padding: 10px 12px;
                    border: 1px solid #d1d3e2;
                    border-radius: 6px;
                    font-size: 14px;
                    outline: none;
                    background: #fff;
                }

                .filter-input:focus {
                    border-color: #4e73df;
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

                .data-table-container {
                    overflow-x: auto;
                }

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
                    font-size: 12px;
                    text-transform: uppercase;
                    border-bottom: 1px solid #e3e6f0;
                }

                .data-table td {
                    padding: 15px;
                    color: #5a5c69;
                    font-size: 14px;
                    border-bottom: 1px solid #f8f9fc;
                }

                .btn-view {
                    background: #e8f0fe;
                    color: #4e73df;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-view:hover {
                    background: #4e73df;
                    color: #fff;
                }

                .status-message {
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 25px;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .status-error { background: #fff5f5; color: #e74a3b; border: 1px solid #fed7d7; }

                .btn-retry {
                    background: #e74a3b;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .btn-retry:hover { background: #be2e21; }

                /* Details Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1200;
                    padding: 15px;
                }

                .modal-content {
                    background: #fff;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 600px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    animation: fadeIn 0.3s ease-out;
                    overflow: hidden;
                }

                .modal-header {
                    padding: 20px 25px;
                    border-bottom: 1px solid #e3e6f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #f8f9fc;
                }

                .modal-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #4e73df;
                    margin: 0;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #858796;
                }

                .modal-body {
                    padding: 25px;
                }

                .profile-section {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 25px;
                }

                .profile-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: #eaecf4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    color: #4e73df;
                    overflow: hidden;
                    border: 3px solid #fff;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }

                .profile-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .profile-meta h3 {
                    margin: 0 0 5px;
                    color: #333;
                    font-size: 20px;
                }

                .profile-meta p {
                    margin: 0;
                    color: #858796;
                    font-size: 14px;
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .detail-item {
                    border-bottom: 1px solid #f8f9fc;
                    padding-bottom: 10px;
                }

                .detail-label {
                    font-size: 11px;
                    color: #4e73df;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                }

                .detail-value {
                    font-size: 14px;
                    color: #5a5c69;
                    font-weight: 600;
                }

                .detail-bio {
                    grid-column: span 2;
                    background: #f8f9fc;
                    padding: 12px;
                    border-radius: 6px;
                    font-size: 13px;
                    color: #5a5c69;
                    font-style: italic;
                    margin-top: 10px;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 576px) {
                    .details-grid { grid-template-columns: 1fr; }
                    .profile-section { flex-direction: column; text-align: center; }
                }
            `}</style>

            <div className="container">
                {/* Error Banner with Retry */}
                {error && (
                    <div className="status-message status-error">
                        <span>{error}</span>
                        <button className="btn-retry" onClick={fetchStudentData}>
                            Retry Loading
                        </button>
                    </div>
                )}

                {/* Metrics Row */}
                <div className="metrics-grid">
                    <div className="metric-card bg-blue">
                        <div className="metric-label">Total Students</div>
                        <div className="metric-value">{totalStudentsCount}</div>
                        <div className="metric-desc">Registered Students</div>
                    </div>
                    <div className="metric-card bg-green">
                        <div className="metric-label">Local Guardian</div>
                        <div className="metric-value">{guardianCountValue}</div>
                        <div className="metric-desc">With Guardian Assigned</div>
                    </div>
                    <div className="metric-card bg-red">
                        <div className="metric-label">No Guardian</div>
                        <div className="metric-value">{noGuardianCountValue}</div>
                        <div className="metric-desc">Requires Special Attention</div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="filters-bar">
                    <input
                        type="text"
                        placeholder="Search student name, roll, phone..."
                        className="filter-input"
                        style={{ flex: 1, minWidth: '220px' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className="filter-input"
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                    >
                        <option value="">All Branches</option>
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                    </select>
                    <select
                        className="filter-input"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                    >
                        <option value="">All Years</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                    </select>
                    <select
                        className="filter-input"
                        value={floorFilter}
                        onChange={(e) => setFloorFilter(e.target.value)}
                    >
                        <option value="">All Floors</option>
                        <option value="0">Ground Floor</option>
                        <option value="1">1st Floor</option>
                        <option value="2">2nd Floor</option>
                        <option value="3">3rd Floor</option>
                        <option value="4">4th Floor</option>
                    </select>
                    <select
                        className="filter-input"
                        value={wingFilter}
                        onChange={(e) => setWingFilter(e.target.value)}
                    >
                        <option value="">All Wings</option>
                        <option value="Girls Hostel A">Girls Hostel A</option>
                        <option value="Boys Hostel B">Boys Hostel B</option>
                        <option value="Girls Hostel C">Girls Hostel C</option>
                    </select>
                </div>

                {/* Left Column - Main student directory table */}
                <div className="card">
                    <div className="card-title">Student Directory</div>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#858796' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
                            <p>Loading student directory...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#858796' }}>
                            <i className="fas fa-users-slash" style={{ fontSize: '48px', color: '#dddfeb', marginBottom: '15px' }}></i>
                            <p style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>No students found.</p>
                        </div>
                    ) : (
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Roll/Enroll No</th>
                                        <th>Branch</th>
                                        <th>Year</th>
                                        <th>Room Info</th>
                                        <th>Phone</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id}>
                                            <td style={{ fontWeight: 600, color: '#333' }}>{student.name}</td>
                                            <td>{student.rollNo || 'N/A'}</td>
                                            <td>{student.branch || 'N/A'}</td>
                                            <td>{student.year || 'N/A'}</td>
                                            <td>{student.roomInfo || 'N/A'}</td>
                                            <td>{student.phone || 'N/A'}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn-view"
                                                    onClick={() => openDetailsModal(student)}
                                                >
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* STUDENT DETAILS MODAL */}
            {isModalOpen && selectedStudent && (
                <div className="modal-overlay" onClick={closeDetailsModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Student Profile Details</h3>
                            <button className="modal-close" onClick={closeDetailsModal}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="profile-section">
                                <div className="profile-avatar">
                                    {selectedStudent.profileImage ? (
                                        <img src={selectedStudent.profileImage} alt={selectedStudent.name} />
                                    ) : (
                                        <i className="fas fa-user-graduate"></i>
                                    )}
                                </div>
                                <div className="profile-meta">
                                    <h3>{selectedStudent.name}</h3>
                                    <p>Roll No: {selectedStudent.rollNo || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="details-grid">
                                <div className="detail-item">
                                    <div className="detail-label">Email Address</div>
                                    <div className="detail-value">{selectedStudent.email}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Phone Number</div>
                                    <div className="detail-value">{selectedStudent.phone || 'N/A'}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Parent Phone</div>
                                    <div className="detail-value">{selectedStudent.parentPhone || 'N/A'}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Branch</div>
                                    <div className="detail-value">{selectedStudent.branch || 'N/A'}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Year of Study</div>
                                    <div className="detail-value">{selectedStudent.year || 'N/A'}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Hostel & Room</div>
                                    <div className="detail-value">{selectedStudent.roomInfo || 'N/A'}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Native Place</div>
                                    <div className="detail-value">{selectedStudent.nativePlace || 'Not provided'}</div>
                                </div>
                                {selectedStudent.bio && (
                                    <div className="detail-bio">
                                        <strong>Bio:</strong> {selectedStudent.bio}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentManagement;
