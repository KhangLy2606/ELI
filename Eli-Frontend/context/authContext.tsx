// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'expo-router';

const API_BASE_URL = 'http://localhost:3001';

export interface Profile {
    id: string;
    user_id: string;
    preferred_name: string;
}

interface User {
    id: string;
    email: string;
    full_name: string;
}

// The backend response from /api/user/session-data
interface SessionDataResponse {
    user: User;
    profiles: Profile[];
}


interface AuthContextType {
    user: User | null;
    token: string | null;
    profiles: Profile[];
    selectedProfile: Profile | null; // The currently active profile for chatting
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    setSelectedProfile: (profile: Profile) => void; // Function to switch profiles
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Memoize fetchUserData to stabilize its identity
    const fetchUserData = useCallback(async (currentToken: string) => {
        const response = await fetch(`${API_BASE_URL}/api/user/session-data`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (!response.ok) {
            throw new Error('Session expired or invalid.');
        }

        const data: SessionDataResponse = await response.json();

        setUser(data.user);
        setProfiles(data.profiles);
        setToken(currentToken);

        // Automatically select the first profile as the default
        if (data.profiles.length > 0) {
            setSelectedProfile(data.profiles[0]);
        }
    }, []); // Empty dependency array as it has no external dependencies from component scope

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    await fetchUserData(storedToken);
                } catch (error) {
                    console.error("Failed to initialize auth:", error);
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, [fetchUserData]); // Dependency on the memoized function

    // Memoize login to stabilize its identity
    const login = useCallback(async (newToken: string) => {
        setIsLoading(true);
        try {
            localStorage.setItem('token', newToken);
            await fetchUserData(newToken);
        } catch (error) {
            console.error("Login process failed:", error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setProfiles([]);
            setSelectedProfile(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [fetchUserData]); // Dependency on the memoized function

    // Memoize logout to stabilize its identity
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setProfiles([]);
        setSelectedProfile(null);
        router.replace('/login');
    }, [router]); // Dependency on the router instance

    // The value passed to the provider now contains stable functions
    const value = {
        user,
        token,
        isLoading,
        login,
        logout,
        profiles,
        selectedProfile,
        setSelectedProfile // The setter from useState is already stable by default
    };

    return (
        <AuthContext.Provider value={value}>
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
