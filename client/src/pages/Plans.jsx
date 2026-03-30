import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Check, Shield, Zap, Award, Star, Info, Crown, ArrowRight, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './Plans.css';

const Plans = () => {
    const navigate = useNavigate();

    const handleSelectPlan = (tier) => {
        alert("Selecting plan: " + tier.name);
        console.log("Navigating to payment for:", tier.name);
        navigate('/payment', { state: { tier } });
    };

    const tiers = [
        {
            id: 'gold',
            name: 'Gold',
            price: 2450,
            displayPrice: '₹2,450',
            duration: '3 Months',
            benefits: ['View 25 Contact Numbers', 'Send Unlimited Messages', 'Priority Listing', 'Standard Profile View', 'Basic Search Filters'],
            icon: <Award size={32} color="#b45309" />,
            popular: false,
            color: '#b45309',
            bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
        },
        {
            id: 'diamond',
            name: 'Diamond',
            price: 4900,
            displayPrice: '₹4,900',
            duration: '6 Months',
            benefits: ['View 50 Contact Numbers', 'Send Unlimited Messages', 'Profile Highlighter', 'Personal Relationship Manager', 'Enhanced Privacy Settings', 'Social Media Integration'],
            icon: <Crown size={32} color="#ea580c" />,
            popular: true,
            color: '#ea580c',
            bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)'
        },
        {
            id: 'platinum',
            name: 'Platinum',
            price: 8500,
            displayPrice: '₹8,500',
            duration: '12 Months',
            benefits: ['View 100 Contact Numbers', 'Send Unlimited Messages', 'Top Search Result', 'VIP Support', 'Featured Profile Listing', 'Handpicked Matches', 'Relationship Advisor'],
            icon: <Star size={32} color="#1e293b" />,
            popular: false,
            color: '#1e293b',
            bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
        }
    ];

    return (
        <div className="plans-page-v10">
            <Navbar />
            
            <div className="plans-hero-section">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="plans-hero-container"
                >
                    <div className="hero-badge">
                        <Star size={14} fill="currentColor" /> Premium Memberships
                    </div>
                    <h1>Upgrade to Find Your Soulmate</h1>
                    <p>Verified profiles, secure communication, and thousands of success stories. Choose the plan that fits your journey.</p>
                </motion.div>
            </div>

            <div className="container plans-content-wrapper">
                <div className="plans-grid-v10">
                    {tiers.map((tier, idx) => (
                        <motion.div 
                            key={idx} 
                            className={`plan-card-v10 ${tier.popular ? 'popular' : ''}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        >
                            {tier.popular && <div className="popular-ribbon">Most Popular</div>}
                            
                            <div className="card-header-v10" style={{ background: tier.bg }}>
                                <div className="plan-icon-v10">{tier.icon}</div>
                                <h3 className="plan-name-v10" style={{ color: tier.color }}>{tier.name}</h3>
                                <div className="plan-price-block">
                                    <span className="price-val">{tier.displayPrice}</span>
                                    <span className="price-dur">/ {tier.duration}</span>
                                </div>
                            </div>

                            <div className="card-body-v10">
                                <ul className="benefits-v10">
                                    {tier.benefits.map((b, i) => (
                                        <li key={i}>
                                            <div className="check-circle"><Check size={12} strokeWidth={3} /></div>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                                
                                <Link 
                                    to="/payment" 
                                    state={{ 
                                        tier: {
                                            id: tier.id,
                                            name: tier.name,
                                            price: tier.price,
                                            displayPrice: tier.displayPrice,
                                            duration: tier.duration,
                                            benefits: tier.benefits
                                        }
                                    }}
                                    className="select-plan-btn-v10" 
                                    style={{ '--accent': tier.color, textDecoration: 'none' }}
                                >
                                    Select This Plan <ArrowRight size={18} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="plans-trust-footer">
                    <div className="trust-item"><Shield size={20} /> 100% Verified Profiles</div>
                    <div className="trust-item"><Lock size={20} /> Secure Payments</div>
                    <div className="trust-item"><Star size={20} /> 4.8/5 Rating from Members</div>
                </div>
            </div>
        </div>
    );
};

export default Plans;
