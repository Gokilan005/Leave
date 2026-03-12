import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    const { data } = await axios.get('http://localhost:5001/api/auth/me', config);
                    // Token is valid, set user but keep the token from cookie
                    const userDataText = Cookies.get('user');
                    if (userDataText) {
                        setUser(JSON.parse(userDataText));
                    } else {
                        setUser(data);
                    }
                } catch (error) {
                    console.error("Invalid token", error);
                    Cookies.remove('token');
                    Cookies.remove('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password, allowedRoles = []) => {
        try {
            const { data } = await axios.post('http://localhost:5001/api/auth/login', { email, password });
            
            // Role validation
            if (allowedRoles.length > 0 && !allowedRoles.includes(data.role)) {
                return {
                    success: false,
                    message: `Unauthorized access: This portal is for ${allowedRoles.join('/')}s only.`
                };
            }

            Cookies.set('token', data.token, { expires: 30 });
            const userData = {
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                department: data.department,
                rollNo: data.rollNo,
                section: data.section,
                year: data.year,
                profileImage: data.profileImage
            };
            Cookies.set('user', JSON.stringify(userData), { expires: 30 });
            setUser(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
