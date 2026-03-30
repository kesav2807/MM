import React from 'react';
import './Hero.css';
import RegistrationCard from './RegistrationCard';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-content">
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1>The biggest and most <span>trusted</span> matrimony service for Tamils!</h1>
          <p>Over 20+ years of bringing hearts together. Find your perfect soulmate today in the city of Madurai and beyond.</p>
          <div className="stats">
              <div className="stat-item">
                  <span className="number">10M+</span>
                  <span className="label">Profiles</span>
              </div>
              <div className="stat-item">
                  <span className="number">1M+</span>
                  <span className="label">Success Stories</span>
              </div>
          </div>
        </motion.div>
        <motion.div 
          className="hero-form"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <RegistrationCard />
        </motion.div>
      </div>
      <div className="hero-overlay"></div>
    </section>
  );
};

export default Hero;
