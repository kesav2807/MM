import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { ShieldCheck, ArrowLeft, CreditCard, Lock, CheckCircle } from 'lucide-react';
import './Payment.css';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const tier = location.state?.tier;

    useEffect(() => {
        if (!tier) {
            navigate('/plans');
        }
        
        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [tier, navigate]);

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            
            // 1. Create Order on Backend
            const orderRes = await axios.post('https://new-api-mm.onrender.com/api/payment/create-order', {
                amount: tier.price,
                planId: tier.id
            }, config);

            const order = orderRes.data.order;
            const keyId = orderRes.data.keyId;

            // 2. Open Razorpay Modal
            const options = {
                key: keyId, 
                amount: order.amount,
                currency: order.currency,
                name: "Madurai Matrimony",
                description: `Upgrade to ${tier.name} Plan`,
                image: "https://cdn-icons-png.flaticon.com/512/2589/2589175.png", // Stable public heart icon
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment on Backend
                    try {
                        const verifyRes = await axios.post('https://new-api-mm.onrender.com/api/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: tier.id
                        }, config);

                        if (verifyRes.data.success) {
                            setSuccess(true);
                            setTimeout(() => navigate('/dashboard'), 3000);
                        }
                    } catch (err) {
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user?.basicInfo?.name || "Member",
                    email: user?.contactInfo?.email || "",
                    contact: user?.contactInfo?.mobile || ""
                },
                theme: {
                    color: "#ea580c"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to initialize payment.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="payment-page">
                <Navbar />
                <div className="payment-success-card">
                    <CheckCircle size={80} color="#22c55e" />
                    <h2>Payment Successful!</h2>
                    <p>Congratulations! Your account has been upgraded to <strong>{tier.name}</strong> membership.</p>
                    <p className="redirect-text">Redirecting to your dashboard in 3 seconds...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <Navbar />
            <div className="payment-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Back to Plans
                </button>

                <div className="payment-grid">
                    <div className="summary-card shadow-sm">
                        <div className="summary-header">
                            <h3>Order Summary</h3>
                            <span className="plan-badge">{tier?.name}</span>
                        </div>
                        <div className="summary-body">
                            <div className="summary-row">
                                <span>Plan Duration</span>
                                <span>{tier?.duration}</span>
                            </div>
                            <div className="summary-row">
                                <span>Base Price</span>
                                <span>{tier?.displayPrice}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (GST 0%)</span>
                                <span>₹0</span>
                            </div>
                            <hr />
                            <div className="summary-row total">
                                <span>Total Amount</span>
                                <span>{tier?.displayPrice}</span>
                            </div>
                        </div>
                        <div className="summary-footer">
                            <ShieldCheck size={16} color="#16a34a" />
                            <span>100% Secure Payment powered by Razorpay</span>
                        </div>
                    </div>

                    <div className="checkout-card shadow">
                        <div className="checkout-badge">Selected Plan: {tier?.name}</div>
                        <h2>Complete Your Purchase</h2>
                        <p>Join thousands of members who found their soulmate on Madurai Matrimony.</p>
                        
                        <div className="benefits-preview">
                            {tier?.benefits.slice(0, 3).map((b, i) => (
                                <div key={i} className="benefit-dot">
                                    <div className="dot"></div> {b}
                                </div>
                            ))}
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <button 
                            className="pay-now-btn" 
                            onClick={handlePayment} 
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                <><CreditCard size={20} /> Pay {tier?.displayPrice}</>
                            )}
                        </button>

                        <div className="security-badges">
                            <div className="sec-item"><Lock size={14} /> Encrypted</div>
                            <div className="sec-item"><ShieldCheck size={14} /> Verified</div>
                            <div className="sec-item"><CreditCard size={14} /> PCI DSS</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
