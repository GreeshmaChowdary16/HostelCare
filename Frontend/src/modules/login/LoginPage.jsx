import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        let isCorrectPassword = false;
        if (role === 'Admin' && password === 'password') {
            isCorrectPassword = true;
        } else if (role === 'Rector' && password === 'password1') {
            isCorrectPassword = true;
        } else if (role === 'Student' && password === 'password2') {
            isCorrectPassword = true;
        }

        if (isCorrectPassword) {
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

    const resetForm = () => {
        setRole(null);
        setLoginError(false);
        setPassword('');
        setUsername('');
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
                            <div className="input-group">
                                <label>Username or Email</label>
                                <input 
                                    type="text" 
                                    placeholder={`Enter ${role.toLowerCase()} username`}
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value); 
                                        setLoginError(false);
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
                                        setLoginError(false);
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
