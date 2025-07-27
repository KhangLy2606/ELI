// hooks/useEviSocket.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthContext } from '@/context/authContext';

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    emotions?: Record<string, number>;
}

export type HumeEvent = {
    type: string;
    [key: string]: any;
};

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

interface UseEviSocketProps {
    profileId: string | null;
    configId: string | null;
}

export const useEviSocket = ({ profileId, configId }: UseEviSocketProps) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
    const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
    const [error, setError] = useState<string | null>(null);

    const ws = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioQueueRef = useRef<ArrayBuffer[]>([]);
    const isPlayingRef = useRef(false);

    const { token } = useAuthContext();

    const processAudioQueue = useCallback(() => {
        if (isPlayingRef.current || audioQueueRef.current.length === 0 || !audioContextRef.current) {
            return;
        }
        isPlayingRef.current = true;
        const audioData = audioQueueRef.current.shift();
        if (!audioData) {
            isPlayingRef.current = false;
            return;
        }
        audioContextRef.current.decodeAudioData(audioData, (buffer) => {
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            source.start(0);
            source.onended = () => {
                isPlayingRef.current = false;
                processAudioQueue();
            };
        }, (err) => {
            console.error("Error decoding audio data", err);
            isPlayingRef.current = false;
            processAudioQueue();
        });
    }, []);

    const connect = useCallback(async () => {
        if (!profileId || !configId || !token) return;
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("AudioContext is not supported.", e);
                setError("Audio playback is not supported.");
                return;
            }
        }
        setConnectionState('connecting');
        setError(null);
        ws.current = new WebSocket(`ws://localhost:3001/ws?token=${encodeURIComponent(token)}`);
        ws.current.onopen = () => {
            const startMessage: HumeEvent = { type: 'start_session', payload: { profile_id: profileId, config_id: configId, modality: 'voice' } };
            ws.current?.send(JSON.stringify(startMessage));
        };
        ws.current.onmessage = (event) => {
            if (event.data instanceof Blob) {
                event.data.arrayBuffer().then(arrayBuffer => {
                    audioQueueRef.current.push(arrayBuffer);
                    processAudioQueue();
                });
                return;
            }
            try {
                const data: HumeEvent = JSON.parse(event.data);
                switch (data.type) {
                    case 'session_ready': setConnectionState('connected'); break;
                    case 'assistant_message':
                        if (data.message?.content) setChatHistory(prev => [...prev, { role: 'assistant', content: data.message.content, timestamp: new Date(), emotions: data.models?.prosody?.scores }]);
                        setIsAssistantSpeaking(true);
                        break;
                    case 'assistant_end': setIsAssistantSpeaking(false); break;
                    case 'error': setError(data.message || 'An unknown error occurred.'); break;
                }
            } catch (e) {
                console.error('Failed to parse message:', e);
            }
        };
        ws.current.onclose = () => setConnectionState('disconnected');
        ws.current.onerror = () => setConnectionState('error');
    }, [profileId, configId, token, processAudioQueue]);

    useEffect(() => {
        connect();
        return () => ws.current?.close();
    }, [connect]);

    // ✅ FIX: Added `connectionState` as a dependency to prevent stale closures.
    // Now, these functions will always have the correct, active WebSocket instance.
    const sendTextInput = useCallback((text: string) => {
        if (ws.current?.readyState === WebSocket.OPEN && connectionState === 'connected') {
            const message: HumeEvent = { type: 'user_input', text };
            ws.current.send(JSON.stringify(message));
            setChatHistory(prev => [...prev, { role: 'user', content: text, timestamp: new Date() }]);
        }
    }, [connectionState]);

    const sendAudioInput = useCallback((audioData: Blob) => {
        if (ws.current?.readyState === WebSocket.OPEN && connectionState === 'connected') {
            ws.current.send(audioData);
        }
    }, [connectionState]);

    return { chatHistory, isConnected: connectionState === 'connected', isAssistantSpeaking, error, sendTextInput, sendAudioInput };
};
