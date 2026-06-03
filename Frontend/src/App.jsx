import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Login Module
import LoginPage from './modules/login/LoginPage';

// Rector Module
import Dashboard from './modules/rector/pages/Dashboard';
import Notifications from './modules/rector/pages/Notifications';
import StudentManagement from './modules/rector/pages/StudentManagement';
import GatePass from './modules/rector/pages/GatePass';
import Complaints from './modules/rector/pages/Complaints';
import Announcements from './modules/rector/pages/Announcements';
import Settings from './modules/rector/pages/Settings';
import RectorMessMenu from './modules/rector/pages/RectorMessMenu';

// Student Module
import StudentDashboard from './modules/student/pages/StudentDashboard';
import StudentMessMenu from './modules/student/pages/StudentMessMenu';
import StudentSettings from './modules/student/pages/StudentSettings';
import StudentGatePass from './modules/student/pages/StudentGatePass';
import StudentAnnouncements from './modules/student/pages/StudentAnnouncements';
import StudentAttendance from './modules/student/pages/StudentAttendance';
import StudentComplaints from './modules/student/pages/StudentComplaints';

// Admin Module
import AdminDashboard from './modules/admin/pages/AdminDashboard';
import AdminRectors from './modules/admin/pages/AdminRectors';
import AdminComplaints from './modules/admin/pages/AdminComplaints';
import AdminSettings from './modules/admin/pages/AdminSettings';
import AdminMessMenu from './modules/admin/pages/AdminMessMenu';
import AdminWorkers from './modules/admin/pages/AdminWorkers';
import AdminAnnouncements from './modules/admin/pages/AdminAnnouncements';
import AdminReports from './modules/admin/pages/AdminReports';

// Rector Module
import Reports from './modules/rector/pages/Reports';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Rector Routes */}
                <Route path="/rector/dashboard" element={<Dashboard />} />
                <Route path="/rector/notifications" element={<Notifications />} />
                <Route path="/rector/students" element={<StudentManagement />} />
                <Route path="/rector/gatepass" element={<GatePass />} />
                <Route path="/rector/complaints" element={<Complaints />} />
                <Route path="/rector/announcements" element={<Announcements />} />
                <Route path="/rector/settings" element={<Settings />} />
                <Route path="/rector/mess-menu" element={<RectorMessMenu />} />
                <Route path="/rector/reports" element={<Reports />} />

                {/* Student Route */}
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/mess-menu" element={<StudentMessMenu />} />
                <Route path="/student/settings" element={<StudentSettings />} />
                <Route path="/student/gatepass" element={<StudentGatePass />} />
                <Route path="/student/announcements" element={<StudentAnnouncements />} />
                <Route path="/student/attendance" element={<StudentAttendance />} />
                <Route path="/student/complaints" element={<StudentComplaints />} />

                {/* Admin Route */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/rectors" element={<AdminRectors />} />
                <Route path="/admin/complaints" element={<AdminComplaints />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/mess-menu" element={<AdminMessMenu />} />
                <Route path="/admin/workers" element={<AdminWorkers />} />
                <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                <Route path="/admin/reports" element={<AdminReports />} />

                {/* Catch-all to redirect back to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
