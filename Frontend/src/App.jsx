import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Login Module
import LoginPage from './modules/login/LoginPage';
import SignupPage from './modules/login/SignupPage';
import VerifyEmailPage from './modules/login/VerifyEmailPage';
import ForgotPasswordPage from './modules/login/ForgotPasswordPage';
import ResetPasswordPage from './modules/login/ResetPasswordPage';


// Rector Module
import Dashboard from './modules/rector/pages/Dashboard';
import Notifications from './modules/rector/pages/Notifications';
import StudentManagement from './modules/rector/pages/StudentManagement';
import GatePass from './modules/rector/pages/GatePass';
import Complaints from './modules/rector/pages/Complaints';
import Announcements from './modules/rector/pages/Announcements';
import Settings from './modules/rector/pages/Settings';
import RectorMessMenu from './modules/rector/pages/RectorMessMenu';
import RectorFees from './modules/rector/pages/RectorFees';
import RectorAttendance from './modules/rector/pages/RectorAttendance';



// Student Module
import StudentDashboard from './modules/student/pages/StudentDashboard';
import StudentMessMenu from './modules/student/pages/StudentMessMenu';
import StudentSettings from './modules/student/pages/StudentSettings';
import StudentGatePass from './modules/student/pages/StudentGatePass';
import StudentAnnouncements from './modules/student/pages/StudentAnnouncements';
import StudentAttendance from './modules/student/pages/StudentAttendance';
import StudentComplaints from './modules/student/pages/StudentComplaints';
import StudentNotifications from './modules/student/pages/StudentNotifications';
import StudentFees from './modules/student/pages/StudentFees';


// Admin Module
import AdminDashboard from './modules/admin/pages/AdminDashboard';
import AdminRectors from './modules/admin/pages/AdminRectors';
import AdminComplaints from './modules/admin/pages/AdminComplaints';
import AdminSettings from './modules/admin/pages/AdminSettings';
import AdminMessMenu from './modules/admin/pages/AdminMessMenu';
import AdminWorkers from './modules/admin/pages/AdminWorkers';
import AdminAnnouncements from './modules/admin/pages/AdminAnnouncements';
import AdminReports from './modules/admin/pages/AdminReports';
import AdminNotifications from './modules/admin/pages/AdminNotifications';
import AdminFees from './modules/admin/pages/AdminFees';


// Rector Module
import Reports from './modules/rector/pages/Reports';

function RoleRoute({ role, children }) {
    const token = localStorage.getItem('token');
    const currentRole = (localStorage.getItem('role') || '').toLowerCase();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (currentRole !== role) {
        return <Navigate to={currentRole ? `/${currentRole}/dashboard` : '/login'} replace />;
    }

    return children;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />


                {/* Rector Routes */}
                <Route path="/rector/dashboard" element={<RoleRoute role="rector"><Dashboard /></RoleRoute>} />
                <Route path="/rector/notifications" element={<RoleRoute role="rector"><Notifications /></RoleRoute>} />
                <Route path="/rector/students" element={<RoleRoute role="rector"><StudentManagement /></RoleRoute>} />
                <Route path="/rector/gatepass" element={<RoleRoute role="rector"><GatePass /></RoleRoute>} />
                <Route path="/rector/complaints" element={<RoleRoute role="rector"><Complaints /></RoleRoute>} />
                <Route path="/rector/announcements" element={<RoleRoute role="rector"><Announcements /></RoleRoute>} />
                <Route path="/rector/settings" element={<RoleRoute role="rector"><Settings /></RoleRoute>} />
                <Route path="/rector/mess-menu" element={<RoleRoute role="rector"><RectorMessMenu /></RoleRoute>} />
                <Route path="/rector/reports" element={<RoleRoute role="rector"><Reports /></RoleRoute>} />
                <Route path="/rector/fees" element={<RoleRoute role="rector"><RectorFees /></RoleRoute>} />
                <Route path="/rector/attendance" element={<RoleRoute role="rector"><RectorAttendance /></RoleRoute>} />



                {/* Student Route */}
                <Route path="/student/dashboard" element={<RoleRoute role="student"><StudentDashboard /></RoleRoute>} />
                <Route path="/student/mess-menu" element={<RoleRoute role="student"><StudentMessMenu /></RoleRoute>} />
                <Route path="/student/settings" element={<RoleRoute role="student"><StudentSettings /></RoleRoute>} />
                <Route path="/student/gatepass" element={<RoleRoute role="student"><StudentGatePass /></RoleRoute>} />
                <Route path="/student/announcements" element={<RoleRoute role="student"><StudentAnnouncements /></RoleRoute>} />
                <Route path="/student/attendance" element={<RoleRoute role="student"><StudentAttendance /></RoleRoute>} />
                <Route path="/student/complaints" element={<RoleRoute role="student"><StudentComplaints /></RoleRoute>} />
                <Route path="/student/notifications" element={<RoleRoute role="student"><StudentNotifications /></RoleRoute>} />
                <Route path="/student/fees" element={<RoleRoute role="student"><StudentFees /></RoleRoute>} />


                {/* Admin Route */}
                <Route path="/admin/dashboard" element={<RoleRoute role="admin"><AdminDashboard /></RoleRoute>} />
                <Route path="/admin/rectors" element={<RoleRoute role="admin"><AdminRectors /></RoleRoute>} />
                <Route path="/admin/complaints" element={<RoleRoute role="admin"><AdminComplaints /></RoleRoute>} />
                <Route path="/admin/settings" element={<RoleRoute role="admin"><AdminSettings /></RoleRoute>} />
                <Route path="/admin/mess-menu" element={<RoleRoute role="admin"><AdminMessMenu /></RoleRoute>} />
                <Route path="/admin/workers" element={<RoleRoute role="admin"><AdminWorkers /></RoleRoute>} />
                <Route path="/admin/announcements" element={<RoleRoute role="admin"><AdminAnnouncements /></RoleRoute>} />
                <Route path="/admin/reports" element={<RoleRoute role="admin"><AdminReports /></RoleRoute>} />
                <Route path="/admin/notifications" element={<RoleRoute role="admin"><AdminNotifications /></RoleRoute>} />
                <Route path="/admin/fees" element={<RoleRoute role="admin"><AdminFees /></RoleRoute>} />


                {/* Catch-all to redirect back to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
