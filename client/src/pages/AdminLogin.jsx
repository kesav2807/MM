import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/adminAPI';
import { ShieldCheck, Lock, Mail, ArrowRight, Activity, Users, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import './Admin.css';

const AdminLogin = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await adminAPI.login({ email: identifier, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Admin Credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-bg-shapes">
                <div className="shape s1" style={{ background: '#4f46e5' }}></div>
                <div className="shape s2" style={{ background: '#7c3aed' }}></div>
            </div>

            <motion.div 
                className="admin-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Visual Side */}
                <div className="visual-side">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                            <ShieldCheck size={32} />
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>MM Admin Panel</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '1rem' }}>Command Center access.</h1>
                        <p style={{ opacity: '0.8', lineHeight: '1.6' }}>
                            Monitor users, verify profiles, and manage the heartbeat of Madurai Matrimony.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem' }}>
                            <Activity size={20} />
                            <div>
                                <h4 style={{ fontWeight: '600', fontSize: '0.875rem' }}>Real-time Analytics</h4>
                                <p style={{ fontSize: '0.75rem', opacity: '0.6' }}>Live stats of user engagement</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem' }}>
                            <Users size={20} />
                            <div>
                                <h4 style={{ fontWeight: '600', fontSize: '0.875rem' }}>User Management</h4>
                                <p style={{ fontSize: '0.75rem', opacity: '0.6' }}>Complete control over member accounts</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="form-side">
                    <div className="mobile-only-header">
                        <ShieldCheck size={28} color="#4f46e5" />
                        <span>Madurai Matrimony</span>
                    </div>

                    <div className="form-header">
                        <h3 className="admin-form-title">MM Admin Login</h3>
                        <p className="admin-form-subtitle">Secure access to control panel</p>
                    </div>

                    {error && (
                        <div className="admin-error-box">
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="admin-login-form">
                        <div className="admin-input-group">
                            <label>Email or Mobile</label>
                            <div className="admin-input-wrapper">
                                <Mail className="icon" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="admin@maduraimatrimony.com"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="admin-input-group">
                            <label>Security Key</label>
                            <div className="admin-input-wrapper">
                                <Lock className="icon" size={18} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="admin-btn-primary"
                        >
                            {loading ? 'Authenticating...' : 'Access Command Center'}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="admin-footer">
                        <div className="footer-left">
                            <Database size={12} />
                            <span>v2.0 Enterprise</span>
                        </div>
                        <span>Madurai Matrimony Official</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default AdminLogin;
