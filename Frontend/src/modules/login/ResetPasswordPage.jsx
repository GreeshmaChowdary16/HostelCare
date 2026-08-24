import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import './LoginPage.css';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const { token: paramToken } = useParams();
    const navigate = useNavigate();

    // Form States
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Flow States
    const [step, setStep] = useState('reset'); // 'reset' | 'success'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Extract token from URL ?token=xyz or route parameter /reset-password/xyz
    useEffect(() => {
        const queryToken = searchParams.get('token');
        const activeToken = paramToken || queryToken || '';
        if (activeToken) {
            setToken(activeToken);
        }
    }, [searchParams, paramToken]);

    // Password Complexity Rules
    const hasMinLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

    const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;

    // Handle Reset Password Submit
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);

        if (!token.trim()) {
            setError('Reset token is required. Please check your email.');
            return;
        }

        if (!isPasswordValid) {
            setError('Please satisfy all password complexity requirements.');
            return;
        }

        if (!passwordsMatch) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token.trim(),
                    newPassword,
                    confirmPassword
                })
            });

            const data = await response.json();
            if (response.ok) {
                setStep('success');
            } else {
                setError(data.message || 'Reset failed. Token may be invalid or expired.');
            }
        } catch (err) {
            console.error('Reset password network error:', err);
            setError('Could not connect to the server. Please try again.');
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
                                <i className="fas fa-lock"></i>
                            </div>
                            <h2>Reset Password</h2>
                            <p>Enter your reset token and define a new secure password</p>
                        </div>

                        {error && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleResetPassword}>
                            <div className="input-group">
                                <label>Reset Token</label>
                                <input
                                    type="text"
                                    placeholder="Enter token from email/console"
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

                            {/* Password complexity metrics panel */}
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
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResetPasswordPage;
