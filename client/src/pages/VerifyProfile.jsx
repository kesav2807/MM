import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { ShieldCheck, Phone, FileText, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userAPI } from '../services/api';
import './VerifyProfile.css';

const VerifyProfile = () => {
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleVerify = async (type) => {
        setVerifying(true);
        // Simulate verification process
        setTimeout(async () => {
            try {
                // In a real app, this would hit a verification endpoint
                // For now, we update the user status
                await userAPI.updateProfile({ 'status.isVerified': true });
                setSuccess(true);
            } catch (err) {
                console.error(err);
            } finally {
                setVerifying(false);
            }
        }, 1500);
    };

    return (
        <div className="verify-page">
            <Navbar />
            <div className="container py-5">
                <header className="verify-header">
                    <button className="back-link" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div className="hero-badge">
                        <ShieldCheck size={40} color="#ea580c" />
                    </div>
                    <h1>Get the Verification Badge</h1>
                    <p>Verified profiles get 3x more interests and build better trust with potential matches.</p>
                </header>

                <div className="verify-grid">
                    {/* Phone Verification */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="verify-card shadow-sm"
                    >
                        <div className="card-icon phone"><Phone size={24} /></div>
                        <h3>Mobile Verification</h3>
                        <p>Verify your mobile number to ensure you are a genuine user.</p>
                        <button 
                            className={`btn-verify ${success ? 'completed' : ''}`}
                            onClick={() => !success && handleVerify('phone')}
                            disabled={verifying || success}
                        >
                            {success ? <><CheckCircle size={18} /> Verified</> : verifying ? 'Verifying...' : 'Verify Now'}
                        </button>
                    </motion.div>

                    {/* ID Verification */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="verify-card shadow-sm"
                    >
                        <div className="card-icon id"><FileText size={24} /></div>
                        <h3>ID Proof Verification</h3>
                        <p>Upload a government ID (Aadhar/PAN) for official verification.</p>
                        <button 
                            className="btn-verify secondary"
                            onClick={() => handleVerify('id')}
                            disabled={verifying || success}
                        >
                            {verifying ? 'Uploading...' : 'Upload ID Proof'}
                        </button>
                    </motion.div>

                    {/* Trust Summary */}
                    <div className="trust-info-card card bg-dark text-white p-4">
                        <h4>Why Verify?</h4>
                        <div className="trust-list">
                            <div className="trust-item">
                                <CheckCircle size={16} color="#22c55e" />
                                <span>Official "Verified" badge on your profile</span>
                            </div>
                            <div className="trust-item">
                                <CheckCircle size={16} color="#22c55e" />
                                <span>Higher ranking in search results</span>
                            </div>
                            <div className="trust-item">
                                <CheckCircle size={16} color="#22c55e" />
                                <span>Direct contact privilege for premium members</span>
                            </div>
                        </div>
                        <div className="warning-note">
                            <AlertTriangle size={14} color="#fbbf24" />
                            <span>Verification documents are encrypted and never shown to other users.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyProfile;
