import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/adminAPI';
import { 
    Users, ShieldCheck, TrendingUp, Search, 
    Eye, CheckCircle, XCircle, X, Menu,
    BarChart3, LogOut, Activity, Zap, Mail, Phone, MapPin, Calendar, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import './Admin.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            navigate('/admin/login');
            return;
        }

        // Sync tab with URL
        const pathParts = location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1].toLowerCase();

        if (location.pathname === '/admin/dashboard' || location.pathname === '/admin/dashboard/') {
            navigate('/admin/dashboard/Overview');
            return;
        }
        
        const validTabs = ['stats', 'users', 'verifications', 'reports', 'overview'];
        if (validTabs.includes(lastPart)) {
            setActiveTab(lastPart === 'overview' ? 'stats' : lastPart);
        }

        fetchAdminData();
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const path = tab === 'stats' ? 'Overview' : tab.charAt(0).toUpperCase() + tab.slice(1);
        navigate(`/admin/dashboard/${path}`);
        setIsSidebarOpen(false); // Close sidebar on mobile after selection
    };

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getUsers()
            ]);
            setStats(statsRes.data.data);
            setUsers(usersRes.data.data);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                console.warn('Admin Access Failed: Insufficient privileges or invalid session');
                localStorage.removeItem('token');
                localStorage.removeItem('isAdmin');
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId) => {
        try {
            await adminAPI.verifyUser(userId);
            setUsers(users.map(u => u._id === userId ? { ...u, status: { ...u.status, isVerified: !u.status.isVerified } } : u));
        } catch (err) { console.error(err); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        navigate('/admin/login');
    };

    const filteredUsers = users.filter(user => 
        user.basicInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profileId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#4f46e5', fontWeight: 'bold' }}>Initializing Admin Control Panel...</div>;

    if (!stats) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Preparing system metrics...</div>;

    return (
        <div className="admin-dashboard">
            {/* Mobile Header */}
            <header className="admin-mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', background: '#4f46e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Zap size={16} fill="white" />
                    </div>
                    <span style={{ fontWeight: 'bold' }}>MM Admin</span>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '8px' }}
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        style={{ 
                            position: 'fixed', 
                            inset: 0, 
                            background: 'rgba(15, 23, 42, 0.3)', 
                            backdropFilter: 'blur(4px)', 
                            zIndex: 90 
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`admin-sidebar shadow-sm ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ padding: '2.5rem 2rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', background: '#4f46e5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Zap size={20} fill="white" />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>MM Admin</span>
                    </div>
                </div>

                <nav style={{ flex: '1', padding: '0 1rem' }}>
                    <TabItem active={activeTab === 'stats'} icon={<BarChart3 size={20}/>} label="Overview" onClick={() => handleTabChange('stats')} />
                    <TabItem active={activeTab === 'users'} icon={<Users size={20}/>} label="Manage Profiles" onClick={() => handleTabChange('users')} />
                    <TabItem active={activeTab === 'verifications'} icon={<ShieldCheck size={20}/>} label="Pending Reviews" onClick={() => handleTabChange('verifications')} />
                    <TabItem active={activeTab === 'reports'} icon={<TrendingUp size={20}/>} label="Traffic Analysis" onClick={() => handleTabChange('reports')} />
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={handleLogout} className="sidebar-link" style={{ color: '#ef4444', width: '100%' }}>
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-content-header">
                    <div className="admin-header-title">
                        <h1>Admin <span style={{ color: '#4f46e5' }}>Command Center</span></h1>
                        <p>Status: Operational • {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="admin-header-actions">
                        <div className="admin-search-wrapper">
                            <Search className="search-icon" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search members..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                   </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'stats' && (
                        <motion.div 
                            key="stats"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="stat-grid">
                                <StatCard label="Total Users" value={stats.totalUsers} icon={<Users />} trend="+12% this week" color="#4f46e5" />
                                <StatCard label="Premium Members" value={stats.premiumUsers} icon={<TrendingUp />} trend="+5.2%" color="#f59e0b" />
                                <StatCard label="Verified Accounts" value={stats.verifiedUsers} icon={<ShieldCheck />} trend="+22%" color="#10b981" />
                                <StatCard label="Messages Processed" value={stats.messagesSent} icon={<Activity />} trend="Live Tracking" color="#3b82f6" />
                            </div>

                            <div className="admin-stats-visuals">
                                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '2rem', padding: '2.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>User Registrations</h3>
                                    </div>
                                    <div style={{ height: '300px', background: '#f8fafc', borderRadius: '1.5rem', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>
                                        Registration Analytics Chart (Visual Placeholder)
                                    </div>
                                </div>
                                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '2rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2.5rem' }}>Gender Mix</h3>
                                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: '800' }}>
                                                <span style={{ color: '#64748b' }}>Male Statistics</span>
                                                <span style={{ color: '#4f46e5' }}>{Math.round((stats.genderDistribution.male / stats.totalUsers) * 100)}%</span>
                                            </div>
                                            <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', background: '#4f46e5', width: `${(stats.genderDistribution.male / stats.totalUsers) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: '800' }}>
                                                <span style={{ color: '#64748b' }}>Female Statistics</span>
                                                <span style={{ color: '#ec4899' }}>{Math.round((stats.genderDistribution.female / stats.totalUsers) * 100)}%</span>
                                            </div>
                                            <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', background: '#ec4899', width: `${(stats.genderDistribution.female / stats.totalUsers) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 'auto', paddingTop: '2rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                                        Metrics updated in real-time
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div 
                            key="users"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="admin-table-container"
                        >
                            <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Member Database</h3>
                                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#4f46e5', background: '#eef2ff', padding: '0.5rem 1rem', borderRadius: '0.75rem' }}>
                                    {users.length} Total Users
                                </div>
                            </div>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>User Details</th>
                                        <th>Status</th>
                                        <th>Role / Plan</th>
                                        <th>Joined On</th>
                                        <th style={{ textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user._id}>
                                            <td data-label="User Info">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                    <div 
                                                        onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                                        style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '14px', overflow: 'hidden', background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                                                    >
                                                        {user.profilePhotos?.[0] ? <img src={user.profilePhotos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users size={20} style={{ margin: '14px', color: '#cbd5e1' }}/>}
                                                    </div>
                                                    <div 
                                                        onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.9rem' }}>{user.basicInfo.name}</div>
                                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>{user.profileId} • {user.basicInfo.gender}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td data-label="Status">
                                                {user.status.isVerified ? 
                                                    <span className="badge-verified">Verified</span> : 
                                                    <span className="badge-pending">Pending</span>
                                                }
                                            </td>
                                            <td data-label="Plan">
                                                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: user.status.isPremium ? '#4f46e5' : '#64748b' }}>
                                                    {user.status.isPremium ? 'Diamond' : 'Basic'}
                                                </span>
                                            </td>
                                            <td data-label="Joined">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td data-label="Actions">
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                                                    <button onClick={() => handleVerify(user._id)} className="action-btn" title={user.status.isVerified ? "Revoke Verification" : "Approve Profile"}>
                                                        {user.status.isVerified ? <XCircle size={18} color="#ef4444" /> : <CheckCircle size={18} color="#10b981" />}
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setIsModalOpen(true);
                                                        }} 
                                                        className="action-btn" 
                                                        title="View Detail"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Profile Detail Modal */}
                <AnimatePresence>
                    {isModalOpen && selectedUser && (
                        <ProfileModal 
                            user={selectedUser} 
                            onClose={() => {
                                setIsModalOpen(false);
                                setSelectedUser(null);
                            }} 
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const ProfileModal = ({ user, onClose }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="admin-modal-overlay"
        onClick={onClose}
    >
        <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="admin-modal-content"
            onClick={e => e.stopPropagation()}
        >
            <div className="admin-modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '20px', overflow: 'hidden', border: '3px solid #f1f5f9' }}>
                        {user.profilePhotos?.[0] ? <img src={user.profilePhotos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users size={40} style={{ margin: '20px', color: '#cbd5e1' }}/>}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>{user.basicInfo.name}</h2>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <span className={user.status.isVerified ? 'badge-verified' : 'badge-pending'}>
                                {user.status.isVerified ? 'Verified' : 'Pending'}
                            </span>
                            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#4f46e5' }}>{user.profileId}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="admin-close-btn">
                    <X size={24} />
                </button>
            </div>

            <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                    {/* Left Column: Basic & Personal */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <InfoSection title="Basic Information" icon={<Users size={18} />}>
                            <InfoItem label="Profile For" value={user.basicInfo.profileFor} />
                            <InfoItem label="Gender" value={user.basicInfo.gender} />
                            <InfoItem label="Age" value={new Date().getFullYear() - new Date(user.basicInfo.dob).getFullYear() + ' Years'} />
                            <InfoItem label="Religion" value={user.basicInfo.religion} />
                            <InfoItem label="Mother Tongue" value={user.basicInfo.motherTongue} />
                        </InfoSection>

                        <InfoSection title="Professional Details" icon={<Zap size={18} />}>
                            <InfoItem label="Education" value={user.professionalDetails?.education || 'Not Provided'} />
                            <InfoItem label="Occupation" value={user.professionalDetails?.occupation || 'Not Provided'} />
                            <InfoItem label="Income" value={user.professionalDetails?.annualIncome || 'Not Provided'} />
                        </InfoSection>
                    </div>

                    {/* Right Column: Contact & Lifestyle */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <InfoSection title="Contact Access" icon={<Phone size={18} />}>
                            <InfoItem label="Email ID" value={user.contactInfo.email} icon={<Mail size={14}/>} />
                            <InfoItem label="Mobile" value={user.contactInfo.mobile} icon={<Phone size={14}/>} />
                            <InfoItem label="Location" value={`${user.contactInfo.location.city}, ${user.contactInfo.location.country}`} icon={<MapPin size={14}/>} />
                        </InfoSection>

                        <InfoSection title="Personal Background" icon={<Heart size={18} />}>
                            <InfoItem label="Weight" value={user.personalDetails?.weight + ' kg'} />
                            <InfoItem label="Height" value={user.personalDetails?.height + ' cm'} />
                            <InfoItem label="Diet" value={user.personalDetails?.diet} />
                            <InfoItem label="Social Status" value={user.personalDetails?.familyStatus} />
                        </InfoSection>
                    </div>
                </div>
            </div>

            <div className="admin-modal-footer">
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>Registration Date: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={onClose} className="admin-btn-primary">Done Viewing</button>
            </div>
        </motion.div>
    </motion.div>
);

const InfoSection = ({ title, icon, children }) => (
    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: '#4f46e5' }}>
            {icon}
            <h4 style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b' }}>{title}</h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {children}
        </div>
    </div>
);

const InfoItem = ({ label, value, icon }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#1e293b', fontSize: '0.875rem' }}>
            {icon}
            <span>{value}</span>
        </div>
    </div>
);

const StatCard = ({ label, value, icon, trend, color }) => (
    <div className="stat-card">
        <div className="stat-header">
            <div className="stat-icon-bg" style={{ background: `${color}15`, color: color }}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: color }}>{trend}</span>
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
    </div>
);

const TabItem = ({ active, icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className={`sidebar-link ${active ? 'active' : ''}`}
    >
        {active ? React.cloneElement(icon, { color: '#4f46e5' }) : icon}
        <span>{label}</span>
    </button>
);

export default AdminDashboard;
