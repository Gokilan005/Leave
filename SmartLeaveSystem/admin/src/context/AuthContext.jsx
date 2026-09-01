import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const savedToken = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
            if (savedToken) {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${savedToken}` }
                    };
                    const { data } = await axios.get('http://localhost:5001/api/auth/me', config);
                    
                    if (data.role === 'student') {
                        // Student cannot use admin portal, clear admin session
                        logout();
                    } else {
                        const userData = {
                            _id: data._id,
                            name: data.name,
                            email: data.email,
                            role: data.role,
                            department: data.department
                        };
                        setUser(userData);
                        setToken(savedToken);
                    }
                } catch (error) {
                    console.error("Invalid token", error);
                    logout();
                }
            }
            // Clean up legacy shared cookies
            Cookies.remove('token');
            Cookies.remove('user');
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5001/api/auth/login', { email, password });
            
            if (data.role === 'student') {
                return {
                    success: false,
                    message: 'Role mismatch: Students cannot log into Admin/Faculty Portal. Please visit the Student Portal at http://localhost:3002'
                };
            }

            Cookies.set(TOKEN_KEY, data.token, { expires: 30 });
            localStorage.setItem(TOKEN_KEY, data.token);

            const userData = {
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                department: data.department
            };
            Cookies.set(USER_KEY, JSON.stringify(userData), { expires: 30 });
            localStorage.setItem(USER_KEY, JSON.stringify(userData));

            // Remove legacy shared cookies
            Cookies.remove('token');
            Cookies.remove('user');

            setUser(userData);
            setToken(data.token);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        Cookies.remove(TOKEN_KEY);
        Cookies.remove(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        Cookies.remove('token');
        Cookies.remove('user');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

