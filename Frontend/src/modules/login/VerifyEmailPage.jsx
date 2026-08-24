import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import './LoginPage.css';

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token.trim() }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || 'Verification failed.');
                return;
            }
            setSuccess(data.message || `Email verified for ${searchParams.get('email') || 'your account'}.`);
            setTimeout(() => navigate('/login'), 1200);
        } catch (requestError) {
            console.error('Email verification error:', requestError);
            setError('Could not connect to server. Please check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="overlay"></div>
            <div className="login-card" style={{ maxWidth: '480px' }}>
                <Link className="back-btn" to="/login">&larr; Back to Login</Link>
                <div className="login-header">
                    <div style={{ fontSize: '36px', color: 'var(--primary)', marginBottom: '10px' }}><i className="fas fa-envelope-open-text"></i></div>
                    <h2>Verify Your Email</h2>
                    <p>Paste the verification token sent to your email</p>
                </div>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Verification Token</label>
                        <textarea value={token} onChange={(event) => setToken(event.target.value)} rows="4" required />
                    </div>
                    <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify Email'}</button>
                </form>
            </div>
        </div>
    );
}

export default VerifyEmailPage;
