"use client"

import React, { useRef, useEffect } from "react";
import { Sparkles, MessageCircle } from "lucide-react";
import ChatBubble from "./chatBubble";
import ChatInput from "./chatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatSocket } from "@/hooks/useChatSockets";



export default function ChatView() {
    const { messages, isLoading, isConnected, authStatus, handleSendMessage } = useChatSocket();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages]);

    const getConnectionStatusText = () => {
        if (authStatus === 'pending') return 'Connecting...';
        if (authStatus === 'failed') return 'Authentication Failed';
        return isConnected ? 'Connected' : 'Disconnected';
    };
    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
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
                {/* Optional: Show connection status for better UX */}
                <p className={`text-xs mt-1 font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </p>
            </div>

            <div className="flex-1 relative">
                <ScrollArea ref={scrollAreaRef} className="h-full">
                    <div className="px-4 pb-4">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <div className="p-4 rounded-full bg-gradient-to-r from-yellow-400/10 to-pink-400/10 mb-4">
                                    <MessageCircle className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h3>
                                <p className="text-gray-600 text-sm max-w-md mb-6">
                                    I'm here to listen. Share what's on your mind, or select a prompt to begin.
                                </p>
                                {/* Merged Starter Prompt Bubbles */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg w-full">
                                    <button
                                        onClick={() => handleSendMessage("I'm feeling overwhelmed today")}
                                        className="p-3 text-left rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 transition-colors"
                                    >
                                        <div className="text-sm font-medium text-gray-900">Feeling overwhelmed</div>
                                        <div className="text-xs text-gray-600">Let's talk about it</div>
                                    </button>
                                    <button
                                        onClick={() => handleSendMessage("How can I better understand my emotions?")}
                                        className="p-3 text-left rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 transition-colors"
                                    >
                                        <div className="text-sm font-medium text-gray-900">Understanding emotions</div>
                                        <div className="text-xs text-gray-600">Get insights</div>
                                    </button>
                                    <button
                                        onClick={() => handleSendMessage("I want to improve my mood")}
                                        className="p-3 text-left rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 transition-colors"
                                    >
                                        <div className="text-sm font-medium text-gray-900">Improve my mood</div>
                                        <div className="text-xs text-gray-600">Find strategies</div>
                                    </button>
                                    <button
                                        onClick={() => handleSendMessage("Tell me about emotional patterns")}
                                        className="p-3 text-left rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 transition-colors"
                                    >
                                        <div className="text-sm font-medium text-gray-900">Emotional patterns</div>
                                        <div className="text-xs text-gray-600">Learn more</div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {messages.map((message, index) => (
                                    <ChatBubble key={index} message={message} />
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 mb-4">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        </div>
                                        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-4 py-3">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}/>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}/>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Disable input if not connected */}
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading || !isConnected} />
        </div>
    );
}
