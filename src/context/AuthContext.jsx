import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getToken } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            if (token) {
                try {
                    const userData = await authApi.me();
                    setUser(userData);
                } catch (err) {
                    console.error('Failed to verify token', err);
                    authApi.logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authApi.login({ email, password });

            const userData = await authApi.me();
            setUser(userData);
            return true;
        } catch (err) {
            console.error('Login error', err);
            throw err;
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await authApi.register({ name, email, password });
            const userData = await authApi.me();
            setUser(userData);
            return true;
        } catch (err) {
            console.error('Registration error', err);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        authApi.logout();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
