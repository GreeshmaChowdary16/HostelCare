import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, GOOGLE_CLIENT_ID } from '../../config';
import './LoginPage.css';

function LoginPage() {
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loginError, setLoginError] = useState(null); // can be boolean or string
    const [showGoogleModal, setShowGoogleModal] = useState(false);
    const [customGoogleEmail, setCustomGoogleEmail] = useState('');
    const [customGoogleName, setCustomGoogleName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('savedEmail');
        const savedRole = localStorage.getItem('savedRole');

        if (savedEmail && savedRole) {
            setUsername(savedEmail);
            setRole(savedRole);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: username, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                // Validate role selection matches database role (case-insensitive)
                if (data.role.toLowerCase() !== role.toLowerCase()) {
                    setLoginError(`This account does not have ${role} privileges.`);
                    return;
                }

                // Save info to localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('name', data.name);
                localStorage.setItem('email', username);

                // Redirect based on role
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

    const handleGoogleCredentialResponse = async (response) => {
        if (!response.credential) {
            setLoginError('Google login failed');
            return;
        }

        try {
            const googleRes = await fetch(`${API_BASE_URL}/auth/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: response.credential,
                    role,
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
            console.error('Google login error:', error);
            setLoginError('Google login failed.');
        }
    };

    useEffect(() => {
        if (!role || !GOOGLE_CLIENT_ID) return;

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
    }, [role]);

    const handleGoogleLoginBtnClick = () => {
        setShowGoogleModal(true);
    };

    const selectMockGoogleAccount = async (email, name) => {
        setShowGoogleModal(false);
        setLoginError(null);
        
        const mockIdToken = `mock-google-token-email-${email}-${encodeURIComponent(name)}`;
        
        try {
            const googleRes = await fetch(`${API_BASE_URL}/auth/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: mockIdToken,
                    role,
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
            localStorage.setItem('email', googleData.email || email);

            if (googleData.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (googleData.role === 'rector') {
                navigate('/rector/dashboard');
            } else if (googleData.role === 'student') {
                navigate('/student/dashboard');
            }
        } catch (error) {
            console.error('Google login error:', error);
            setLoginError('Google login failed.');
        }
    };

    const resetForm = () => {
        setRole(null);
        setLoginError(null);
        setPassword('');
        setUsername('');
        setShowPassword(false);
        setShowGoogleModal(false);
    };

    return (
        <div className="login-container">
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
                                    {typeof loginError === 'string' ? loginError : "Incorrect password. Please try again."}
                                </div>
                            )}
                            
                            <div className="options" style={{ justifyContent: loginError ? 'space-between' : 'flex-start', gap: loginError ? '0' : '15px' }}>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={showPassword} 
                                        onChange={(e) => setShowPassword(e.target.checked)} 
                                    /> Show password
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    /> Remember me
                                </label>
                                {loginError && (
                                    <a href="#" className="forgot-password">Forgot password?</a>
                                )}
                            </div>
                            
                            <button type="submit" className="login-btn">
                                Sign In
                            </button>
                            <button 
                                type="button" 
                                className="google-btn" 
                                onClick={handleGoogleLoginBtnClick}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
                                    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.66 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"/>
                                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.47-1.11 2.72-2.36 3.56l3.66 2.84c2.14-1.97 3.38-4.88 3.38-8.5z"/>
                                    <path fill="#FBBC05" d="M5.24 14.55A7.03 7.03 0 0 1 4.8 12c0-.88.15-1.72.43-2.52L1.39 6.49C.5 8.28 0 10.28 0 12s.5 3.72 1.39 5.51l3.85-2.96z"/>
                                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-4.3 1.09-3.34 0-5.86-1.81-6.76-4.51L1.39 16.8A11.96 11.96 0 0 0 12 23z"/>
                                </svg>
                                Sign in with Gmail
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {showGoogleModal && (
                <div className="google-modal-overlay">
                    <div className="google-modal-card">
                        <div className="google-modal-header">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.66 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"/>
                                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.47-1.11 2.72-2.36 3.56l3.66 2.84c2.14-1.97 3.38-4.88 3.38-8.5z"/>
                                <path fill="#FBBC05" d="M5.24 14.55A7.03 7.03 0 0 1 4.8 12c0-.88.15-1.72.43-2.52L1.39 6.49C.5 8.28 0 10.28 0 12s.5 3.72 1.39 5.51l3.85-2.96z"/>
                                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-4.3 1.09-3.34 0-5.86-1.81-6.76-4.51L1.39 16.8A11.96 11.96 0 0 0 12 23z"/>
                            </svg>
                            <h3>Sign in with Google</h3>
                            <p>Choose an account to continue to HostelCare</p>
                        </div>
                        
                        <div className="google-accounts-list">
                            {role === 'Student' && (
                                <>
                                    <div className="google-account-item" onClick={() => selectMockGoogleAccount('student@hostelcare.com', 'Anjali Sharma')}>
                                        <div className="google-avatar-circle">A</div>
                                        <div className="google-account-details">
                                            <div className="google-account-name">Anjali Sharma</div>
                                            <div className="google-account-email">student@hostelcare.com</div>
                                        </div>
                                    </div>
                                    <div className="google-account-item" onClick={() => selectMockGoogleAccount('student3@hostelcare.com', 'Greeshma Chowdary')}>
                                        <div className="google-avatar-circle">G</div>
                                        <div className="google-account-details">
                                            <div className="google-account-name">Greeshma Chowdary</div>
                                            <div className="google-account-email">student3@hostelcare.com</div>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            {role === 'Rector' && (
                                <div className="google-account-item" onClick={() => selectMockGoogleAccount('rector@hostelcare.com', 'Mrs. Priya Kumar')}>
                                    <div className="google-avatar-circle">P</div>
                                    <div className="google-account-details">
                                        <div className="google-account-name">Mrs. Priya Kumar</div>
                                        <div className="google-account-email">rector@hostelcare.com</div>
                                    </div>
                                </div>
                            )}

                            {role === 'Admin' && (
                                <div className="google-account-item" onClick={() => selectMockGoogleAccount('admin@hostelcare.com', 'Administrator')}>
                                    <div className="google-avatar-circle">AD</div>
                                    <div className="google-account-details">
                                        <div className="google-account-name">Administrator</div>
                                        <div className="google-account-email">admin@hostelcare.com</div>
                                    </div>
                                </div>
                            )}

                            <div className="google-account-item-form">
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#5f6368', marginBottom: '8px', textAlign: 'left' }}>Use another account:</div>
                                <input 
                                    type="email" 
                                    placeholder="Enter your Gmail/Google Email" 
                                    value={customGoogleEmail}
                                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #dadce0', fontSize: '13px', outline: 'none', marginBottom: '8px' }}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Enter your Name" 
                                    value={customGoogleName}
                                    onChange={(e) => setCustomGoogleName(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #dadce0', fontSize: '13px', outline: 'none', marginBottom: '10px' }}
                                />
                                <button 
                                    type="button" 
                                    className="google-modal-btn"
                                    onClick={() => {
                                        if (!customGoogleEmail.trim()) {
                                            alert('Please enter an email address.');
                                            return;
                                        }
                                        selectMockGoogleAccount(customGoogleEmail, customGoogleName || 'Google User');
                                    }}
                                >
                                    Proceed
                                </button>
                            </div>
                        </div>
                        
                        <button type="button" className="google-modal-close" onClick={() => setShowGoogleModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPage;
