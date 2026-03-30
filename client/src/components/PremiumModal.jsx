import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MessageSquare, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PremiumModal.css';

const PremiumModal = ({ isOpen, onClose, peerName, peerPhoto }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    const handleContinue = () => {
        onClose();
        navigate('/plans');
    };

    return (
        <AnimatePresence>
            <motion.div 
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div 
                    className="premium-modal-card"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="close-modal-btn" onClick={onClose}><X size={20} /></button>
                    
                    <div className="modal-avatars-wrap">
                        <div className="avatar-circle user-circle">
                            <User size={30} color="#94a3b8" />
                        </div>
                        <div className="avatar-circle peer-circle">
                            <img src={peerPhoto || 'https://via.placeholder.com/100'} alt={peerName} />
                        </div>
                        <div className="avatar-rays"></div>
                    </div>

                    <div className="modal-text-content">
                        <h2>Upgrade to Paid Membership</h2>
                        <p className="subtitle">Chat / Call +91 81XXXXXXXX to connect with <strong>{peerName}</strong></p>
                    </div>

                    <div className="premium-benefits-list">
                        <div className="benefit-item">
                            <div className="b-icon-wrap"><Phone size={18} fill="#64748b" color="white" /></div>
                            <div className="b-text">View contact numbers and call / WhatsApp matches</div>
                        </div>
                        <div className="benefit-item">
                            <div className="b-icon-wrap"><MessageSquare size={18} fill="#64748b" color="white" /></div>
                            <div className="b-text">Send personalised messages</div>
                        </div>
                        <div className="benefit-item">
                            <div className="b-icon-wrap"><Star size={18} fill="#64748b" color="white" /></div>
                            <div className="b-text">View and match horoscopes</div>
                        </div>
                    </div>

                    <button className="modal-continue-btn" onClick={handleContinue}>Continue</button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PremiumModal;
