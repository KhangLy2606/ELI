// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'expo-router';

const API_BASE_URL = 'http://localhost:3001';

interface User {
    id: string;
    email: string;
    profileId: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider component
interface AuthProviderProps {
    children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    // When the app loads, fetch user data if a token exists
                    const response = await fetch(`${API_BASE_URL}/api/user/me`, {
                        headers: { 'Authorization': `Bearer ${storedToken}` }
                    });
                    if (!response.ok) throw new Error('Session expired or invalid.');

                    const userData: User = await response.json();
                    setUser(userData);
                    setToken(storedToken);
                } catch (error) {
                    console.error("Failed to initialize auth:", error);
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (newToken: string) => {
        setIsLoading(true);
        try {
            localStorage.setItem('token', newToken);

            const response = await fetch(`${API_BASE_URL}/api/user/me`, {
                headers: { 'Authorization': `Bearer ${newToken}` }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user data after login.');
            }
            const userData: User = await response.json();

            setUser(userData);
            setToken(newToken);
        } catch (error) {
            console.error("Login process failed:", error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
