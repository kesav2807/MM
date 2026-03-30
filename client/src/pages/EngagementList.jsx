import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MatchCard from '../components/MatchCard';
import axios from 'axios';
import './Matches.css'; // Reuse matches layout
import { ChevronLeft, Eye, Users } from 'lucide-react';

const EngagementList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const isViews = location.pathname.includes('views');
    const title = isViews ? 'Profiles who viewed you' : 'Profiles who shortlisted you';
    const endpoint = isViews ? 'views' : 'shortlists';

    useEffect(() => {
        const fetchEngagement = async () => {
            setLoading(true);
            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                };
                const res = await axios.get(`https://new-api-mm.onrender.com/api/users/${endpoint}`, config);
                setUsers(res.data.data);
            } catch (error) {
                console.error('Error fetching engagement:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEngagement();
    }, [endpoint]);

    return (
        <div className="matches-page">
            <Navbar />
            <div className="container mt-4">
                <div className="matches-content-header">
                    <div className="header-text">
                        <button className="back-link mb-2" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                           <ChevronLeft size={18}/> Back to Dashboard
                        </button>
                        <h2>{title} <span>({users.length} profiles)</span></h2>
                        <p>Listing of all members who have interacted with your profile recently.</p>
                    </div>
                </div>

                <div className="matches-vertical-list mt-4">
                    {loading ? (
                        <div>Loading...</div>
                    ) : users.length > 0 ? (
                        users.map(user => (
                            <div key={user._id} className="wide-match-card-wrap">
                                <MatchCard match={user} variant="wide" />
                            </div>
                        ))
                    ) : (
                        <div className="no-matches-found card">
                            {isViews ? <Eye size={48} color="#cbd5e1" /> : <Users size={48} color="#cbd5e1" />}
                            <h3>No data found yet.</h3>
                            <p>Complete your profile to get more visibility!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EngagementList;
