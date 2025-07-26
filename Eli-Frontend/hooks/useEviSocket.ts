// hooks/useEviSocket.ts
import { useState, useEffect, useRef, useCallback } from 'react';


// Represents a message displayed in the chat history UI
export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    emotions?: Record<string, number>;
}

// Represents the full spectrum of events from Hume, forwarded by our server
export type HumeEvent = {
    type: string;
    [key: string]: any;
};

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
export type AuthStatus = 'pending' | 'success' | 'failed';
export type Modality = 'chat' | 'voice';

// --- Helper Functions (Token Handling) ---
// TODO These can be moved to a separate utility file
const decodeJwt = (token: string): { exp?: number } | null => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const isTokenExpired = (token: string, bufferSeconds: number = 60): boolean => {
    const payload = decodeJwt(token);
    if (!payload || typeof payload.exp !== 'number') return true;
    return payload.exp < (Date.now() / 1000 + bufferSeconds);
};


interface UseEviSocketProps {
    profileId: string | null;
    modality: Modality;       // The type of session ('chat' or 'voice')
    onEvent?: (event: HumeEvent) => void; // Optional callback for raw Hume events
}

/**
 * A custom React hook to manage a WebSocket connection to the unified EVI service.
 * It handles authentication, the session handshake, and message routing.
 */
export const useEviSocket = ({ profileId, modality, onEvent }: UseEviSocketProps) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
    const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
    const [authStatus, setAuthStatus] = useState<AuthStatus>('pending');
    const [error, setError] = useState<string | null>(null);

    const ws = useRef<WebSocket | null>(null);
    const reconnectAttempts = useRef(0);
    const isRefreshingToken = useRef(false);

    // This function must now send a structured JSON message
    const sendTextInput = useCallback((text: string) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            const message: HumeEvent = {
                type: 'user_input',
                text: text,
            };
            ws.current.send(JSON.stringify(message));

            // Add user's message to history immediately for a responsive UI
            setChatHistory(prev => [...prev, {
                role: 'user',
                content: text,
                timestamp: new Date()
            }]);

        } else {
            console.error('EVI WebSocket not open. Cannot send message.');
            setError('Connection is not active. Please wait or try reconnecting.');
        }
    }, []);

    // New function for the voice interface to send audio data
    const sendAudioInput = useCallback((audioData: Blob) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(audioData);
        }
    }, []);

    const connect = useCallback(async () => {
        if (!profileId) {
            // Don't attempt to connect if there's no active profile selected.
            setAuthStatus('pending');
            return;
        }

        // Cleanup previous connection
        ws.current?.close();
        setConnectionState('connecting');
        let token = localStorage.getItem("token");

        // Simple token refresh logic (can be expanded)
        if (!token || isTokenExpired(token)) {
            // TODO  robust token refresh mechanism here.
            // For now, we'll just fail and prompt for re-login.
            console.error("No valid auth token. User must log in again.");
            setAuthStatus('failed');
            setError('Your session has expired. Please log in again.');
            return;
        }

        setAuthStatus('success');

        const serverUrl = `ws://localhost:3001/ws?token=${encodeURIComponent(token)}`;
        ws.current = new WebSocket(serverUrl);

        ws.current.onopen = () => {
            console.log('[EVI Socket] Connection established. Sending start_session...');
            // Send the start_session message after connecting.
            const startMessage: HumeEvent = {
                type: 'start_session',
                payload: {
                    profile_id: profileId,
                    modality: modality,
                }
            };
            ws.current?.send(JSON.stringify(startMessage));
        };

        ws.current.onmessage = (event) => {
            const data: HumeEvent = JSON.parse(event.data);

            // Optional: Allow parent component to react to any event
            if (onEvent) {
                onEvent(data);
            }

            //  Handle various message types from the server.
            switch (data.type) {
                case 'session_ready':
                    console.log(`[EVI Socket] Session is ready. Chat ID: ${data.chatId}`);
                    setConnectionState('connected');
                    reconnectAttempts.current = 0;
                    setError(null);
                    break;

                case 'assistant_message':
                    setChatHistory(prev => [...prev, {
                        role: 'assistant',
                        content: data.message.content,
                        timestamp: new Date(),
                        emotions: data.models?.prosody?.scores,
                    }]);
                    setIsAssistantSpeaking(true);
                    break;

                case 'assistant_end':
                    setIsAssistantSpeaking(false);
                    break;

                case 'user_message':
                    console.log('Hume confirmed user message:', data.message.content);
                    break;

                case 'user_interruption':
                    console.log('User interrupted assistant.');
                    setIsAssistantSpeaking(false);
                    break;

                case 'error':
                    console.error('[EVI Socket] Received error from server:', data.message);
                    setError(data.message || 'An unknown error occurred.');
                    break;

                // The voice UI will handle 'audio_output' via the onEvent callback
            }
        };

        ws.current.onclose = (event) => {
            console.log(`[EVI Socket] Connection closed. Code: ${event.code}`);
            setConnectionState('disconnected');
            if (event.code === 1008) { // Invalid Token
                setError("Authentication failed. Please log in again.");
                setAuthStatus('failed');
            }
        };

        ws.current.onerror = () => {
            console.error('[EVI Socket] WebSocket error occurred.');
            setError('A connection error occurred.');
            setConnectionState('error');
        };

    }, [profileId, modality, onEvent]);

    useEffect(() => {
        // Automatically connect when component mounts and has a profileId
        connect();
        // Cleanup on unmount
        return () => {
            ws.current?.close();
        };
    }, [connect]);


    return {
        // State
        chatHistory,
        connectionState,
        isConnected: connectionState === 'connected',
        authStatus,
        isAssistantSpeaking,
        error,
        // Methods
        sendTextInput,
        sendAudioInput,
        reconnect: connect, // Provide a manual reconnect function
    };
};
