import axios from 'axios';

// CENTRAL API CONFIGURATION
const API_BASE_URL = 'https://new-api-mm.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL
}); 

// AUTOMATIC AUTH INJECTION
// This adds the token to every request so you don't have to manually add headers in every file!
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
};

export const userAPI = {
    getDashboard: () => api.get('/users/dashboard'),
    getMatches: (params) => api.get('/users/matches', { params }),
    getProfile: (id) => api.get(`/users/${id}`),
    updateProfile: (data) => api.put('/users/profile', data),
    uploadPhoto: (data) => axios.post(`${API_BASE_URL}/users/upload-profile-photo`, data), // Public route usually
};

export const interactionAPI = {
    sendInterest: (receiverId) => api.post('/users/interest', { receiverId }),
    respondInterest: (id, status) => api.put(`/users/interest/${id}`, { status }),
    getReceivedInterests: () => api.get('/users/interests/received'),
    getSentInterests: () => api.get('/users/interests/sent'),
    shortlist: (receiverId) => api.post('/users/shortlist', { receiverId }),
    cancelInterest: (receiverId) => api.delete('/users/interest', { data: { receiverId } }),
};

export const messageAPI = {
    getMessages: (peerId) => api.get(`/users/messages/${peerId}`),
    sendMessage: (receiverId, text) => api.post('/users/message', { receiverId, text }),
};

export const engagementAPI = {
    getViews: () => api.get('/users/views'),
    getShortlists: () => api.get('/users/shortlists'),
};

export default api;
