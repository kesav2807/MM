import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import './Navbar.css';
import { User, LogIn, LayoutDashboard, Heart, MessageSquare, Search, LogOut, Bell, X, Clock, UserCheck, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
      try {
          const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
          const res = await axios.get('https://new-api-mm.onrender.com/api/users/notifications', config);
          setNotifications(res.data.data);
      } catch (error) { console.error(error); }
  };

  const handleToggleNotifications = async () => {
      if (!showNotifications) {
          fetchNotifications();
      } else {
          // Marking as read when closing
          try {
              const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
              await axios.put('https://new-api-mm.onrender.com/api/users/notifications/read', {}, config);
              // Update local state isRead
              setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          } catch (error) { console.error(error); }
      }
      setShowNotifications(!showNotifications);
  };

  useEffect(() => {
      if (user) fetchNotifications();
  }, [user]);

  useEffect(() => {
      if (socket) {
          const handleNewNotif = () => {
              fetchNotifications();
          };
          socket.on('notification', handleNewNotif);
          socket.on('message received', handleNewNotif);
          return () => {
              socket.off('notification', handleNewNotif);
              socket.off('message received', handleNewNotif);
          };
      }
  }, [socket]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-wrapper">
      <div className="navbar container">
        <Link to="/" className="logo">
          <span className="logo-main">Madurai</span>
          <span className="logo-sub">MATRIMONY</span>
        </Link>
        
        <div className="nav-links">
          {user ? (
            <>
              {/* Desktop Tabs (Main Nav) */}
              <div className="desktop-tabs">
                  <Link to="/dashboard" className={`tab-item ${isActive('/dashboard') ? 'active' : ''}`}>
                      <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <Link to="/matches" className={`tab-item ${isActive('/matches') ? 'active' : ''}`}>
                      <Search size={18} /> Matches
                  </Link>
                  <Link to="/inbox" className={`tab-item ${isActive('/inbox') ? 'active' : ''}`}>
                      <Heart size={18} /> Interests
                  </Link>
                  <Link to="/chatlist" className={`tab-item ${isActive('/chatlist') ? 'active' : ''}`}>
                      <MessageSquare size={18} /> Messages
                  </Link>
              </div>

              {/* Mobile Bottom Nav */}
              <div className="mobile-bottom-nav">
                  <Link to="/dashboard" className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                      <LayoutDashboard size={20} />
                      <span>Home</span>
                  </Link>
                  <Link to="/matches" className={`mobile-nav-item ${isActive('/matches') ? 'active' : ''}`}>
                      <Search size={20} />
                      <span>Matches</span>
                  </Link>
                  <Link to="/inbox" className={`mobile-nav-item ${isActive('/inbox') ? 'active' : ''}`}>
                      <div className="nav-icon-wrap">
                          <Heart size={20} />
                          {unreadCount > 0 && notifications.some(n => n.type === 'interest' && !n.isRead) && <span className="m-notif-dot"></span>}
                      </div>
                      <span>Interests</span>
                  </Link>
                  <Link to="/chatlist" className={`mobile-nav-item ${isActive('/chatlist') ? 'active' : ''}`}>
                      <div className="nav-icon-wrap">
                          <MessageSquare size={20} />
                          {unreadCount > 0 && notifications.some(n => n.type === 'message' && !n.isRead) && <span className="m-notif-dot"></span>}
                      </div>
                      <span>Inbox</span>
                  </Link>
                  <Link to={`/profile/${user?._id}`} className={`mobile-nav-item ${isActive(`/profile/${user?._id}`) ? 'active' : ''}`}>
                      <User size={20} />
                      <span>Profile</span>
                  </Link>
              </div>

              <div className="user-nav">
                <div className="notification-bell desktop-only" onClick={handleToggleNotifications}>
                    <Bell size={18} />
                    {unreadCount > 0 && <span className="unread-dot"></span>}
                </div>

                <AnimatePresence>
                    {showNotifications && (
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 15 }}
                            className="notification-dropdown card shadow"
                        >
                            <div className="notif-header">
                                <h3>Notifications</h3>
                                <X size={16} onClick={() => setShowNotifications(false)} cursor="pointer" />
                            </div>
                            <div className="notif-body">
                                {notifications.map(n => (
                                    <div key={n._id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
                                        <div className="notif-icon-circle">
                                            {n.type === 'interest' ? <Heart size={14} color="#ea580c" /> : 
                                             n.type === 'message' ? <MessageSquare size={14} color="#0ea5e9" /> : 
                                             n.type === 'accept' ? <UserCheck size={14} color="#22c55e" /> :
                                             <User size={14} color="#64748b" />}
                                        </div>
                                        <div className="notif-content">
                                            <p><strong>{n.sender?.basicInfo?.name}</strong> {
                                                n.type === 'interest' ? 'sent you an interest' :
                                                n.type === 'message' ? 'sent you a message' :
                                                n.type === 'accept' ? 'accepted your interest' :
                                                'viewed your profile'
                                            }</p>
                                            <span><Clock size={10} /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                ))}
                                {notifications.length === 0 && (
                                    <div className="notif-empty">No new notifications</div>
                                )}
                            </div>
                            <div className="notif-footer">
                                <Link to="/inbox" onClick={() => setShowNotifications(false)}>See all activity</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Link to={`/profile/${user?._id}`} className="profile-link desktop-only">
                   <img src={user?.profilePhotos?.[0] || 'https://via.placeholder.com/35'} alt="Me" className="nav-avatar" />
                   <span>{user?.basicInfo?.name?.split(' ')?.[0] || 'Member'}</span>
                </Link>
                <button onClick={logout} className="logout-btn">
                   <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/search" className="nav-item">Search</Link>
              <Link to="/help" className="nav-item">Help</Link>
              <Link to="/login" className="btn btn-primary login-btn">
                <LogIn size={18} /> Login
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Optional Sub-nav for mobile or extra clarity if needed, 
          but TamilMatrimony usually has them in the main header like above */}
    </nav>
  );
};

export default Navbar;
