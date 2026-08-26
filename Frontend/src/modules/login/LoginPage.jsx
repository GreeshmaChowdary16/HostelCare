import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL, GOOGLE_CLIENT_ID } from '../../config';
import './LoginPage.css';

function LoginPage() {
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loginError, setLoginError] = useState(null);
    
    // Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

    // Mock Modal states
    const [showMockModal, setShowMockModal] = useState(false);
    const [mockEmail, setMockEmail] = useState('');
    const [mockEmailError, setMockEmailError] = useState('');

    const navigate = useNavigate();

    // Verify if GOOGLE_CLIENT_ID is valid or a placeholder
    const isGoogleClientIdConfigured = 
        GOOGLE_CLIENT_ID && 
        GOOGLE_CLIENT_ID !== '' && 
        !GOOGLE_CLIENT_ID.startsWith('your-google-oauth');

    useEffect(() => {
        const savedEmail = localStorage.getItem('savedEmail');
        const savedRole = localStorage.getItem('savedRole');

        if (savedEmail && savedRole) {
            setUsername(savedEmail);
            setRole(savedRole);
            setRememberMe(true);
        }
    }, []);

    // Regular Email/Password Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError(null);
        setIsLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: username.trim(), password, role })
            });

            const data = await response.json();

            if (response.ok) {
                // Validate privilege matches selected role
                if (data.role.toLowerCase() !== role.toLowerCase()) {
                    setLoginError(`This account does not have ${role} privileges.`);
                    return;
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('name', data.name);
                localStorage.setItem('email', username);
                localStorage.setItem('profileImage', data.profileImage || '');

                if (data.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (data.role === 'rector') {
                    navigate('/rector/dashboard');
                } else if (data.role === 'student') {
                    navigate('/student/dashboard');
                }
            } else {
                setLoginError(data.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Could not connect to server. Please check if backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (rememberMe) {
            localStorage.setItem('savedEmail', username);
            localStorage.setItem('savedRole', role);
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedRole');
        }
    }, [rememberMe, username, role]);

    // Handle Google token credential from GSI client callback
    const handleGoogleCredentialResponse = async (response) => {
        if (!response.credential) {
            setLoginError('Google login failed: missing credentials.');
            return;
        }

        setIsLoadingGoogle(true);
        try {
            const googleRes = await fetch(`${API_BASE_URL}/auth/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: response.credential,
                    role: role.toLowerCase(),
                }),
            });

            const googleData = await googleRes.json();
            if (!googleRes.ok) {
                setLoginError(googleData.message || 'Google login failed');
                return;
            }

            localStorage.setItem('token', googleData.token);
            localStorage.setItem('role', googleData.role);
            localStorage.setItem('name', googleData.name);
            localStorage.setItem('email', googleData.email || '');
            localStorage.setItem('profileImage', googleData.profileImage || '');

            if (googleData.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (googleData.role === 'rector') {
                navigate('/rector/dashboard');
            } else if (googleData.role === 'student') {
                navigate('/student/dashboard');
            }
        } catch (error) {
            console.error('Google login error:', error);
            setLoginError('Google login connection failed.');
        } finally {
            setIsLoadingGoogle(false);
        }
    };

    // Load/Initialize GSI Sign-In Button dynamically
    useEffect(() => {
        if (!role || !isGoogleClientIdConfigured) return;

        const initializeGoogleBtn = () => {
            const client = window.google;
            if (client && client.accounts && client.accounts.id) {
                client.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleCredentialResponse,
                });

                const btnEl = document.getElementById('google-signin-btn');
                if (btnEl) {
                    client.accounts.id.renderButton(btnEl, {
                        theme: 'outline',
                        size: 'large',
                        width: btnEl.offsetWidth || 420,
                    });
                }
            }
        };

        if (window.google) {
            initializeGoogleBtn();
        } else {
            const timer = setTimeout(initializeGoogleBtn, 1000);
            return () => clearTimeout(timer);
        }
    }, [role, isGoogleClientIdConfigured]);

    // Handle Mock Dialog Actions
    const openMockLoginDialog = () => {
        setLoginError(null);
        if (!role) {
            setLoginError('Please select your role first.');
            return;
        }
        setMockEmail(
            role === 'Admin' ? 'admin@hostel.edu' : 
            role === 'Rector' ? 'rector@hostelcare.com' : 
            'student@hostelcare.com'
        );
        setMockEmailError('');
        setShowMockModal(true);
    };

    const handleMockLoginSubmit = async (e) => {
        e.preventDefault();
        setMockEmailError('');

        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mockEmail)) {
            setMockEmailError('Please enter a valid email address.');
            return;
        }

        setShowMockModal(false);
        setIsLoadingGoogle(true);
        try {
            // Generate mock token: mock-google-token-{email}-{role}
            const mockToken = `mock-google-token-${mockEmail.trim()}-${role}`;
            
            const googleRes = await fetch(`${API_BASE_URL}/auth/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: mockToken,
                    role: role.toLowerCase(),
                }),
            });

            const googleData = await googleRes.json();
            if (!googleRes.ok) {
                setLoginError(googleData.message || 'Google login failed');
                return;
            }

            localStorage.setItem('token', googleData.token);
            localStorage.setItem('role', googleData.role);
            localStorage.setItem('name', googleData.name);
            localStorage.setItem('email', googleData.email || '');

            if (googleData.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (googleData.role === 'rector') {
                navigate('/rector/dashboard');
            } else if (googleData.role === 'student') {
                navigate('/student/dashboard');
            }
        } catch (error) {
            console.error('Simulated Google login connection error:', error);
            setLoginError('Google login connection failed.');
        } finally {
            setIsLoadingGoogle(false);
        }
    };

    const resetForm = () => {
        setRole(null);
        setLoginError(null);
        setPassword('');
        setUsername('');
        setShowPassword(false);
    };

    return (
        <div className="login-container">
            <style>{`
                .google-btn-custom {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px 16px;
                    background-color: #fff;
                    border: 1px solid #dadce0;
                    border-radius: 8px;
                    color: #3c4043;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s, box-shadow 0.2s;
                    margin-top: 15px;
                    font-family: inherit;
                }
                .google-btn-custom:hover {
                    background-color: #f7f8f8;
                    box-shadow: 0 1px 2px rgba(60,64,67,0.1);
                }
                .google-btn-custom:disabled {
                    background-color: #f1f3f4;
                    color: #9aa0a6;
                    cursor: not-allowed;
                }
                .google-btn-custom i {
                    font-size: 18px;
                    color: #4285f4;
                }

                /* Simulated Google Account Selector CSS Modal */
                .mock-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(4px);
                }
                .mock-modal {
                    background: #fff;
                    border-radius: 12px;
                    padding: 30px;
                    width: 90%;
                    max-width: 440px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    animation: modalFadeIn 0.3s ease-out;
                    text-align: left;
                }
                .mock-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1a73e8;
                    margin-top: 0;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .mock-role-badge {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 12px;
                    background: #e8f0fe;
                    color: #1a73e8;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 20px;
                }
                .mock-form-group {
                    margin-bottom: 20px;
                }
                .mock-label {
                    display: block;
                    font-size: 12px;
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                }
                .mock-input {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #dadce0;
                    border-radius: 6px;
                    font-size: 14px;
                    outline: none;
                }
                .mock-input:focus {
                    border-color: #1a73e8;
                }
                .mock-error {
                    color: #d93025;
                    font-size: 12px;
                    margin-top: 5px;
                }
                .mock-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    border-top: 1px solid #f1f3f4;
                    padding-top: 15px;
                }
                .mock-btn {
                    padding: 8px 16px;
                    font-size: 14px;
                    font-weight: 600;
                    border-radius: 6px;
                    cursor: pointer;
                    border: none;
                }
                .mock-btn-cancel {
                    background: #f1f3f4;
                    color: #3c4043;
                }
                .mock-btn-cancel:hover { background: #e8eaed; }
                .mock-btn-submit {
                    background: #1a73e8;
                    color: #fff;
                }
                .mock-btn-submit:hover { background: #1557b0; }

                @keyframes modalFadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="overlay"></div>
            <div className="login-card">
                {!role ? (
                    <div className="role-selection">
                        <div className="login-header">
                            <div style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '10px' }}>
                                <i className="fas fa-building"></i>
                            </div>
                            <h2>Welcome to HostelCare</h2>
                            <p>Please select your role to continue</p>
                        </div>
                        <div className="role-cards">
                            <div className="role-card" onClick={() => setRole('Admin')}>
                                <div className="role-icon">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                <h3>Admin</h3>
                            </div>
                            <div className="role-card" onClick={() => setRole('Rector')}>
                                <div className="role-icon">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <h3>Rector</h3>
                            </div>
                            <div className="role-card" onClick={() => setRole('Student')}>
                                <div className="role-icon">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                                </div>
                                <h3>Student</h3>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="login-form-container">
                        <button className="back-btn" type="button" onClick={resetForm}>
                            &larr; Back to roles
                        </button>
                        <div className="login-header">
                            <div style={{ fontSize: '36px', color: 'var(--primary)', marginBottom: '10px' }}>
                                <i className="fas fa-building"></i>
                            </div>
                            <h2>{role} Login</h2>
                            <p>Enter your credentials to access your account</p>
                        </div>
                        
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label>Username or Email</label>
                                <input 
                                    type="text" 
                                    placeholder={`Enter ${role.toLowerCase()} username`}
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value); 
                                        setLoginError(null);
                                    }}
                                    required 
                                />
                            </div>
                            
                            <div className="input-group">
                                <label>Password</label>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder={
                                        role === 'Admin' ? "Enter password (hint: password)" :
                                        role === 'Rector' ? "Enter password (hint: password1)" :
                                        "Enter password (hint: password2)"
                                    } 
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value); 
                                        setLoginError(null);
                                    }}
                                    required 
                                />
                            </div>

                            {loginError && (
                                <div className="error-message">
                                    {typeof loginError === 'string' ? loginError : "Incorrect credentials. Please try again."}
                                </div>
                            )}
                            
                            <div className="options" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            checked={showPassword} 
                                            onChange={(e) => setShowPassword(e.target.checked)} 
                                        /> Show
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        /> Remember me
                                    </label>
                                </div>
                                <Link to="/forgot-password" className="forgot-password" style={{ fontSize: '13px' }}>
                                    Forgot password?
                                </Link>
                            </div>
                            
                            <button type="submit" className="login-btn" disabled={isLoading}>
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>

                            {/* Render either the official Google button or our custom simulated button fallback */}
                            {isGoogleClientIdConfigured ? (
                                <div id="google-signin-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '15px' }} />
                            ) : (
                                <button 
                                    type="button" 
                                    className="google-btn-custom" 
                                    onClick={openMockLoginDialog}
                                    disabled={isLoadingGoogle}
                                >
                                    <i className="fab fa-google"></i>
                                    {isLoadingGoogle ? 'Signing in with Google...' : 'Continue with Google'}
                                </button>
                            )}
                        </form>
                        {role === 'Student' && (
                            <p className="signup-link">
                                New student? <Link to="/signup">Create an account</Link>
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* MOCK GOOGLE LOGIN DIALOG MODAL */}
            {showMockModal && (
                <div className="mock-overlay">
                    <div className="mock-modal">
                        <div className="mock-title">
                            <i className="fab fa-google"></i> Google Account Selection
                        </div>
                        <div className="mock-role-badge">Role: {role}</div>
                        <form onSubmit={handleMockLoginSubmit}>
                            <div className="mock-form-group">
                                <label className="mock-label">Google Account Email</label>
                                <input
                                    type="email"
                                    className="mock-input"
                                    value={mockEmail}
                                    onChange={(e) => setMockEmail(e.target.value)}
                                    placeholder="Enter your email e.g. user@gmail.com"
                                    required
                                    autoFocus
                                />
                                {mockEmailError && (
                                    <div className="mock-error">{mockEmailError}</div>
                                )}
                            </div>
                            <div className="mock-footer">
                                <button 
                                    type="button" 
                                    className="mock-btn mock-btn-cancel" 
                                    onClick={() => setShowMockModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="mock-btn mock-btn-submit"
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPage;
