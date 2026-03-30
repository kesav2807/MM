import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Navbar />
            <Hero />
            
            <section className="features-section container animate-fade">
                <div className="section-header">
                    <h2>Everything you need for a <span>meaningful match</span></h2>
                    <p>Find the right partner with the biggest and most trusted service for Tamils.</p>
                </div>
                
                <div className="features-grid">
                    <div className="feature-card card animate-fade">
                        <div className="icon">🔍</div>
                        <h3>Intelligent Search</h3>
                        <p>Refine your search with filters like location, education, and profession.</p>
                    </div>
                    
                    <div className="feature-card card animate-fade">
                        <div className="icon">🛡️</div>
                        <h3>Private & Secure</h3>
                        <p>We ensure that your photos and information are strictly protected and only shared of your choice.</p>
                    </div>
                    
                    <div className="feature-card card animate-fade">
                        <div className="icon">📱</div>
                        <h3>Mobile Friendly</h3>
                        <p>Access your matches on the go with our fully responsive mobile platform.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
