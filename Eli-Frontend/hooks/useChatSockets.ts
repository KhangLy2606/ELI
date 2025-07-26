import { useState, useEffect, useRef, useCallback } from 'react';

// Define the structure of a message for our state
export interface Message {
    role: "USER" | "ASSISTANT";
    content: string;
    timestamp?: Date;
}

// Connection states for better debugging
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Decodes a JWT token to extract its payload without verifying the signature.
 * @param token The JWT string.
 * @returns The decoded payload object, or null if decoding fails.
 */
const decodeJwt = (token: string): { exp?: number; [key: string]: any } | null => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
};

/**
 * Checks if a JWT token is expired or close to expiring.
 * @param token The JWT string.
 * @param bufferSeconds A buffer in seconds to consider the token as "expiring soon".
 * @returns True if the token is expired or invalid, false otherwise.
 */
const isTokenExpired = (token: string, bufferSeconds: number = 30): boolean => {
    const payload = decodeJwt(token);
    if (!payload || typeof payload.exp !== 'number') {
        // If we cannot decode it or it has no expiration, treat it as invalid/expired.
        return true;
    }
    // The 'exp' claim is in seconds, while Date.now() is in milliseconds.
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp < (nowInSeconds + bufferSeconds);
};


/**
 * A custom React hook that reads the user's auth token from localStorage
 * and manages a WebSocket chat connection with improved error handling and token validation.
 */
export const useChatSocket = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
    const [authStatus, setAuthStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const [error, setError] = useState<string | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 3;
    const reconnectTimeout = useRef<NodeJS.Timeout>();
    // --- MODIFICATION START ---
    // Ref to prevent multiple concurrent token refresh attempts.
    const isRefreshing = useRef(false);
    // --- MODIFICATION END ---


    // Clear any existing connection
    const cleanup = useCallback(() => {
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
        }
        if (ws.current) {
            ws.current.onopen = null;
            ws.current.onmessage = null;
            ws.current.onclose = null;
            ws.current.onerror = null;
            if (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING) {
                ws.current.close();
            }
            ws.current = null;
        }
    }, []);

    // --- MODIFICATION START ---
    // Encapsulated token refresh logic.
    const refreshTokenAndGet = async (): Promise<string | null> => {
        // If a refresh is already happening, don't start another.
        if (isRefreshing.current) return null;

        isRefreshing.current = true;
        console.log("Auth token expired, attempting to refresh...");

        try {
            // This assumes you store a 'refreshToken' in localStorage upon login.
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                throw new Error("No refresh token available for re-authentication.");
            }

            // This assumes your server has an endpoint to handle token refreshes.
            // The endpoint should accept a refresh token and return a new access token.
            const response = await fetch('http://localhost:3001/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: refreshToken }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Token refresh failed.");
            }

            const { token: newAccessToken } = data; // Assuming response is { token: "..." }
            localStorage.setItem("token", newAccessToken);
            console.log("Token refreshed successfully.");
            return newAccessToken;
        } catch (refreshError: any) {
            console.error("Could not refresh token:", refreshError.message);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            return null;
        } finally {
            // Ensure we mark refreshing as false whether it succeeded or failed.
            isRefreshing.current = false;
        }
    };


    // Connect to WebSocket with retry logic
    const connect = useCallback(async () => {
        cleanup(); // Ensure no lingering connections
        let token = localStorage.getItem("token");

        // If the token is missing or expired, attempt to refresh it.
        if (!token || isTokenExpired(token)) {
            token = await refreshTokenAndGet();
        }
        // If after checking and attempting a refresh, we still have no valid token, abort.
        if (!token) {
            console.error("No valid auth token available. User must log in.");
            setAuthStatus('failed');
            setError('Your session has expired. Please log in again.');
            return;
        }


        setAuthStatus('success');
        setConnectionState('connecting');
        setError(null);

        try {
            const serverUrl = `ws://localhost:3001/ws?token=${encodeURIComponent(token)}`;
            console.log('Attempting to connect to:', serverUrl);

            ws.current = new WebSocket(serverUrl);

            ws.current.onopen = (event) => {
                console.log("WebSocket connection established");
                setConnectionState('connected');
                setError(null);
                reconnectAttempts.current = 0;
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Received WebSocket message:', data);

                    if (data.type === "assistant_message") {
                        setIsLoading(false);
                        setMessages(prev => [...prev, {
                            role: "assistant",
                            content: data.message.content,
                            timestamp: new Date()
                        }]);
                    } else if (data.type === "error") {
                        console.error('Server error:', data.message);
                        setError(data.message);
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                    setError('Error parsing server response');
                }
            };

            ws.current.onclose = (event) => {
                console.log("WebSocket connection closed:", { code: event.code, reason: event.reason, wasClean: event.wasClean });
                setConnectionState('disconnected');
                setIsLoading(false);

                if (event.code === 1008) { // 'Invalid token' from server
                    setError("Authentication failed. Please log in again.");
                    setAuthStatus('failed');
                    return; // Do not reconnect on auth failure.
                }

                if (!event.wasClean && reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++;
                    const delay = Math.pow(2, reconnectAttempts.current) * 1000;
                    console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
                    reconnectTimeout.current = setTimeout(connect, delay);
                } else if (reconnectAttempts.current >= maxReconnectAttempts) {
                    setError('Connection lost. Maximum reconnection attempts exceeded.');
                }
            };

            ws.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                setConnectionState('error');
                setError('WebSocket connection error occurred');
                setIsLoading(false);
            };

        } catch (error) {
            console.error('Error creating WebSocket:', error);
            setConnectionState('error');
            setError('Failed to create WebSocket connection');
            setAuthStatus('failed');
        }
    }, [cleanup]);

    useEffect(() => {
        connect();
        return cleanup;
    }, [connect, cleanup]);

    const reconnect = useCallback(() => {
        reconnectAttempts.current = 0;
        connect();
    }, [connect]);

    const handleSendMessage = useCallback((content: string) => {
        if (!ws.current) {
            setError('WebSocket is not initialized');
            return;
        }

        if (ws.current.readyState === WebSocket.OPEN) {
            setMessages(prev => [...prev, {
                role: "USER",
                content,
                timestamp: new Date()
            }]);
            ws.current.send(content);
            setIsLoading(true);
            setError(null);
        } else {
            const stateNames = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
            const currentState = stateNames[ws.current.readyState] || 'UNKNOWN';
            const errorMsg = `Cannot send message. WebSocket state: ${currentState}`;
            console.error(errorMsg);
            setError(errorMsg);
        }
    }, []);

    return {
        messages,
        isLoading,
        connectionState,
        isConnected: connectionState === 'connected',
        authStatus,
        error,
        handleSendMessage,
        reconnect
    };
};