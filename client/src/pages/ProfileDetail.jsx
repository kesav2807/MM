import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './ProfileDetail.css';
import { 
    User, MapPin, Briefcase, Heart, MessageSquare, 
    ChevronLeft, CheckCircle, ShieldCheck, GraduationCap, 
    Calendar, Users, Info, Globe, Smartphone, Lock,
    Phone, MessageCircle, Bookmark, Star, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { userAPI, interactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PremiumModal from '../components/PremiumModal';

const ProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePhoto, setActivePhoto] = useState(0);
    const [isSent, setIsSent] = useState(false);
    const [isShortlisted, setIsShortlisted] = useState(false);
    const [showPremium, setShowPremium] = useState(false);

    const isPremium = authUser?.status?.isPremium || false;

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id || id === 'undefined') {
                setLoading(false);
                return;
            }
            try {
                const res = await userAPI.getProfile(id);
                const data = res.data.data;
                setProfile(data);
                setIsSent(data.hasSentInterest || false);
                setIsShortlisted(data.isShortlisted || false);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const handleToggleInterest = async () => {
        try {
            if (isSent) {
                await interactionAPI.cancelInterest(id);
                setIsSent(false);
            } else {
                await interactionAPI.sendInterest(id);
                setIsSent(true);
            }
        } catch (error) { console.error('Error toggling interest:', error); }
    };

    const handleShortlist = async () => {
        try {
            const res = await interactionAPI.shortlist(id);
            setIsShortlisted(res.data.action === 'added');
        } catch (err) { console.error(err); }
    };

    const handleCall = () => {
        if (!isPremium) { setShowPremium(true); return; }
        if (profile?.contactInfo?.mobile) window.location.href = `tel:${profile.contactInfo.mobile}`;
    };

    const handleWhatsApp = () => {
        if (!isPremium) { setShowPremium(true); return; }
        if (profile?.contactInfo?.mobile) window.open(`https://wa.me/${profile.contactInfo.mobile.replace(/\D/g,'')}`, '_blank');
    };

    if (loading) return (
        <div className="loading-screen">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="spinner"></motion.div>
        </div>
    );
    if (!profile) return <div className="container py-5 text-center">Profile not found.</div>;

    const { basicInfo, contactInfo, personalDetails, status, profilePhotos, profileId } = profile;

    return (
        <div className="profile-detail-page">
            <Navbar />
            
            <div className="profile-container">
                <button className="back-link" onClick={() => navigate(-1)}>
                    <ChevronLeft size={18} /> Back to Search
                </button>

                <div className="profile-grid">
                    {/* Left: Photos & Key Info */}
                    <div className="profile-left">
                        <div className="photo-gallery-v10">
                            <div className="main-photo-v10">
                                <img src={profilePhotos?.[activePhoto] || 'https://via.placeholder.com/400x500?text=Profile'} alt={basicInfo.name} />
                                {status?.isVerified && <div className="verified-ribbon"><CheckCircle size={16} /> ID Verified Profile</div>}
                            </div>
                            {profilePhotos?.length > 1 && (
                                <div className="photo-thumbs-v10">
                                    {profilePhotos.map((p, idx) => (
                                        <img 
                                            key={idx} 
                                            src={p} 
                                            alt="Thumb" 
                                            className={`thumb-v10 ${activePhoto === idx ? 'active' : ''}`} 
                                            onClick={() => setActivePhoto(idx)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="trust-card-v10">
                            <div className="trust-header">
                                <h3><ShieldCheck size={18} color="#16a34a" /> Trust Score</h3>
                                <span className="trust-badge-mini">85%</span>
                            </div>
                            <div className="trust-bar-bg">
                                <motion.div 
                                    className="trust-bar-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: '85%' }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                ></motion.div>
                            </div>
                            <p className="text-muted small">Mobile & Photo Verified. Trusted profile.</p>
                        </div>
                    </div>

                    {/* Middle: Details */}
                    <main className="profile-middle">
                        <section className="content-card-v10">
                            <div className="profile-header-v10">
                                {status?.isPremium && <div className="premium-badge-text" style={{ width: 'fit-content', marginBottom: '0.5rem' }}>PREMIUM MEMBER</div>}
                                <h1>{basicInfo.name} <span className="profile-id-v10">({profileId})</span></h1>
                            </div>
                            <div className="header-meta-v10">
                                <span>{basicInfo.age} yrs</span>
                                <span className="meta-dot">•</span>
                                <span>{personalDetails?.height || "5'6\""}</span>
                                <span className="meta-dot">•</span>
                                <span>{basicInfo.religion}</span>
                                <span className="meta-dot">•</span>
                                <span>{basicInfo.maritalStatus}</span>
                            </div>
                            <div className="location-tag" style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={16}/> {contactInfo?.location?.city || 'Madurai'}, {contactInfo?.location?.state || 'Tamil Nadu'}
                            </div>
                        </section>

                        <section className="content-card-v10">
                            <h3 className="v10-sec-title">About Me</h3>
                            <p className="about-text-v10">{personalDetails?.aboutSelf || 'A simple and down-to-earth person looking for a partner to build a beautiful life with.'}</p>
                        </section>

                        <section className="content-card-v10">
                            <h3 className="v10-sec-title">Education & Profession</h3>
                            <div className="info-grid-v10">
                                <div className="v10-info-item"><label>Education</label><span>{personalDetails?.education || 'M.C.A.'}</span></div>
                                <div className="v10-info-item"><label>College</label><span>{personalDetails?.college || 'Not specified'}</span></div>
                                <div className="v10-info-item"><label>Occupation</label><span>{personalDetails?.occupation || 'Software Engineer'}</span></div>
                                <div className="v10-info-item"><label>Work Location</label><span>{personalDetails?.workLocation || contactInfo?.location?.city}</span></div>
                                <div className="v10-info-item"><label>Annual Income</label><span>{personalDetails?.income || '₹5L - 7L'}</span></div>
                            </div>
                        </section>

                        <section className="content-card-v10">
                            <h3 className="v10-sec-title">Religion & Caste</h3>
                            <div className="info-grid-v10">
                                <div className="v10-info-item"><label>Religion</label><span>{basicInfo.religion}</span></div>
                                <div className="v10-info-item"><label>Caste / Sub Caste</label><span>{personalDetails?.caste || 'Caste'} / {personalDetails?.subCaste || 'N/A'}</span></div>
                                <div className="v10-info-item"><label>Mother Tongue</label><span>{basicInfo.motherTongue}</span></div>
                                <div className="v10-info-item"><label>Star / Rasi</label><span>{personalDetails?.starRasi || 'Not specified'}</span></div>
                            </div>
                        </section>

                        <section className="content-card-v10">
                            <h3 className="v10-sec-title">Contact Details</h3>
                            {!isPremium ? (
                                <div className="contact-restricted-v10">
                                    <div className="lock-avatar-v10"><Lock size={24} /></div>
                                    <p>Upgrade to Premium to view Mobile Number, Email and Whatsapp details of {basicInfo.name}</p>
                                    <button className="btn-upgrade mt-3" onClick={() => setShowPremium(true)} style={{ background: '#f8fafc', border: '1px solid #ea580c', color: '#ea580c', padding: '0.6rem 1.5rem', borderRadius: '100px', fontWeight: 800, cursor: 'pointer' }}>Upgrade Now</button>
                                </div>
                            ) : (
                                <div className="info-grid-v10">
                                    <div className="v10-info-item"><label>Mobile</label><span>{contactInfo.mobile}</span></div>
                                    <div className="v10-info-item"><label>Email</label><span>{contactInfo.email}</span></div>
                                </div>
                            )}
                        </section>
                    </main>

                    {/* Right: Actions Stickied */}
                    <aside className="profile-right">
                        <div className="sticky-aside-v10">
                            <div className="interaction-card-v10">
                                <h4>Like this Profile?</h4>
                                <p>Express interest and start your journey together.</p>
                                
                                <div className="v10-btn-group">
                                    <button 
                                        className={`interest-btn-v10 ${isSent ? 'sent' : ''}`}
                                        onClick={handleToggleInterest}
                                    >
                                        {isSent ? (<><CheckCircle size={20}/> Interest Sent</>) : (<><Heart size={20}/> Yes, I'm Interested</>)}
                                    </button>
                                </div>

                                <div className="v10-social-row">
                                    <div className="v10-icon-circle" onClick={handleCall}><Phone size={20} /></div>
                                    <div className="v10-icon-circle whatsapp" onClick={handleWhatsApp}><MessageCircle size={20} /></div>
                                </div>

                                <div 
                                    className={`shortlist-btn-v10 ${isShortlisted ? 'active' : ''}`}
                                    onClick={handleShortlist}
                                >
                                    <Bookmark size={16} fill={isShortlisted ? "#ef4444" : "transparent"} />
                                    {isShortlisted ? 'Shortlisted' : 'Shortlist Profile'}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <PremiumModal 
                isOpen={showPremium} 
                onClose={() => setShowPremium(false)} 
                peerName={basicInfo.name} 
                peerPhoto={profilePhotos?.[0]} 
            />

            {/* Mobile Interaction Bar */}
            <div className="mobile-profile-actions">
                <button 
                    className={`mb-action-btn ${isSent ? 'sent' : 'interest'}`}
                    onClick={handleToggleInterest}
                    style={{ background: isSent ? '#16a34a' : '#ea580c', color: 'white' }}
                >
                    {isSent ? <CheckCircle size={18}/> : <Heart size={18}/>}
                    {isSent ? 'Sent' : 'Interest'}
                </button>
                <button className="mb-action-btn chat" onClick={handleWhatsApp} style={{ background: '#22c55e', color: 'white' }}>
                    <MessageCircle size={18}/> Chat
                </button>
            </div>
        </div>
    );
};

export default ProfileDetail;
