import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, BookOpen, Briefcase, Heart, Camera, 
    Save, ArrowLeft, CheckCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import './EditProfile.css';

const EditProfile = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        basicInfo: {
            name: '',
            age: '',
            gender: '',
            dob: '',
            height: '',
            motherTongue: '',
            maritalStatus: ''
        },
        personalDetails: {
            religion: '',
            caste: '',
            education: '',
            occupation: '',
            income: '',
            aboutMe: ''
        },
        contactInfo: {
            location: {
                city: '',
                state: '',
                country: 'India'
            }
        }
    });

    useEffect(() => {
        if (user) {
            setFormData({
                basicInfo: { ...user.basicInfo },
                personalDetails: { ...user.personalDetails },
                contactInfo: { ...user.contactInfo }
            });
        }
    }, [user]);

    const handleChange = (e, section, field) => {
        const value = e.target.value;
        if (section === 'location') {
            setFormData(prev => ({
                ...prev,
                contactInfo: {
                    ...prev.contactInfo,
                    location: {
                        ...prev.contactInfo.location,
                        [field]: value
                    }
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await userAPI.updateProfile(formData);
            if (res.data.success) {
                setSuccess(true);
                // Update local auth context if needed, or re-fetch me
                setTimeout(() => {
                    setSuccess(false);
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: <User size={18} /> },
        { id: 'religious', label: 'Religious', icon: <Heart size={18} /> },
        { id: 'career', label: 'Education & Career', icon: <Briefcase size={18} /> },
        { id: 'about', label: 'About Me', icon: <BookOpen size={18} /> }
    ];

    if (!user) return <div className="loading">Please login to edit profile</div>;

    return (
        <div className="edit-profile-page">
            <Navbar />
            
            <div className="edit-container container py-5">
                <header className="edit-header">
                    <button className="back-link" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1>Edit Professional Profile</h1>
                    <p>Update your details to get better matches</p>
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
                                {activeTab === 'basic' && (
                                    <motion.div 
                                        key="basic"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="form-section"
                                    >
                                        <h3><User className="sec-icon" /> Basic Information</h3>
                                        <div className="form-grid">
                                            <div className="input-group">
                                                <label>Full Name</label>
                                                <input value={formData.basicInfo.name} onChange={(e) => handleChange(e, 'basicInfo', 'name')} required />
                                            </div>
                                            <div className="input-group">
                                                <label>Date of Birth</label>
                                                <input type="date" value={formData.basicInfo.dob?.split('T')[0]} onChange={(e) => handleChange(e, 'basicInfo', 'dob')} required />
                                            </div>
                                            <div className="input-group">
                                                <label>Height (e.g. 5'7")</label>
                                                <input value={formData.basicInfo.height} onChange={(e) => handleChange(e, 'basicInfo', 'height')} />
                                            </div>
                                            <div className="input-group">
                                                <label>Mother Tongue</label>
                                                <input value={formData.basicInfo.motherTongue} onChange={(e) => handleChange(e, 'basicInfo', 'motherTongue')} />
                                            </div>
                                            <div className="input-group">
                                                <label>Marital Status</label>
                                                <select value={formData.basicInfo.maritalStatus} onChange={(e) => handleChange(e, 'basicInfo', 'maritalStatus')}>
                                                    <option value="Never Married">Never Married</option>
                                                    <option value="Divorced">Divorced</option>
                                                    <option value="Widowed">Widowed</option>
                                                    <option value="Awaiting Divorce">Awaiting Divorce</option>
                                                </select>
                                            </div>
                                            <div className="input-group">
                                                <label>City</label>
                                                <input value={formData.contactInfo.location.city} onChange={(e) => handleChange(e, 'location', 'city')} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'religious' && (
                                    <motion.div 
                                        key="religious"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="form-section"
                                    >
                                        <h3><Heart className="sec-icon" /> Religion & Caste</h3>
                                        <div className="form-grid">
                                            <div className="input-group">
                                                <label>Religion</label>
                                                <input value={formData.personalDetails.religion} onChange={(e) => handleChange(e, 'personalDetails', 'religion')} />
                                            </div>
                                            <div className="input-group">
                                                <label>Caste / Sub-Caste</label>
                                                <input value={formData.personalDetails.caste} onChange={(e) => handleChange(e, 'personalDetails', 'caste')} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'career' && (
                                    <motion.div 
                                        key="career"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="form-section"
                                    >
                                        <h3><Briefcase className="sec-icon" /> Education & Career</h3>
                                        <div className="form-grid">
                                            <div className="input-group">
                                                <label>Highest Education</label>
                                                <input value={formData.personalDetails.education} onChange={(e) => handleChange(e, 'personalDetails', 'education')} />
                                            </div>
                                            <div className="input-group">
                                                <label>Occupation</label>
                                                <input value={formData.personalDetails.occupation} onChange={(e) => handleChange(e, 'personalDetails', 'occupation')} />
                                            </div>
                                            <div className="input-group">
                                                <label>Annual Income</label>
                                                <input value={formData.personalDetails.income} onChange={(e) => handleChange(e, 'personalDetails', 'income')} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'about' && (
                                    <motion.div 
                                        key="about"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="form-section"
                                    >
                                        <h3><BookOpen className="sec-icon" /> About Me</h3>
                                        <div className="input-group full-width">
                                            <label>Bio / Description</label>
                                            <textarea 
                                                rows="6" 
                                                value={formData.personalDetails.aboutMe} 
                                                onChange={(e) => handleChange(e, 'personalDetails', 'aboutMe')}
                                                placeholder="Tell us about yourself, your hobbies, and what you're looking for..."
                                            ></textarea>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="form-footer">
                                {error && <div className="error-alert"><AlertCircle size={16} /> {error}</div>}
                                {success && <div className="success-alert"><CheckCircle size={16} /> Profile updated successfully!</div>}
                                
                                <button type="submit" className="btn-save" disabled={loading}>
                                    {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
