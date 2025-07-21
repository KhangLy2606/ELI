import { useState, useEffect, useRef, useCallback } from 'react';

// Define the structure of a message for our state
export interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp?: Date;
}

// Connection states for better debugging
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * A custom React hook that reads the user's auth token from localStorage
 * and manages a WebSocket chat connection with improved error handling.
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

    // Connect to WebSocket with retry logic
    const connect = useCallback(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No auth token found in localStorage. User must be logged in.");
            setAuthStatus('failed');
            setError('No authentication token found');
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
                console.log("WebSocket connection established with Node.js server");
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
                    } else if (data.type === "connection_established") {
                        console.log('Connection established:', data.message);
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
                console.log("WebSocket connection closed:", {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean
                });

                setConnectionState('disconnected');
                setIsLoading(false);

                // Attempt to reconnect if it wasn't a clean closure and we haven't exceeded max attempts
                if (!event.wasClean && reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++;
                    const delay = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
                    console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);

                    reconnectTimeout.current = setTimeout(() => {
                        connect();
                    }, delay);
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
    }, []);

    // Initialize connection
    useEffect(() => {
        connect();
        return cleanup;
    }, [connect, cleanup]);

    // Manual reconnect function
    const reconnect = useCallback(() => {
        cleanup();
        reconnectAttempts.current = 0;
        setTimeout(connect, 100);
    }, [cleanup, connect]);

    const handleSendMessage = useCallback((content: string) => {
        if (!ws.current) {
            setError('WebSocket is not initialized');
            return;
        }

        if (ws.current.readyState === WebSocket.OPEN) {
            setMessages(prev => [...prev, {
                role: "user",
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