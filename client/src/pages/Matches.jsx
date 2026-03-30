import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MatchCard from '../components/MatchCard';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import './Matches.css';
import { Filter, Search, ChevronDown, SlidersHorizontal, MapPin, GraduationCap, Users, Star, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home, Image as ImageIcon, Zap, Trophy, Globe, X } from 'lucide-react';

const Matches = () => {
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [subFilter, setSubFilter] = useState('all_matches');
    const [filters, setFilters] = useState({
        ageMin: 18,
        ageMax: 45,
        religion: '',
        caste: '',
        maritalStatus: '',
        city: '',
        education: ''
    });

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const params = { ...filters, tab: activeTab, subFilter };
            const res = await userAPI.getMatches(params);
            setMatches(res.data.data);
        } catch (error) {
            console.error('Error fetching matches:', error);
            if (error.response?.status === 401) {
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, [filters, activeTab, subFilter]);

    const handleIgnoreLocal = (id) => {
        setMatches(matches.filter(m => m._id !== id));
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    return (
        <div className="matches-page">
            <Navbar />
            
            <div className="matches-layout container">
                {/* Mobile Filter Toggle */}
                <button 
                    className="mobile-filter-toggle" 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                    {showMobileFilters ? <X size={20} /> : <SlidersHorizontal size={20} />}
                    <span>{showMobileFilters ? 'Close' : 'Filter'}</span>
                </button>

                {/* 1. Left Sidebar Filters (Accordion Style) */}
                <aside className={`matches-sidebar ${showMobileFilters ? 'mobile-show' : ''}`}>
                    <div className="filter-header card">
                        <h3><SlidersHorizontal size={18} /> Refine Search</h3>
                        <button className="reset-btn" onClick={() => setFilters({
                            ageMin: 18, ageMax: 45, religion: '', caste: '', maritalStatus: '', city: '', education: ''
                        })}>Reset All</button>
                    </div>

                    <div className="filter-group-v3 card">
                        <div className="f-item-v3">
                            <label className="filter-label"><Users size={16}/> Religion / Caste</label>
                            <select name="religion" value={filters.religion} onChange={handleFilterChange}>
                                <option value="">Any Religion</option>
                                <option value="Hindu">Hindu</option><option value="Christian">Christian</option><option value="Muslim">Muslim</option>
                            </select>
                            <input type="text" name="caste" value={filters.caste} onChange={handleFilterChange} placeholder="Enter Caste..." className="mini-input" />
                        </div>

                        <div className="f-item-v3">
                            <label className="filter-label"><Star size={16}/> Star / Raasi</label>
                            <select name="star" value={filters.star || ''} onChange={handleFilterChange}>
                                <option value="">Any Star</option>
                                <option value="Ashwini">Ashwini</option><option value="Bharani">Bharani</option><option value="Kritika">Kritika</option><option value="Rohini">Rohini</option>
                            </select>
                        </div>

                        <div className="f-item-v3">
                            <label className="filter-label"><ShieldCheck size={16}/> Manglik / Dosham</label>
                            <select name="dosham" value={filters.dosham || ''} onChange={handleFilterChange}>
                                <option value="">No Preference</option>
                                <option value="None">None (Chevvai Dosham No)</option>
                                <option value="Yes">Yes (Chevvai Dosham Yes)</option>
                            </select>
                        </div>

                        <div className="f-item-v3">
                            <label className="filter-label"><GraduationCap size={16}/> Education & Income</label>
                            <select name="education" value={filters.education} onChange={handleFilterChange}>
                                <option value="">Any Education</option>
                                <option value="B.E / B.Tech">B.E / B.Tech</option><option value="M.B.A">M.B.A</option>
                            </select>
                            <select name="income" value={filters.income || ''} onChange={handleFilterChange}>
                                <option value="">Any Income</option>
                                <option value="0-3L">Up to 3 Lakh</option><option value="3-7L">3 - 7 Lakh</option><option value="7-15L">7 - 15 Lakh</option>
                            </select>
                        </div>

                        <div className="f-item-v3">
                            <label className="filter-label"><MapPin size={16}/> City / Location</label>
                            <input type="text" name="city" value={filters.city} onChange={handleFilterChange} placeholder="Enter City..." className="filter-input" />
                        </div>
                    </div>

                    <div className="premium-ad-sidebar card">
                        <h4>See 10x More Matches</h4>
                        <p>Upgrade to premium to see direct contact details and unlimited messages.</p>
                        <button className="btn btn-primary btn-sm btn-block">Upgrade Now</button>
                    </div>
                </aside>

                {/* 2. Main Match Center */}
                <main className="matches-content">
                    <div className="matches-content-header">
                        <div className="tm-breadcrumb">
                            <Link to="/dashboard"><Home size={14} /></Link>
                            <ChevronRight size={14} />
                            <span>Matches</span>
                            <ChevronRight size={14} />
                            <span className="current">All Matches</span>
                        </div>

                        <div className="header-text-v2">
                            <div className="title-row">
                                <h2>{activeTab === 'all' ? 'All Matches' : 'Matches'} <span>({matches.length})</span></h2>
                                <div className="sort-box-v2">
                                    <label>Sort by:</label>
                                    <select><option>Newest First</option><option>Relevance</option></select>
                                </div>
                            </div>
                            <p className="subtitle">Discover profiles that match your partner preferences</p>
                        </div>
                        
                        {/* TM Official Tab Bar */}
                        <div className="tm-results-tabs">
                            <div className={`tab-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Matches</div>
                            <div className={`tab-item ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>New Matches</div>
                            <div className={`tab-item ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => setActiveTab('daily')}>Daily Recommended</div>
                            <div className={`tab-item ${activeTab === 'shortlist' ? 'active' : ''}`} onClick={() => setActiveTab('shortlist')}>Shortlisted</div>
                        </div>

                        {/* Sub-filters row */}
                        <div className="tm-sub-filters">
                            <button className={`sf-btn ${subFilter === 'all_matches' ? 'active' : ''}`} onClick={() => setSubFilter('all_matches')}>All</button>
                            <button className={`sf-btn ${subFilter === 'with_photo' ? 'active' : ''}`} onClick={() => setSubFilter('with_photo')}><ImageIcon size={14} /> With Photo</button>
                            <button className={`sf-btn ${subFilter === 'new' ? 'active' : ''}`} onClick={() => setSubFilter('new')}><Zap size={14} /> New</button>
                            <button className={`sf-btn ${subFilter === 'premium' ? 'active' : ''}`} onClick={() => setSubFilter('premium')}><Trophy size={14} /> Premium</button>
                            <button className={`sf-btn ${subFilter === 'online' ? 'active' : ''}`} onClick={() => setSubFilter('online')}><Globe size={14} /> Online</button>
                        </div>
                    </div>

                    <div className="matches-vertical-list">
                        {loading ? (
                            <div className="loading-grid">
                                {[1,2,3,4].map(i => <div key={i} className="skeleton-card card"></div>)}
                            </div>
                        ) : matches.length > 0 ? (
                            matches
                            .filter(match => match.basicInfo?.gender !== authUser?.basicInfo?.gender)
                            .map(match => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={match._id} 
                                    className="wide-match-card-wrap"
                                >
                                    <MatchCard match={match} variant="tm-wide" onIgnore={handleIgnoreLocal} />
                                </motion.div>
                            ))
                        ) : (
                            <div className="no-matches-found card">
                                <Search size={48} color="#cbd5e1" />
                                <h3>No matching profiles found.</h3>
                                <p>Try relaxing your filters to see more results.</p>
                                <button className="btn btn-primary btn-sm" onClick={() => setFilters({
                                    ageMin: 18, ageMax: 45, religion: '', caste: '', maritalStatus: '', city: '', education: ''
                                })}>Clear Filters</button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Matches;
