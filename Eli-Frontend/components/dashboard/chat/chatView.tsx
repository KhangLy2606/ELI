"use client"

import { useRef, useEffect, useState } from "react"
import { Sparkles, Mic, Loader2, Send } from "lucide-react"

import ChatBubble from "./chatBubble"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { AutoResizeTextarea } from "@/components/ui/autoresize-text"
import { useEviSocket } from "@/hooks/useEviSocket"
import { useAuthContext } from "@/context/authContext"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { cn } from "@/lib/utils"

export default function ChatView() {
    const { selectedProfile, isLoading: isAuthLoading } = useAuthContext();
    const [isRecording, setIsRecording] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [textInput, setTextInput] = useState(""); // State for the text input

    const {
        chatHistory,
        isConnected,
        isAssistantSpeaking,
        error,
        sendTextInput,
        sendAudioInput,
    } = useEviSocket({
        profileId: selectedProfile?.id ?? null,
        // NOTE: Using a hardcoded configId as in the original file
        configId: "43fe135b-3036-4233-b0e1-dd0fa1b66f7f",
    });

    // --- Audio Recording Logic ---
    const { startRecording, stopRecording } = useAudioRecorder((blob: Blob) => {
        if (isConnected) {
            sendAudioInput(blob);
        }
    });

    // --- Auto-scroll Effect ---
    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [chatHistory]);

    // --- Text Input Handlers ---
    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (textInput.trim() && !isLoading) {
            sendTextInput(textInput.trim());
            setTextInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleTextSubmit(e as unknown as React.FormEvent);
        }
    };

    // --- Combined Loading State ---
    const isLoading = isAssistantSpeaking || !isConnected;

    // --- UI State & Handlers ---
    if (isAuthLoading) {
        return (
            <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto items-center justify-center">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <p className="text-gray-600 mt-2">Authenticating session...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Chat with{" "}
                        <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">ELI</span>
                    </h1>
                </div>
                <p className="text-gray-600 text-sm">Your empathetic AI companion for emotional insights and support</p>
                <p className={`text-xs mt-1 font-medium ${isConnected ? "text-green-600" : "text-red-600"}`}>
                    {error ? `Error: ${error}` : isConnected ? "Connected" : "Disconnected"}
                </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 relative">
                <ScrollArea ref={scrollAreaRef} className="h-full">
                    <div className="px-4 pb-4">
                        {chatHistory.length === 0 && !isAssistantSpeaking ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <div className="p-4 rounded-full bg-gradient-to-r from-yellow-400/10 to-pink-400/10 mb-4">
                                    <Mic className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h3>
                                <p className="text-gray-600 text-sm max-w-md">
                                    I'm here to listen. Use the microphone to talk, or send a text message.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {chatHistory.map((message, index) => (
                                    <ChatBubble key={index} message={message} />
                                ))}
                                {isAssistantSpeaking && (
                                    <div className="flex gap-3 mb-4">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* --- Integrated Text and Voice Input Bar --- */}
            <div className="border-t border-gray-200/50 bg-white/90 backdrop-blur-md p-4">
                <div className="flex gap-3 items-end">
                    {/* Text Input Form */}
                    <form onSubmit={handleTextSubmit} className="flex-1 flex gap-3 items-end">
                        <div className="flex-1 relative">
                            <AutoResizeTextarea
                                value={textInput}
                                onChange={setTextInput}
                                onKeyDown={handleKeyDown}
                                placeholder="Share what's on your mind..."
                                className={cn(
                                    "w-full rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm",
                                    "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                )}
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!textInput.trim() || isLoading}
                            className="h-12 w-12 rounded-2xl bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white shadow-lg flex-shrink-0"
                        >
                            {isLoading && !isAssistantSpeaking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                    </form>

                </div>
            </div>
        </div>
    )
}
