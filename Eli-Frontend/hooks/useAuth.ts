// hooks/useAuth.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import type { SignupFormData } from '@/context/signupContext';
import { useAuthContext } from '@/context/authContext';

const API_BASE_URL = 'http://localhost:3001';

/**
 * Custom hook for handling authentication logic (login, signup).
 */
export function useAuth() {
    const router = useRouter();
    const { login: contextLogin } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to login.');
            await contextLogin(data.token);
            router.push('/dashboard');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (formData: SignupFormData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to complete signup.');
            }

            if (data.token) {

                await contextLogin(data.token);
            }
            setSuccess(true);
            router.push('/dashboard')

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            console.error("Signup failed:", errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, signup, isLoading, error, success };
}
