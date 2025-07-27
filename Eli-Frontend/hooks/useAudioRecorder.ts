// hooks/useAudioRecorder.ts
import { useState, useRef, useCallback } from 'react';

/**
 * A hook to record audio from the user's microphone and stream it in chunks.
 * This is designed to work with real-time voice APIs like Hume EVI.
 * @param onAudioChunk - A callback function that will be invoked with a new Blob of audio data periodically.
 */
export const useAudioRecorder = (onAudioChunk: (chunk: Blob) => void) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startRecording = useCallback(async () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            console.warn("Recording is already in progress.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const options = { mimeType: 'audio/webm;codecs=opus' };
            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;

            // This event fires periodically with a new chunk of audio data.
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    onAudioChunk(event.data);
                }
            };

            // Start recording and specify a "timeslice" to trigger ondataavailable
            // every 250 milliseconds. This is the key to streaming.
            mediaRecorder.start(250);
            setIsRecording(true);

        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    }, [onAudioChunk]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        // Clean up: stop all microphone tracks to turn off the browser's recording indicator.
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsRecording(false);
    }, []);

    return { isRecording, startRecording, stopRecording };
};
