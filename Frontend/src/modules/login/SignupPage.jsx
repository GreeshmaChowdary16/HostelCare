import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import './LoginPage.css';

const initialForm = {
    name: '', email: '', password: '', phone: '', parentPhone: '', rollNo: '',
    branch: '', year: '', state: '', roomInfo: '', bio: ''
};

function SignupPage() {
    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updateField = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, role: 'student' }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || 'Could not create account.');
                return;
            }
            setMessage(data.message || 'Account created. Check your email for the verification token.');
            setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(form.email)}`), 800);
        } catch (requestError) {
            console.error('Signup error:', requestError);
            setError('Could not connect to server. Please check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="overlay"></div>
            <div className="login-card signup-card">
                <Link className="back-btn" to="/login">&larr; Back to Login</Link>
                <div className="login-header">
                    <div style={{ fontSize: '36px', color: 'var(--primary)', marginBottom: '10px' }}>
                        <i className="fas fa-user-graduate"></i>
                    </div>
                    <h2>Student Signup</h2>
                    <p>Create your HostelCare account with your email</p>
                </div>
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="signup-grid">
                        <div className="input-group"><label>Full Name</label><input name="name" value={form.name} onChange={updateField} required /></div>
                        <div className="input-group"><label>Email</label><input type="email" name="email" value={form.email} onChange={updateField} required /></div>
                        <div className="input-group"><label>Password</label><input type="password" name="password" value={form.password} onChange={updateField} minLength="8" required /></div>
                        <div className="input-group"><label>Phone</label><input name="phone" value={form.phone} onChange={updateField} /></div>
                        <div className="input-group"><label>Parent Phone</label><input name="parentPhone" value={form.parentPhone} onChange={updateField} /></div>
                        <div className="input-group"><label>Roll Number</label><input name="rollNo" value={form.rollNo} onChange={updateField} /></div>
                        <div className="input-group"><label>Branch</label><input name="branch" value={form.branch} onChange={updateField} /></div>
                        <div className="input-group"><label>Year</label><input name="year" value={form.year} onChange={updateField} /></div>
                        <div className="input-group"><label>State</label><input name="state" value={form.state} onChange={updateField} /></div>
                        <div className="input-group signup-wide"><label>Room / Hostel</label><input name="roomInfo" value={form.roomInfo} onChange={updateField} placeholder="Girls Hostel A - Room 302" /></div>
                        <div className="input-group signup-wide"><label>Short Bio</label><textarea name="bio" value={form.bio} onChange={updateField} rows="2" /></div>
                    </div>
                    <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Creating Account...' : 'Create Student Account'}</button>
                </form>
                <p className="signup-note">After signup, verify your email before logging in.</p>
            </div>
        </div>
    );
}

export default SignupPage;
