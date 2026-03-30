import api from './api';

export const adminAPI = {
    login: (data) => api.post('/admin/login', data),
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    verifyUser: (id) => api.put(`/admin/users/${id}/verify`),
    updateStatus: (id, role) => api.put(`/admin/users/${id}/status`, { role }),
};
