import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [role, setRole] = useState(null);
    const [emailOrId, setEmailOrId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [validationError, setValidationError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setValidationError('');
        setLoginError(false);

        // Accept email addresses or unique IDs (alphanumeric, underscores, hyphens, length 3-15)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const idRegex = /^[a-zA-Z0-9_-]{3,15}$/;

        const trimmedInput = emailOrId.trim();
        const isEmail = emailRegex.test(trimmedInput);
        const isId = idRegex.test(trimmedInput);

        if (!isEmail && !isId) {
            setValidationError('Please enter a valid Email Address (e.g., name@example.com) or User ID (e.g., ADM-001, 88921).');
            return;
        }

        let isCorrectPassword = false;
        if (role === 'Admin' && password === 'password') {
            isCorrectPassword = true;
        } else if (role === 'Rector' && password === 'password1') {
            isCorrectPassword = true;
        } else if (role === 'Student' && password === 'password2') {
            isCorrectPassword = true;
        }

        if (isCorrectPassword) {
            console.log(`Successfully authenticated using ${isEmail ? 'Email' : 'User ID'}: ${trimmedInput}`);
            if (role === 'Admin') {
                navigate('/admin/dashboard');
            } else if (role === 'Rector') {
                navigate('/rector/dashboard');
            } else if (role === 'Student') {
                navigate('/student/dashboard');
            }
        } else {
            setLoginError(true);
        }
    };

    const handleGoogleLogin = () => {
        // Integration point for Google Authentication
        console.log(`Proceeding to authenticate via Google for role: ${role}`);
        alert(`Google Sign-In integration point (Mock Login successful for ${role})`);
        
        // Mock successful login redirection
        if (role === 'Admin') {
            navigate('/admin/dashboard');
        } else if (role === 'Rector') {
            navigate('/rector/dashboard');
        } else if (role === 'Student') {
            navigate('/student/dashboard');
        }
    };

    const resetForm = () => {
        setRole(null);
        setLoginError(false);
        setValidationError('');
        setPassword('');
        setEmailOrId('');
        setShowPassword(false);
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
                            <button 
                                type="button" 
                                className="google-btn" 
                                onClick={handleGoogleLogin}
                            >
                                <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>

                            <div className="login-separator">
                                <span>OR</span>
                            </div>

                             <div className="input-group">
                                <label>Email / ID</label>
                                <input 
                                    type="text" 
                                    placeholder={`Enter your Email or ID`}
                                    value={emailOrId}
                                    onChange={(e) => {
                                        setEmailOrId(e.target.value); 
                                        setLoginError(false);
                                        setValidationError('');
                                    }}
                                    required 
                                />
                                {validationError && (
                                    <div className="error-message" style={{ marginTop: '8px', marginBottom: '0' }}>
                                        {validationError}
                                    </div>
                                )}
                            </div>
                            
                            <div className="input-group">
                                <label>Password</label>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password" 
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value); 
                                        setLoginError(false);
                                        setValidationError('');
                                    }}
                                    required 
                                />
                            </div>

                            {loginError && (
                                <div className="error-message">
                                    Incorrect password. Please try again.
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
                                {loginError && (
                                    <a href="#" className="forgot-password">Forgot password?</a>
                                )}
                            </div>
                            
                            <button type="submit" className="login-btn">
                                Sign In
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;
