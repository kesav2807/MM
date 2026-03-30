import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import './Inbox.css';
import { useNavigate } from 'react-router-dom';
import { 
    MessageSquare, Heart, CheckCircle, XCircle, 
    Search, Filter, Clock, ChevronRight, User, MoreVertical, Send, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const Inbox = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { socket, onlineUsers } = useSocket();
    const [activeTab, setActiveTab] = useState('received');
    const [subTab, setSubTab] = useState('pending');
    const [interests, setInterests] = useState([]);
    const [counts, setCounts] = useState({ received: 0, sent: 0, accepted: 0, pending: 0, declined: 0 });
    const [selectedInterest, setSelectedInterest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileView, setMobileView] = useState('list'); // 'list' or 'detail'
    
    // Chat State
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef(null);

    const currentPeer = selectedInterest ? (activeTab === 'received' ? selectedInterest.sender : selectedInterest.receiver) : null;
    const isOnline = currentPeer && onlineUsers.includes(currentPeer._id);

    useEffect(() => {
        if (socket) {
            socket.on('message received', (newMessageReceived) => {
                // Determine if this message belongs to the current open chat
                const senderId = newMessageReceived.sender._id || newMessageReceived.sender;
                if (selectedInterest && (senderId === currentPeer?._id)) {
                    setMessages((prev) => [...prev, newMessageReceived]);
                }
            });

            return () => socket.off('message received');
        }
    }, [socket, selectedInterest, currentPeer]);

    useEffect(() => {
        if (socket && currentPeer) {
            socket.emit('join chat', user._id); // We join our own room to receive
        }
    }, [socket, currentPeer, user]);

    const fetchInterests = async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            const endpoint = activeTab === 'received' ? 'received' : 'sent';
            const res = await axios.get(`https://new-api-mm.onrender.com/api/users/interests/${endpoint}`, config);
            const data = res.data.data;
            setInterests(data);
            
            // Calculate counts for subtabs
            const pending = data.filter(i => i.status === 'pending').length;
            const accepted = data.filter(i => i.status === 'accepted').length;
            const declined = data.filter(i => i.status === 'declined').length;
            setCounts(prev => ({ ...prev, [activeTab]: data.length, pending, accepted, declined }));

            if (data.length > 0) {
                const filtered = data.filter(i => i.status === subTab);
                if (filtered.length > 0) setSelectedInterest(filtered[0]);
                else setSelectedInterest(data[0]);
            }
        } catch (error) {
            console.error('Error fetching interests:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (peerId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const res = await axios.get(`https://new-api-mm.onrender.com/api/users/messages/${peerId}`, config);
            setMessages(res.data.data);
        } catch (error) { console.error(error); }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedInterest || !currentPeer) return;
        
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const { data } = await axios.post('https://new-api-mm.onrender.com/api/users/message', { receiverId: currentPeer._id, text: newMessage }, config);
            
            // Emit via socket
            if (socket) {
                socket.emit('new message', {
                    ...data.data,
                    receiver: currentPeer._id,
                    sender: user._id
                });
            }

            setMessages([...messages, data.data]);
            setNewMessage('');
        } catch (error) { console.error(error); }
    };

    const handleInterestResponse = async (status) => {
        if (!selectedInterest) return;
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put(`https://new-api-mm.onrender.com/api/users/interest/${selectedInterest._id}`, { status }, config);
            fetchInterests();
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        fetchInterests();
    }, [activeTab]);

    useEffect(() => {
        const filtered = interests.filter(item => item.status === subTab);
        if (filtered.length > 0) {
            setSelectedInterest(filtered[0]);
        } else {
            setSelectedInterest(null);
        }
    }, [subTab, interests]);

    useEffect(() => {
        if (showChat && selectedInterest && currentPeer) {
            fetchMessages(currentPeer._id);
        }
    }, [showChat, selectedInterest, currentPeer]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="inbox-page">
            <Navbar />
            
            <div className="inbox-container container">
                <div className="inbox-header-ultra card">
                    <div className="main-tabs">
                        <div className={`tab ${activeTab === 'received' ? 'active' : ''}`} onClick={() => setActiveTab('received')}>
                            <Heart size={18} /> Interests Received
                        </div>
                        <div className={`tab ${activeTab === 'sent' ? 'active' : ''}`} onClick={() => setActiveTab('sent')}>
                            <Send size={18} /> Interests Sent
                        </div>
                    </div>
                </div>

                <div className="sub-tabs-container">
                    <div className={`sub-tab ${subTab === 'pending' ? 'active' : ''}`} onClick={() => setSubTab('pending')}>
                        Pending <span>({counts.pending})</span>
                    </div>
                    <div className={`sub-tab ${subTab === 'accepted' ? 'active' : ''}`} onClick={() => setSubTab('accepted')}>
                        Accepted <span>({counts.accepted})</span>
                    </div>
                    <div className={`sub-tab ${subTab === 'declined' ? 'active' : ''}`} onClick={() => setSubTab('declined')}>
                        Declined <span>({counts.declined})</span>
                    </div>
                </div>

                <div className={`inbox-layout ${mobileView === 'detail' ? 'show-detail' : 'show-list'}`}>
                    {/* List Pane */}
                    <aside className="inbox-list card">
                        <div className="list-search">
                            <Search size={16} />
                            <input type="text" placeholder="Search by name or ID" />
                        </div>
                        <div className="list-items">
                            {interests
                                .filter(item => item.status === subTab)
                                .map(item => {
                                const peer = activeTab === 'received' ? item.sender : item.receiver;
                                const peerIsOnline = onlineUsers.includes(peer?._id);
                                return (
                                    <div 
                                        key={item._id} 
                                        className={`list-card ${selectedInterest?._id === item._id ? 'selected' : ''}`} 
                                        onClick={() => {
                                            setSelectedInterest(item); 
                                            setShowChat(false);
                                            setMobileView('detail');
                                        }}
                                    >
                                        <div className="avatar-med">
                                            <img src={peer?.profilePhotos?.[0] || 'https://via.placeholder.com/50'} alt="Avatar" />
                                            {peerIsOnline && <div className="online-indicator"></div>}
                                        </div>
                                        <div className="item-content">
                                            <div className="item-header">
                                                <h4>{peer?.basicInfo?.name}</h4>
                                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="item-status">
                                                ID: {peer?.profileId}
                                                {peerIsOnline && <span className="online-status-text"> • Online</span>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {interests.filter(item => item.status === subTab).length === 0 && (
                                <div className="no-items-placeholder">
                                    <Clock size={48} strokeWidth={1} />
                                    <p>No {subTab} interests found.</p>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Detail/Chat Pane */}
                    <main className="inbox-detail card">
                        {selectedInterest ? (
                            <div className="detail-wrapper">
                                <div className="detail-header">
                                    <button className="mobile-only back-btn" onClick={() => setMobileView('list')}>
                                        <X size={20} />
                                    </button>
                                    <div className="peer-summary">
                                        <div className="avatar-large">
                                            <img src={currentPeer?.profilePhotos?.[0] || 'https://via.placeholder.com/100'} alt="Match" />
                                            {isOnline && <div className="online-indicator-lg"></div>}
                                        </div>
                                        <div className="peer-text">
                                            <h3>{currentPeer?.basicInfo?.name} {isOnline && <span className="online-text">(Online)</span>}</h3>
                                            <p>{currentPeer?.profileId}</p>
                                        </div>
                                    </div>
                                    <div className="header-actions">
                                        {selectedInterest.status === 'accepted' && (
                                            <button className={`btn-chat-toggle ${showChat ? 'active' : ''}`} onClick={() => setShowChat(!showChat)}>
                                                {showChat ? <User size={18}/> : <MessageSquare size={18}/>}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="detail-body-scrollable">
                                    {showChat ? (
                                        <div className="chat-interface">
                                            <div className="message-history">
                                                {messages.map(m => (
                                                    <div key={m._id} className={`msg-bubble ${m.sender === user?._id || m.sender?._id === user?._id ? 'me' : 'them'}`}>
                                                        {m.content}
                                                    </div>
                                                ))}
                                                <div ref={chatEndRef} />
                                            </div>
                                            <form onSubmit={handleSendMessage} className="chat-input-area">
                                                <input value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} placeholder="Type a message..." />
                                                <button type="submit"><Send size={18} /></button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="detail-info-view">
                                            <div className="info-grid">
                                                <div className="info-item"><label>Age</label><span>{currentPeer?.basicInfo?.age} yrs</span></div>
                                                <div className="info-item"><label>Occupation</label><span>{currentPeer?.personalDetails?.occupation}</span></div>
                                                <div className="info-item"><label>Location</label><span>{currentPeer?.contactInfo?.location?.city}</span></div>
                                            </div>
                                            <div className="message-text card-outline">
                                                <h4>Initial Interest:</h4>
                                                <p>{selectedInterest.message || "I'm interested in your profile."}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="detail-footer">
                                    {activeTab === 'received' && selectedInterest.status === 'pending' ? (
                                        <div className="action-row">
                                            <button className="btn btn-primary" onClick={() => handleInterestResponse('accepted')}><CheckCircle size={18}/> Accept</button>
                                            <button className="btn btn-outline" onClick={() => handleInterestResponse('declined')}><XCircle size={18}/> Decline</button>
                                        </div>
                                    ) : (
                                        <div className="action-row">
                                            {selectedInterest.status === 'accepted' ? (
                                                <button className="btn btn-primary" onClick={() => setShowChat(true)}><MessageSquare size={18}/> Send Message</button>
                                            ) : (
                                                <div className="status-badge">{selectedInterest.status.toUpperCase()}</div>
                                            )}
                                            <button 
                                                className="btn btn-outline" 
                                                onClick={() => {
                                                    const peerId = currentPeer?._id || currentPeer?.id;
                                                    if (peerId) navigate(`/profile/${peerId}`);
                                                }}
                                            >
                                                View Full Profile
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="detail-placeholder">Select someone to start talking.</div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Inbox;
