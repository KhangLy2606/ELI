"use client"

import React, { useRef, useEffect } from "react";
import { Sparkles, MessageCircle, AlertTriangle } from "lucide-react";
import ChatBubble from "./chatBubble";
import ChatInput from "./chatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEviSocket, ChatMessage } from "@/hooks/useEviSocket";
import { useAuthContext } from "@/context/authContext"; // Import the auth context

export default function ChatView() {
    const { user, isLoading: isAuthLoading } = useAuthContext(); // Get user data from context

    // The EVI socket hook now gets the profileId directly from the authenticated user
    const {
        chatHistory,
        connectionState,
        isConnected,
        isAssistantSpeaking,
        error,
        sendTextInput,
    } = useEviSocket({
        profileId: user?.profileId ?? null, // Use the profileId from the context
        modality: 'chat',
    });

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [chatHistory]);

    // Show a loading screen while authentication is being checked
    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Show an error if no user is logged in
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
                <p>Please log in to start a chat session.</p>
            </div>
        )
    }

    // --- The rest of your component remains largely the same ---
    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Chat with <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">ELI</span></h1>
                </div>
                <p className="text-gray-600 text-sm">Your empathetic AI companion for emotional insights and support</p>
                <p className={`text-xs mt-1 font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {error ? `Error: ${error}` : (isConnected ? 'Connected' : 'Disconnected')}
                </p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 relative">
                <ScrollArea ref={scrollAreaRef} className="h-full">
                    <div className="px-4 pb-4">
                        {chatHistory.length === 0 && !isAssistantSpeaking ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h3>
                                <p className="text-gray-600 text-sm max-w-md">I'm here to listen. Share what's on your mind.</p>
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

            {/* Input */}
            <ChatInput onSendMessage={sendTextInput} isLoading={isAssistantSpeaking || !isConnected} />
        </div>
    );
}
