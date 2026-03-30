import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import './ChatList.css';
import { 
    Search, Send, MessageSquare, MoreHorizontal, 
    Smile, Paperclip, ChevronLeft, Sparkles, User, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ChatList = () => {
    const { user } = useAuth();
    const { socket, onlineUsers } = useSocket();
    const navigate = useNavigate();
    
    const [chatList, setChatList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'chat' for mobile
    
    const chatEndRef = useRef(null);

    // Fetch active chats
    const fetchChatList = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const res = await axios.get('https://new-api-mm.onrender.com/api/users/chatlist', config);
            setChatList(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching chat list:', error);
            setLoading(false);
        }
    };

    // Fetch messages for selected chat
    const fetchMessages = async (peerId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const res = await axios.get(`https://new-api-mm.onrender.com/api/users/messages/${peerId}`, config);
            setMessages(res.data.data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        fetchChatList();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.peer._id);
        }
    }, [selectedChat]);

    // Socket listeners
    useEffect(() => {
        if (socket) {
            socket.on('message received', (msg) => {
                const senderId = msg.sender._id || msg.sender;
                if (selectedChat && senderId === selectedChat.peer._id) {
                    setMessages(prev => [...prev, msg]);
                }
                // Refresh chat list to update last message/order
                fetchChatList();
            });
            return () => socket.off('message received');
        }
    }, [socket, selectedChat]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const { data } = await axios.post('https://new-api-mm.onrender.com/api/users/message', {
                receiverId: selectedChat.peer._id,
                text: newMessage
            }, config);

            if (socket) {
                socket.emit('new message', {
                    ...data.data,
                    receiver: selectedChat.peer._id,
                    sender: user._id
                });
            }

            setMessages(prev => [...prev, data.data]);
            setNewMessage('');
            fetchChatList(); // Update sidebar preview
        } catch (error) { console.error(error); }
    };

    const filteredChats = chatList.filter(chat => 
        chat.peer.basicInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.peer.profileId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return null;

    return (
        <div className="chatlist-page">
            <Navbar />
            
            <div className={`container chat-wrapper-v10 ${viewMode === 'chat' ? 'm-view-chat' : 'm-view-list'}`}>
                <div className={`chat-container-main ${viewMode === 'chat' ? 'show-chat' : 'show-list'}`}>
                    {/* 1. Sidebar */}
                    <aside className="chat-sidebar">
                        <div className="chat-sidebar-header">
                            <h2>My Chats</h2>
                            <div className="chat-search">
                                <Search size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search matches..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="chat-list-scrollable">
                            {filteredChats.map((chat) => (
                                <div 
                                    key={chat.peer._id} 
                                    className={`chat-card ${selectedChat?.peer._id === chat.peer._id ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedChat(chat);
                                        setViewMode('chat');
                                    }}
                                >
                                    <div className="avatar-container">
                                        <img src={chat.peer.profilePhotos?.[0] || 'https://via.placeholder.com/54'} alt="Avatar" />
                                        {onlineUsers.includes(chat.peer._id) && <div className="online-dot"></div>}
                                    </div>
                                    <div className="chat-info">
                                        <div className="chat-info-top">
                                            <h4>{chat.peer.basicInfo.name}</h4>
                                            <span className="chat-time">
                                                {new Date(chat.lastMsg?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="chat-info-bottom">
                                            <p className="msg-preview">
                                                {chat.lastMsg?.sender === user._id ? 'You: ' : ''}{chat.lastMsg?.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* 2. Main Chat View */}
                    <main className="chat-window">
                        {selectedChat ? (
                            <div className="chat-view-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div className="chat-window-header">
                                    <button className="mobile-back-btn" onClick={() => setViewMode('list')}>
                                        <ChevronLeft size={24} />
                                    </button>
                                    <div className="header-user">
                                        <div 
                                            className="avatar-container" 
                                            style={{ width: 44, height: 44, cursor: 'pointer' }}
                                            onClick={() => navigate(`/profile/${selectedChat.peer._id}`)}
                                        >
                                            <img src={selectedChat.peer.profilePhotos?.[0] || 'https://via.placeholder.com/44'} alt="Avatar" />
                                        </div>
                                        <div className="header-user-info">
                                            <h3>{selectedChat.peer.basicInfo.name}</h3>
                                            <p>{onlineUsers.includes(selectedChat.peer._id) ? 'Online' : 'Recently active'}</p>
                                        </div>
                                    </div>
                                    <div className="header-chat-actions">
                                        <MoreHorizontal size={20} color="#94a3b8" cursor="pointer" />
                                    </div>
                                </div>
                                
                                <div className="chat-messages-area">
                                    {messages.map((m) => {
                                        const isMe = (m.sender._id || m.sender) === user._id;
                                        return (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={m._id} 
                                                className={`msg-wrap ${isMe ? 'me' : 'them'}`}
                                            >
                                                <div className="msg-box">
                                                    {m.content}
                                                </div>
                                                <span className="msg-ts">
                                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                    <div ref={chatEndRef} />
                                </div>
                                
                                <div className="chat-input-wrapper">
                                    <form className="chat-input-form" onSubmit={handleSend}>
                                        <Smile size={22} color="#94a3b8" cursor="pointer" />
                                        <input 
                                            type="text" 
                                            placeholder="Type message here..." 
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button className="btn-send" type="submit">
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="chat-placeholder">
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 5, -5, 0] 
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="placeholder-icon"
                                >
                                    <MessageSquare size={100} strokeWidth={0.5} />
                                </motion.div>
                                <h2>Your Messages</h2>
                                <p>Select a match to start a conversation or continue where you left off.</p>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.6 }}>
                                    <ShieldCheck size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>End-to-end encrypted</span>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
