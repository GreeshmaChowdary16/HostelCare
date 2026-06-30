import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import './LoginPage.css';

function LoginPage() {
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loginError, setLoginError] = useState(null); // can be boolean or string
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

    const resetForm = () => {
        setRole(null);
        setLoginError(null);
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
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;
