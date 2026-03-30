import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Settings, Heart, MapPin, Users,
    Save, ArrowLeft, CheckCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import './EditPreferences.css';

const EditPreferences = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('match');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        partnerPreferences: {
            ageMin: 18,
            ageMax: 100,
            religion: '',
            caste: '',
            education: '',
            income: '',
            city: ''
        }
    });

    useEffect(() => {
        if (user && user.partnerPreferences) {
            setFormData({
                partnerPreferences: { ...user.partnerPreferences }
            });
        }
    }, [user]);

    const handleChange = (e, field) => {
        setFormData(prev => ({
            ...prev,
            partnerPreferences: {
                ...prev.partnerPreferences,
                [field]: e.target.value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await userAPI.updateProfile(formData);
            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update preferences');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'match', label: 'Matching Logic', icon: <Heart size={18} /> },
        { id: 'geo', label: 'Geography', icon: <MapPin size={18} /> },
        { id: 'social', label: 'Social & Religious', icon: <Users size={18} /> }
    ];

    if (!user) return <div className="loading">Please login</div>;

    return (
        <div className="edit-prefs-page">
            <Navbar />
            
            <div className="edit-container container py-5">
                <header className="edit-header">
                    <button className="back-link" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1>Partner Preferences</h1>
                    <p>Tell us what you're looking for to get higher match percentages</p>
                </header>

                <div className="edit-layout">
                    {/* Sidebar Tabs */}
                    <aside className="edit-tabs-sidebar">
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

                    {/* Form Area */}
                    <main className="edit-form-card card shadow">
                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {activeTab === 'match' && (
                                    <motion.div 
                                        key="match"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="form-section"
                                    >
                                        <h3><Heart className="sec-icon" /> Matching Range</h3>
                                        <div className="form-grid">
                                            <div className="input-group">
                                                <label>Minimum Age</label>
                                                <input type="number" value={formData.partnerPreferences.ageMin} onChange={(e) => handleChange(e, 'ageMin')} />
                                            </div>
                                            <div className="input-group">
                                                <label>Maximum Age</label>
                                                <input type="number" value={formData.partnerPreferences.ageMax} onChange={(e) => handleChange(e, 'ageMax')} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'geo' && (
                                    <motion.div 
                                        key="geo"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="form-section"
                                    >
                                        <h3><MapPin className="sec-icon" /> Geographic Preferences</h3>
                                        <div className="form-grid">
                                            <div className="input-group full-width">
                                                <label>Preferred City (Leave blank for any)</label>
                                                <input value={formData.partnerPreferences.city} onChange={(e) => handleChange(e, 'city')} placeholder="e.g. Madurai" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'social' && (
                                    <motion.div 
                                        key="social"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="form-section"
                                    >
                                        <h3><Users className="sec-icon" /> Social & Demographics</h3>
                                        <div className="form-grid">
                                            <div className="input-group">
                                                <label>Religion Preference</label>
                                                <input value={formData.partnerPreferences.religion} onChange={(e) => handleChange(e, 'religion')} />
                                            </div>
                                            <div className="input-group">
                                                <label>Caste Preference</label>
                                                <input value={formData.partnerPreferences.caste} onChange={(e) => handleChange(e, 'caste')} />
                                            </div>
                                            <div className="input-group">
                                                <label>Minimum Education Level</label>
                                                <input value={formData.partnerPreferences.education} onChange={(e) => handleChange(e, 'education')} placeholder="e.g. Bachelor's" />
                                            </div>
                                            <div className="input-group">
                                                <label>Annual Income (Greater than)</label>
                                                <input value={formData.partnerPreferences.income} onChange={(e) => handleChange(e, 'income')} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="form-footer">
                                {error && <div className="error-alert"><AlertCircle size={16} /> {error}</div>}
                                {success && <div className="success-alert"><CheckCircle size={16} /> Preferences saved!</div>}
                                
                                <button type="submit" className="btn-save" disabled={loading}>
                                    {loading ? 'Saving...' : <><Save size={18} /> Save Matching Logic</>}
                                </button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default EditPreferences;
