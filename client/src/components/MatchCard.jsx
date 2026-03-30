import React, { useState } from 'react';
import './MatchCard.css';
import { 
  User, MapPin, Briefcase, Heart, CheckCircle, Send, Eye, Bookmark, 
  Phone, MessageCircle, X, Image as ImageIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PremiumModal from './PremiumModal';

const MatchCard = ({ match, variant = 'standard', onIgnore }) => {
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(match.hasSentInterest || false);
  const [loading, setLoading] = useState(false);

  const { user: authUser } = useAuth();
  const [showPremium, setShowPremium] = useState(false);
  const isPremium = authUser?.status?.isPremium || false;

  const { profileId, basicInfo, contactInfo, personalDetails, status, _id, id } = match;
  const userId = _id || id;

  React.useEffect(() => {
    setIsSent(match.hasSentInterest || false);
    setIsShortlisted(match.isShortlisted || false);
  }, [match.hasSentInterest, match.isShortlisted]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!userId) return;
    
    setLoading(true);
    try {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        };
        
        if (isSent) {
            // Un-send logic
            await axios.delete('https://new-api-mm.onrender.com/api/users/interest', { 
                data: { receiverId: userId }, 
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
            });
            setIsSent(false);
        } else {
            // Send logic
            await axios.post('https://new-api-mm.onrender.com/api/users/interest', { receiverId: userId }, config);
            setIsSent(true);
        }
    } catch (error) {
        console.error('Error toggling interest:', error);
        // If it was already sent/unsent silently handle it or refresh state
    } finally {
        setLoading(false);
    }
  };

  const [isShortlisted, setIsShortlisted] = useState(match.isShortlisted || false);

  const handleShortlist = async (e) => {
    e.stopPropagation();
    try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
        const res = await axios.post('https://new-api-mm.onrender.com/api/users/shortlist', { receiverId: userId }, config);
        setIsShortlisted(res.data.action === 'added');
    } catch (err) { console.error(err); }
  };

  const handleIgnore = async (e) => {
    e.stopPropagation();
    try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
        await axios.post('https://new-api-mm.onrender.com/api/users/ignore', { receiverId: userId }, config);
        if (onIgnore) onIgnore(userId);
    } catch (err) { console.error(err); }
  };

  const handleCall = (e) => {
    e.stopPropagation();
    if (!isPremium) {
        setShowPremium(true);
        return;
    }
    if (contactInfo?.mobile) window.location.href = `tel:${contactInfo.mobile}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    if (!isPremium) {
        setShowPremium(true);
        return;
    }
    if (contactInfo?.mobile) window.open(`https://wa.me/${contactInfo.mobile.replace(/\D/g,'')}`, '_blank');
  };

  const handleViewProfile = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      console.warn('MatchCard: userId is missing, cannot navigate to profile');
    }
  };

  const isTM = variant === 'tm-wide';

  if (isTM) {
    const isNew = new Date(match.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return (
      <>
        <motion.div 
          className="tm-v10-card"
          whileHover={{ y: -2 }}
          onClick={handleViewProfile}
        >
          <div className="tm-v10-left">
            <div className="tm-v10-photo-wrap">
              <img src={match.profilePhotos?.[0] || 'https://via.placeholder.com/260'} alt={basicInfo.name} />
              {isNew && <div className="tm-new-ribbon">NEWLY JOINED</div>}
              <button 
                  className={`tm-shortlist-btn ${isShortlisted ? 'active' : ''}`} 
                  onClick={handleShortlist}
              >
                  <Bookmark size={14} fill={isShortlisted ? "white" : "currentColor"} /> {isShortlisted ? 'Shortlisted' : 'Shortlist'}
              </button>
              <div className="tm-photo-count">
                  {match.profilePhotos?.length || 1} <ImageIcon size={12} />
              </div>
            </div>
          </div>

          <div className="tm-v10-right">
            <div className="tm-v10-header">
               <div className="tm-id-verified"><CheckCircle size={14} fill="#0ea5e9" color="white" /> ID verified</div>
               <div className="tm-v10-top-actions">
                  <div className="tm-icon-circle" onClick={handleCall}><Phone size={16} /></div>
                  <div className="tm-icon-circle whatsapp" onClick={handleWhatsApp}><MessageCircle size={16} /></div>
               </div>
            </div>

            <div className="tm-v10-info">
               <h2 className="tm-v10-name">{basicInfo.name}</h2>
               <p className="tm-v10-id-row">{profileId} | Last seen few hour ago</p>
               
               <div className="tm-v10-details-line">
                  <span>{basicInfo.age} yrs</span>
                  <span className="dot">•</span>
                  <span>{personalDetails?.height || "5'0\""}</span>
                  <span className="dot">•</span>
                  <span>{personalDetails?.caste || 'Caste'}</span>
                  <span className="dot">•</span>
                  <span>{personalDetails?.education || 'B.Com.'}</span>
                  <span className="dot">•</span>
                  <span>{personalDetails?.occupation || 'Private Sector'}</span>
                  <span className="dot">•</span>
                  <span>{contactInfo?.location?.city || 'Location'}</span>
               </div>
            </div>

            <div className="tm-v10-actions-row">
               <button className="tm-v10-btn-secondary" onClick={handleIgnore}>
                  <X size={18} /> Don't Show
               </button>
               <button 
                  className={`tm-v10-btn-primary ${isSent ? 'sent' : ''}`} 
                  onClick={handleLike}
                  disabled={loading || isSent}
               >
                  <Heart size={18} fill={isSent ? 'white' : 'transparent'} /> {isSent ? 'Interest Sent' : 'Send Interest'}
               </button>
            </div>
          </div>
        </motion.div>

        <PremiumModal 
            isOpen={showPremium} 
            onClose={() => setShowPremium(false)} 
            peerName={basicInfo.name} 
            peerPhoto={match.profilePhotos?.[0]} 
        />
      </>
    );
  }

  const isWide = variant === 'wide';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`match-card card ${isWide ? 'match-card-wide' : 'animate-fade'}`}
    >
      <div className={isWide ? 'match-photo-wide' : 'match-photo'}>
          <img src={match.profilePhotos && match.profilePhotos.length > 0 ? match.profilePhotos[0] : 'https://via.placeholder.com/200?text=Profile'} alt={basicInfo.name} />
          {status?.isVerified && <div className="verified-badge"><CheckCircle size={10} /> Verified</div>}
      </div>

      <div className="match-details">
         <div className="match-header">
            <h3>{basicInfo.name} <span className="profile-id">({profileId})</span></h3>
            {status?.isPremium && <span className="premium-tag">Premium</span>}
         </div>

         <div className="match-info">
            <div className="info-item"><User size={14} /> {basicInfo.age} yrs, {basicInfo.gender}</div>
            <div className="info-item"><MapPin size={14} /> {contactInfo?.location?.city || 'Location'}, {contactInfo?.location?.state || 'TN'}</div>
            <div className="info-item"><Briefcase size={14} /> {personalDetails?.occupation || 'Job'}</div>
         </div>

         <div className="match-social-pills">
            <span className="pill-small">{basicInfo.religion}</span>
            <span className="pill-small text-truncate">{personalDetails?.caste || 'Caste'}</span>
         </div>

         <div className="match-actions">
            <button 
                className={`btn btn-like ${isSent ? 'btn-sent' : ''}`} 
                onClick={handleLike}
                disabled={loading || isSent}
            >
                {loading ? <div className="loader-small"></div> : isSent ? <Send size={16} /> : <Heart size={16} />}
                {isSent ? 'Sent' : 'Yes'}
            </button>
            <button className="btn btn-view" onClick={handleViewProfile}>
                <Eye size={16} /> View Profile
            </button>
         </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
