import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registrationData, setRegistrationData] = useState({});

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // authAPI will handle setting the Authorization header internally
                    const res = await authAPI.getMe();
                    setUser(res.data.data);
                } catch (error) {
                    localStorage.removeItem('token');
                    setUser(null); // Clear user if token is invalid or expired
                }
            }
            setLoading(false); // Always set loading to false after check
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        localStorage.setItem('token', res.data.token);
        // authAPI will handle setting the Authorization header internally
        setUser(res.data.user);
        return res.data;
    };

    const register = async (userData) => {
        const res = await authAPI.register(userData);
        localStorage.setItem('token', res.data.token);
        // authAPI will handle setting the Authorization header internally
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const updateRegData = (data) => {
        setRegistrationData(prev => ({ ...prev, ...data }));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, registrationData, updateRegData }}>
            {children}
        </AuthContext.Provider>
    );
};
