import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegistrationCard.css';
import { User, Phone, CheckCircle, ArrowRight } from 'lucide-react';

const RegistrationCard = () => {
    const navigate = useNavigate();
    const { updateRegData } = useAuth();
    const [formData, setFormData] = useState({
        profileFor: '',
        name: '',
        mobile: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        updateRegData(formData);
        navigate('/register');
    }

    return (
        <div className="registration-card card glass">
            <h2 className="title">Your path to finding a <span>perfect match</span> starts here.</h2>
            <form onSubmit={handleSubmit} className="reg-form">
                <div className="form-group">
                    <label htmlFor="profileFor">Matrimony profile for</label>
                    <div className="select-wrapper">
                        <User className="icon" size={18} />
                        <select name="profileFor" id="profileFor" required onChange={handleChange} value={formData.profileFor}>
                           <option value="" disabled>Select</option>
                           <option value="Self">Self</option>
                           <option value="Son">Son</option>
                           <option value="Daughter">Daughter</option>
                           <option value="Brother">Brother</option>
                           <option value="Sister">Sister</option>
                           <option value="Relative">Relative</option>
                           <option value="Friend">Friend</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <div className="input-field">
                        <User className="icon" size={18} />
                        <input type="text" name="name" id="name" placeholder="Enter Full Name" required value={formData.name} onChange={handleChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="mobile">Mobile Number</label>
                    <div className="input-field">
                        <Phone className="icon" size={18} />
                        <span className="prefix">+91</span>
                        <input type="tel" name="mobile" id="mobile" placeholder="Mobile Number" required value={formData.mobile} onChange={handleChange} />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary submit-btn">
                    Register Free
                    <ArrowRight size={18} />
                </button>
            </form>
            <div className="features-list">
                <div className="feature"><CheckCircle size={14} className="check"/> 100% Verified Profiles</div>
                <div className="feature"><CheckCircle size={14} className="check"/> Privacy Protection</div>
                <div className="feature"><CheckCircle size={14} className="check"/> 26 Years of Trust</div>
            </div>
        </div>
    );
}

export default RegistrationCard;
