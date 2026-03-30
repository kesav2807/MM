import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Settings as SettingsIcon, Shield, Bell, User, 
    Save, ArrowLeft, CheckCircle, AlertCircle, ChevronRight, Lock, Eye, EyeOff
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('privacy');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [settings, setSettings] = useState({
        privacy: {
            profileVisibility: 'All',
            photoVisibility: 'All',
            showMobile: true
        },
        notifications: {
            email: true,
            webPush: true
        }
    });

    useEffect(() => {
        if (user) {
            setSettings({
                privacy: user.privacy || settings.privacy,
                notifications: user.notifications || settings.notifications
            });
        }
    }, [user]);

    const handleToggle = (section, field) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: !prev[section][field]
            }
        }));
    };

    const handleSelect = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await userAPI.updateProfile(settings);
            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            setError('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'privacy', label: 'Privacy Control', icon: <Shield size={18} /> },
        { id: 'notif', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'account', label: 'Account Security', icon: <Lock size={18} /> }
    ];

    if (!user) return <div className="loading">Please login</div>;

    return (
        <div className="settings-page">
            <Navbar />
            
            <div className="settings-container container py-5">
                <header className="settings-header">
                    <button className="back-link" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1>Account Settings</h1>
                    <p>Manage your privacy, security and notifications</p>
                </header>

                <div className="settings-layout">
                    {/* Sidebar Tabs */}
                    <aside className="settings-tabs-sidebar">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span className="tab-label">{tab.label}</span>
                                <ChevronRight size={14} className="tab-arrow" />
                            </button>
                        ))}
                    </aside>

                    {/* Content Area */}
                    <main className="settings-card card shadow">
                        <AnimatePresence mode="wait">
                            {activeTab === 'privacy' && (
                                <motion.div 
                                    key="privacy"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="settings-section"
                                >
                                    <h3><Shield className="sec-icon" /> Privacy Settings</h3>
                                    
                                    <div className="setting-tile">
                                        <div className="tile-info">
                                            <h4>Profile Visibility</h4>
                                            <p>Who can view your full profile details?</p>
                                        </div>
                                        <div className="tile-options">
                                            {['All', 'Premium', 'Matches'].map(opt => (
                                                <button 
                                                    key={opt}
                                                    className={`opt-btn ${settings.privacy.profileVisibility === opt ? 'active' : ''}`}
                                                    onClick={() => handleSelect('privacy', 'profileVisibility', opt)}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="setting-tile">
                                        <div className="tile-info">
                                            <h4>Photo Visibility</h4>
                                            <p>Publicly show your profile photos?</p>
                                        </div>
                                        <div className="tile-options">
                                            {['All', 'Premium', 'Members'].map(opt => (
                                                <button 
                                                    key={opt}
                                                    className={`opt-btn ${settings.privacy.photoVisibility === opt ? 'active' : ''}`}
                                                    onClick={() => handleSelect('privacy', 'photoVisibility', opt)}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="setting-tile">
                                        <div className="tile-info">
                                            <h4>Show Mobile Number</h4>
                                            <p>Allow filtered matches to see your phone number</p>
                                        </div>
                                        <div className={`switch ${settings.privacy.showMobile ? 'on' : 'off'}`} onClick={() => handleToggle('privacy', 'showMobile')}>
                                            <div className="switch-dot"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'notif' && (
                                <motion.div 
                                    key="notif"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="settings-section"
                                >
                                    <h3><Bell className="sec-icon" /> Notifications</h3>
                                    
                                    <div className="setting-tile">
                                        <div className="tile-info">
                                            <h4>Email Notifications</h4>
                                            <p>Receive weekly match updates and messages via email</p>
                                        </div>
                                        <div className={`switch ${settings.notifications.email ? 'on' : 'off'}`} onClick={() => handleToggle('notifications', 'email')}>
                                            <div className="switch-dot"></div>
                                        </div>
                                    </div>

                                    <div className="setting-tile">
                                        <div className="tile-info">
                                            <h4>Web Push Notifications</h4>
                                            <p>Get real-time alerts when someone likes you</p>
                                        </div>
                                        <div className={`switch ${settings.notifications.webPush ? 'on' : 'off'}`} onClick={() => handleToggle('notifications', 'webPush')}>
                                            <div className="switch-dot"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'account' && (
                                <motion.div 
                                    key="account"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="settings-section"
                                >
                                    <h3><Lock className="sec-icon" /> Security</h3>
                                    <div className="danger-zone">
                                        <h4>Danger Zone</h4>
                                        <p>Deactivating your account will hide your profile from all searches.</p>
                                        <button className="btn-danger">Deactivate Account</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <footer className="settings-footer">
                            {error && <div className="error-alert"><AlertCircle size={16} /> {error}</div>}
                            {success && <div className="success-alert"><CheckCircle size={16} /> Settings updated successfully!</div>}
                            
                            <button className="btn-save-settings" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Saving...' : <><Save size={18} /> Update Settings</>}
                            </button>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Settings;
