import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/user');
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await api.get('/auth/user');
                setUser(res.data);
            } catch (err) {
                localStorage.removeItem('token');
                setUser(null);
            }
        }
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        await loadUser();
    };

    const register = async (username, email, password) => {
        const res = await api.post('/auth/register', { username, email, password });
        localStorage.setItem('token', res.data.token);
        await loadUser();
    };

    const updateProfile = async (profileData) => {
        const res = await api.put('/auth/profile', profileData);
        setUser(res.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, loadUser, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
