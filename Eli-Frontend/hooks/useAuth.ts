// hooks/useAuth.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import type { SignupFormData } from '@/context/signupContext';

const API_BASE_URL = 'http://localhost:3001';

/**
 * Custom hook for handling authentication logic (login, signup).
 */
export function useAuth() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    /**
     * Handles user login.
     * This function remains unchanged.
     */
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
            // Assuming token-based auth
            localStorage.setItem("token", data.token);
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles the complete multi-step signup process.
     * It sends all form data collected in the context to the backend.
     * The backend should be prepared to receive this object, create a 'users' record,
     * and then create an associated 'profiles' record.
     * @param formData The complete signup form data object.
     */
    const signup = async (formData: SignupFormData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        console.log('Submitting signup data:', formData);

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
                localStorage.setItem("token", data.token);
            }
            setSuccess(true);

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
