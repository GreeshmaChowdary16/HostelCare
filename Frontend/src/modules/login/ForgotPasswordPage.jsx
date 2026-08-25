import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import './LoginPage.css';

function ForgotPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Step state: 'request' | 'reset' | 'success'
    const [step, setStep] = useState('request');

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
            setStep('reset');
        }
    }, [searchParams]);

    const hasMinLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

    const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMsg(data.message || 'Password reset instructions sent to your email.');
                setStep('reset');
            } else {
                setError(data.message || 'Failed to process request. Please try again.');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setError('Could not connect to server. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!isPasswordValid) {
            setError('Please satisfy all password complexity criteria.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token.trim(),
                    newPassword,
                    confirmPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep('success');
            } else {
                setError(data.message || 'Reset failed. Token may be invalid or expired.');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError('Could not connect to server. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="overlay"></div>
            <div className="login-card" style={{ maxWidth: '480px' }}>
                <button className="back-btn" type="button" onClick={() => navigate('/login')}>
                    &larr; Back to Login
                </button>

                {step === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: '#e3fdf4',
                            color: '#1cc88a',
                            fontSize: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h2 style={{ color: '#2e384d', marginBottom: '10px' }}>Password Reset Successful!</h2>
                        <p style={{ color: '#858796', fontSize: '14px', marginBottom: '25px' }}>
                            Your password has been updated successfully. You can now log in using your new credentials.
                        </p>
                        <button
                            type="button"
                            className="login-btn"
                            onClick={() => navigate('/login')}
                        >
                            Return to Login
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="login-header">
                            <div style={{ fontSize: '36px', color: 'var(--primary)', marginBottom: '10px' }}>
                                <i className="fas fa-key"></i>
                            </div>
                            <h2>Forgot Password?</h2>
                            <p>
                                {step === 'request'
                                    ? 'Enter your email address to receive reset instructions'
                                    : 'Enter the reset token and your new password'}
                            </p>
                        </div>

                        {error && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i>
                                {error}
                            </div>
                        )}

                        {successMsg && (
                            <div style={{
                                color: '#1cc88a',
                                background: '#e3fdf4',
                                padding: '12px 15px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                marginBottom: '20px',
                                textAlign: 'left',
                                borderLeft: '4px solid #1cc88a'
                            }}>
                                <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
                                {successMsg}
                            </div>
                        )}

                        {step === 'request' && !error && !successMsg && (
                            <div style={{
                                background: '#e7f3ff',
                                padding: '12px 15px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                marginBottom: '20px',
                                textAlign: 'left',
                                borderLeft: '4px solid #4e73df',
                                color: '#2e384d'
                            }}>
                                <i className="fas fa-info-circle" style={{ marginRight: '6px', color: '#4e73df' }}></i>
                                Enter your registered email address. You'll receive a password reset code within moments.
                            </div>
                        )}

                        {step === 'request' ? (
                            <form onSubmit={handleRequestReset}>
                                <div className="input-group">
                                    <label>Account Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="e.g. student@hostelcare.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError(null);
                                        }}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="login-btn"
                                    disabled={loading}
                                    style={{ opacity: loading ? 0.7 : 1 }}
                                >
                                    {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
                                </button>

                                <div style={{ marginTop: '20px', fontSize: '13px', color: '#858796' }}>
                                    Already have a reset token?{' '}
                                    <span
                                        onClick={() => { setStep('reset'); setError(null); }}
                                        style={{ color: '#4e73df', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Enter token here
                                    </span>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div style={{
                                    background: '#fef5e7',
                                    padding: '12px 15px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    marginBottom: '20px',
                                    textAlign: 'left',
                                    borderLeft: '4px solid #f8b739',
                                    color: '#2e384d'
                                }}>
                                    <i className="fas fa-envelope" style={{ marginRight: '6px', color: '#f8b739' }}></i>
                                    <strong>Check your email!</strong> We've sent a password reset code to <strong>{email}</strong>.
                                    <br />Check your spam folder if you don't see it.
                                </div>

                                <div className="input-group">
                                    <label>Reset Code</label>
                                    <input
                                        type="text"
                                        placeholder="Paste the code from your email"
                                        value={token}
                                        onChange={(e) => {
                                            setToken(e.target.value);
                                            setError(null);
                                        }}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>New Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setError(null);
                                        }}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Re-enter new password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setError(null);
                                        }}
                                        required
                                    />
                                </div>

                                {/* Password Criteria Rules Checklist */}
                                {newPassword.length > 0 && (
                                    <div style={{
                                        background: '#f8f9fc',
                                        padding: '12px 15px',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        marginBottom: '20px',
                                        textAlign: 'left'
                                    }}>
                                        <div style={{ fontWeight: 600, color: '#5a5c69', marginBottom: '6px' }}>Password Requirements:</div>
                                        <div style={{ color: hasMinLength ? '#1cc88a' : '#858796', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className={`fas ${hasMinLength ? 'fa-check' : 'fa-circle'}`} style={{ fontSize: '10px' }}></i> At least 8 characters
                                        </div>
                                        <div style={{ color: hasUppercase && hasLowercase ? '#1cc88a' : '#858796', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className={`fas ${hasUppercase && hasLowercase ? 'fa-check' : 'fa-circle'}`} style={{ fontSize: '10px' }}></i> Uppercase &amp; lowercase letters
                                        </div>
                                        <div style={{ color: hasNumber ? '#1cc88a' : '#858796', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className={`fas ${hasNumber ? 'fa-check' : 'fa-circle'}`} style={{ fontSize: '10px' }}></i> At least 1 number
                                        </div>
                                        <div style={{ color: hasSpecial ? '#1cc88a' : '#858796', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className={`fas ${hasSpecial ? 'fa-check' : 'fa-circle'}`} style={{ fontSize: '10px' }}></i> At least 1 special character
                                        </div>
                                        <div style={{ color: passwordsMatch ? '#1cc88a' : '#e74a3b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                            <i className={`fas ${passwordsMatch ? 'fa-check' : 'fa-times'}`} style={{ fontSize: '10px' }}></i> Passwords match
                                        </div>
                                    </div>
                                )}

                                <div className="options" style={{ marginBottom: '20px' }}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={showPassword}
                                            onChange={(e) => setShowPassword(e.target.checked)}
                                        /> Show passwords
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="login-btn"
                                    disabled={loading || !isPasswordValid || !passwordsMatch}
                                    style={{ opacity: (loading || !isPasswordValid || !passwordsMatch) ? 0.6 : 1 }}
                                >
                                    {loading ? 'Resetting Password...' : 'Reset Password'}
                                </button>

                                <div style={{ marginTop: '15px', fontSize: '13px', color: '#858796' }}>
                                    Need another token?{' '}
                                    <span
                                        onClick={() => { setStep('request'); setError(null); setSuccessMsg(null); }}
                                        style={{ color: '#4e73df', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Resend request
                                    </span>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
