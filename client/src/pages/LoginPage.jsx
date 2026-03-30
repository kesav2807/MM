import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Login.css';
import { Mail, Lock, ArrowRight, UserCheck, ShieldCheck, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState(''); // email or mobile
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(identifier, password);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Navbar />
            
            <div className="login-bg-shapes">
                <div className="shape s1"></div>
                <div className="shape s2"></div>
            </div>

            <div className="container login-container">
                <motion.div 
                    className="login-card-v2 card glass"
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="login-split">
                        {/* 1. Marketing Side */}
                        <div className="login-info-side">
                            <div className="info-top">
                                <span className="badge">Welcome Back</span>
                                <h2>Your soulmate is <span>waiting</span> for you.</h2>
                                <p>Join the most trusted matrimony community with millions of success stories.</p>
                            </div>
                            
                            <div className="login-features">
                                <div className="feat-item">
                                    <div className="feat-icon"><ShieldCheck size={18} /></div>
                                    <div className="feat-text">
                                        <h4>100% Secure</h4>
                                        <p>Your privacy is our priority</p>
                                    </div>
                                </div>
                                <div className="feat-item">
                                    <div className="feat-icon"><UserCheck size={18} /></div>
                                    <div className="feat-text">
                                        <h4>Verified Profiles</h4>
                                        <p>Connect with real members</p>
                                    </div>
                                </div>
                            </div>

                            <div className="login-illustration">
                                <div className="floating-heart"><Heart size={44} fill="var(--primary)" color="var(--primary)"/></div>
                            </div>
                        </div>

                        {/* 2. Form Side */}
                        <div className="login-form-side">
                            <div className="login-form-header">
                                <h3>Login to Account</h3>
                                <p>Enter your details to access your matches.</p>
                            </div>

                            {error && (
                                <motion.div 
                                    className="error-banner"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="premium-form">
                                <div className="field-group">
                                    <label>Email ID / Mobile No</label>
                                    <div className="field-container">
                                        <div className="field-icon"><User size={18} /></div>
                                        <input 
                                            type="text" 
                                            value={identifier} 
                                            placeholder="e.g. allu@gmail.com"
                                            onChange={(e) => setIdentifier(e.target.value)} 
                                            required 
                                            autoComplete="username"
                                        />
                                    </div>
                                </div>

                                <div className="field-group">
                                    <div className="label-row">
                                        <label>Password</label>
                                        <Link to="/forgot-password">Forgot?</Link>
                                    </div>
                                    <div className="field-container">
                                        <div className="field-icon"><Lock size={18} /></div>
                                        <input 
                                            type="password" 
                                            value={password} 
                                            placeholder="Minimum 6 characters"
                                            onChange={(e) => setPassword(e.target.value)} 
                                            required 
                                            autoComplete="current-password"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`btn btn-primary submit-btn-v2 ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Entering...' : 'Login to Dashboard'}
                                    <ArrowRight size={20} />
                                </button>
                            </form>

                            <div className="form-footer-v2">
                                <p>New member? <Link to="/">Create an account</Link></p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default LoginPage;
