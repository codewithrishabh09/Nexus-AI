/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setUser(data.user);
                    }
                }
            } catch (err) {
                console.error("Auth check failed");
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
            await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
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
