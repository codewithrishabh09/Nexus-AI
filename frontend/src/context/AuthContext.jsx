/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../utils/api';

const AuthContext = createContext();
const API_URL = getApiUrl();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const checkAuth = async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) {
                if (res.status === 401) {
                    console.warn('🔐 No valid authentication session found.');
                } else {
                    console.error(`❌ Auth check failed with status: ${res.status}`);
                }

                setUser(null);
                return;
            }

            const data = await res.json();

            if (data.success && data.user) {
                console.log('✅ Authentication session restored:', data.user.email);
                setUser(data.user);
            } else {
                setUser(null);
            }

        } catch (err) {
            console.error('❌ Auth check request failed:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    checkAuth();
}, []);

    const loginSession = (userData) => {
        setUser(userData);
    };

    const logoutSession = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (err) {
            console.error("Logout failed", err);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginSession, logoutSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
