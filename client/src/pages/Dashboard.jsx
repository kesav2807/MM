import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import './Dashboard.css';
import { 
    ChevronRight, Edit3, Settings, UserCheck, ShieldCheck, 
    ArrowRight, Clock, User, Heart, MessageSquare, Bell, Search, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);
    const dailyRef = useRef(null);
    const recentRef = useRef(null);

    const scroll = (ref, dir) => {
        if (ref.current) {
            const scrollAmount = ref.current.offsetWidth * 0.8;
            ref.current.scrollBy({
                left: dir === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const fetchDashData = async () => {
            try {
                const res = await userAPI.getDashboard();
                setDashData(res.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                if (error.response?.status === 401) {
                    logout();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashData();
    }, []);

    if (loading) return (
        <div className="loading-screen">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
               className="spinner"
            ></motion.div>
        </div>
    );

    const { stats, recommendations, user: dbUser } = dashData || {};
    const userToDisplay = dbUser || authUser;

    return (
        <div className="dashboard-tm">
            <Navbar />
            
            <div className="container tm-layout">
                {/* Mobile-Only Header Center */}
                <div className="tm-mobile-hero desktop-only-hidden">
                    <div className="hero-top">
                        <div className="hero-text">
                            <span>Welcome, back</span>
                            <h2>{userToDisplay?.basicInfo?.name}</h2>
                        </div>
                        <div className="hero-avatar">
                            <img src={userToDisplay?.profilePhotos?.[0] || 'https://via.placeholder.com/80'} alt="Me" />
                        </div>
                    </div>
                    <div className="tm-stats-pills">
                        <div className="stat-pill">
                            <Heart size={14} /> <span>{stats?.interestsReceived || 0} Interests</span>
                        </div>
                        <div className="stat-pill">
                            <MessageSquare size={14} /> <span>{stats?.messagesReceived || 0} Messages</span>
                        </div>
                        <div className="stat-pill">
                            <Bell size={14} /> <span>{stats?.profileViews || 0} Views</span>
                        </div>
                    </div>
                </div>

                {/* 1. Sidebar (Transformed on Mobile) */}
                <aside className="tm-sidebar">
                    <div className="tm-profile-card desktop-only">
                        <div className="tm-avatar">
                            <img src={userToDisplay?.profilePhotos?.[0] || 'https://via.placeholder.com/150'} alt="Profile" />
                        </div>
                        <h3 className="tm-name">{userToDisplay?.basicInfo?.name}</h3>
                        <div className="tm-id">{userToDisplay?.profileId}</div>
                        <div className="tm-status">
                            {userToDisplay?.status?.isPremium ? 'Premium Member' : 'Free member'}
                        </div>
                        
                        {!userToDisplay?.status?.isPremium && (
                            <div className="tm-upgrade-card">
                                <p>Upgrade membership to call or message with matches</p>
                                <button className="btn-upgrade" onClick={() => navigate('/plans')}>
                                    Upgrade now
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="tm-menu">
                        <div className="tm-menu-section main-heading-mobile">
                            <h4 className="section-label">Account Management</h4>
                        </div>
                        
                        <div className="tm-menu-section">
                            <Link to="/edit-profile" className="tm-menu-item">
                                <span className="m-icon"><Edit3 size={18} /></span>
                                <span>Edit My Profile</span>
                                <ChevronRight size={14} className="m-chevron-mobile" />
                            </Link>
                            <Link to="/edit-preferences" className="tm-menu-item">
                                <span className="m-icon"><Settings size={18} /></span>
                                <span>Partner Preferences</span>
                                <ChevronRight size={14} className="m-chevron-mobile" />
                            </Link>
                            <Link to="/verify" className="tm-menu-item">
                                <span className="m-icon"><ShieldCheck size={18} /></span>
                                <span>Identity Verification</span>
                                <ChevronRight size={14} className="m-chevron-mobile" />
                            </Link>
                        </div>

                        <div className="tm-menu-section no-border-mobile">
                            <h4 className="section-label">Preferences & Privacy</h4>
                            <Link to="/settings" className="tm-menu-item">
                                <span className="m-icon"><Settings size={18} /></span>
                                <span>Privacy Settings</span>
                                <ChevronRight size={14} className="m-chevron-mobile" />
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* 2. Main Content */}
                <main className="tm-main">
                    {/* Daily Recommendations */}
                    <section className="tm-section">
                        <div className="tm-section-header">
                            <div className="left">
                                <h2 className="tm-sec-title">Daily Recommendations</h2>
                                <p className="tm-sec-subtitle">Recommended matches for today</p>
                            </div>
                            {/* <div className="right">
                                <div className="tm-countdown">
                                    <span className="label">Time left to view</span>
                                    <span className="timer">07h:04m:48s</span>
                                </div>
                            </div> */}
                        </div>
                        <div className="tm-carousel-container">
                            <div className="tm-carousel-arrow left" onClick={() => scroll(dailyRef, 'prev')}><ChevronRight style={{ transform: 'rotate(180deg)' }} /></div>
                            <div className="tm-carousel" ref={dailyRef}>
                                {recommendations?.dailyMatches
                                    ?.filter(match => match.basicInfo?.gender !== userToDisplay?.basicInfo?.gender)
                                    .map(match => (
                                    <div key={match._id} className="tm-card" onClick={() => navigate(`/profile/${match._id}`)}>
                                        <div className="tm-card-img">
                                            <div className="tm-compat-badge">{Math.floor(Math.random() * 10 + 85)}%</div>
                                            <img src={match.profilePhotos?.[0] || 'https://via.placeholder.com/200'} alt={match.basicInfo.name} />
                                        </div>
                                        <div className="tm-card-info">
                                            <h4>{match.basicInfo.name}</h4>
                                            <p>{match.basicInfo.age} Yrs, {match.personalDetails?.height || "5'0\""}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="tm-carousel-arrow right" onClick={() => scroll(dailyRef, 'next')}><ChevronRight /></div>
                            <Link to="/matches" className="tm-view-all">View all <ChevronRight size={14} /></Link>
                        </div>
                    </section>

                    {/* All Matches */}
                    <section className="tm-section underline">
                        <div className="tm-section-header">
                            <div className="left">
                                <h2 className="tm-sec-title">All Matches ({recommendations?.dailyMatches?.length || 479})</h2>
                                <p className="tm-sec-subtitle">Members who match your partner preferences</p>
                            </div>
                        </div>

                        <div className="tm-carousel-container">
                            <div className="tm-carousel-arrow left" onClick={() => scroll(recentRef, 'prev')}><ChevronRight style={{ transform: 'rotate(180deg)' }} /></div>
                            <div className="tm-carousel" ref={recentRef}>
                                {recommendations?.newMembers
                                    ?.filter(match => match.basicInfo?.gender !== userToDisplay?.basicInfo?.gender)
                                    .map(match => (
                                    <div key={match._id} className="tm-card" onClick={() => navigate(`/profile/${match._id}`)}>
                                        <div className="tm-card-img">
                                            <div className="tm-compat-badge secondary">New Match</div>
                                            <img src={match.profilePhotos?.[0] || 'https://via.placeholder.com/200'} alt={match.basicInfo.name} />
                                        </div>
                                        <div className="tm-card-info">
                                            <h4>{match.basicInfo.name}</h4>
                                            <p>{match.basicInfo.age} Yrs, {match.personalDetails?.height || "5'0\""}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="tm-carousel-arrow right" onClick={() => scroll(recentRef, 'next')}><ChevronRight /></div>
                        </div>
                    </section>
                </main>
            </div>
            
            {/* Floating Chat Bubble */}
            <div className="tm-float-chat">
                <MessageSquare size={30} color="white" />
            </div>
        </div>
    );
};

export default Dashboard;
