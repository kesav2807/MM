import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { 
    Search, HelpCircle, ChevronRight, MessageCircle, 
    ShieldCheck, Star, UserPlus, CreditCard, Mail, 
    Phone, MapPin, ExternalLink, ChevronDown, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Help.css';

const HelpPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFaq, setActiveFaq] = useState(null);

    const categories = [
        { id: 'getting-started', title: 'Getting Started', icon: <UserPlus size={24} />, description: 'Learn how to create and set up your MM profile.' },
        { id: 'verification', title: 'Profile Verification', icon: <ShieldCheck size={24} />, description: 'Everything about getting the blue verification badge.' },
        { id: 'premium', title: 'Premium Plans', icon: <Star size={24} />, description: 'Understand benefits of Diamond and Gold memberships.' },
        { id: 'privacy', title: 'Privacy & Safety', icon: <HelpCircle size={24} />, description: 'How we protect your data and stay safe.' }
    ];

    const faqs = [
        {
            question: "How do I verify my profile?",
            answer: "Go to your Dashboard and click on 'Verify your profile'. You will need to upload a valid ID proof (Aadhaar or PAN) and a live selfie. Our team will review it within 24 hours."
        },
        {
            question: "Is Madurai Matrimony free to use?",
            answer: "Registration is 100% free! You can browse matches and receive interests. However, to view contact numbers or send direct messages, you'll need to upgrade to a Premium Plan."
        },
        {
            question: "Can I hide my profile photo from others?",
            answer: "Yes! Go to Settings > Privacy and set your photo visibility to 'Only Verified Members' or 'Only Expressed Interest'."
        },
        {
            question: "How do I delete my account?",
            answer: "We're sorry to see you go. You can deactivate or permanently delete your account in Settings > Account Management."
        }
    ];

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="help-page">
            <Navbar />
            
            {/* Header / Hero Section */}
            <div className="help-hero">
                <div className="container">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-content"
                    >
                        <h1>How can we <span>help you</span> today?</h1>
                        <p>Find answers to common questions or reach out to our dedicated support team.</p>
                        
                        <div className="help-search-box">
                            <Search size={22} className="s-icon" />
                            <input 
                                type="text" 
                                placeholder="Search for questions (e.g. verification, refund)..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container help-body">
                {/* Category Grid */}
                <section className="help-section">
                    <h2 className="section-title">Support Categories</h2>
                    <div className="category-grid">
                        {categories.map((cat, idx) => (
                            <motion.div 
                                whileHover={{ y: -8 }}
                                key={cat.id} 
                                className="cat-card card"
                            >
                                <div className="cat-icon-bg">{cat.icon}</div>
                                <h3>{cat.title}</h3>
                                <p>{cat.description}</p>
                                <button className="cat-link">Learn more <ChevronRight size={14} /></button>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="help-section">
                    <div className="section-header-row">
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <span className="faq-count">{filteredFaqs.length} entries</span>
                    </div>

                    <div className="faq-list">
                        {filteredFaqs.map((faq, idx) => (
                            <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                                <button className="faq-question" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                                    <span>{faq.question}</span>
                                    <ChevronDown size={20} className="q-chevron" />
                                </button>
                                <AnimatePresence>
                                    {activeFaq === idx && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="faq-answer"
                                        >
                                            <p>{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Banner */}
                <section className="help-section">
                    <div className="contact-banner card glass">
                        <div className="banner-info">
                            <h2>Still need assistance?</h2>
                            <p>Our expert relationship managers are available 24/7 to help you find your perfect match.</p>
                            
                            <div className="contact-meta-grid">
                                <div className="c-item">
                                    <Mail size={18} />
                                    <span>support@maduraimatrimony.com</span>
                                </div>
                                <div className="c-item">
                                    <Phone size={18} />
                                    <span>+91 98765 43210</span>
                                </div>
                                <div className="c-item">
                                    <MapPin size={18} />
                                    <span>Madurai Bypass Rd, Madurai - 625001</span>
                                </div>
                            </div>
                        </div>
                        <div className="banner-actions">
                            <button className="chat-btn btn btn-primary">
                                <MessageCircle size={20} /> Start Live Chat
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            
            {/* Quick Links Footer Area */}
            <div className="help-footer-links">
                <div className="container">
                    <div className="links-grid">
                        <div className="link-col">
                            <h4>Legal</h4>
                            <a href="#">Terms & Conditions</a>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Security Tips</a>
                        </div>
                        <div className="link-col">
                            <h4>Resources</h4>
                            <a href="#">Success Stories</a>
                            <a href="#">MM Matrimony Blog</a>
                            <a href="#">Community Guidelines</a>
                        </div>
                        <div className="link-col">
                            <h4>MM Network</h4>
                            <a href="#">Tamil Matrimony</a>
                            <a href="#">Global Search</a>
                            <a href="#">App Download <ExternalLink size={12}/></a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 Madurai Matrimony. Madurai's No. 1 Trusted Service.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
