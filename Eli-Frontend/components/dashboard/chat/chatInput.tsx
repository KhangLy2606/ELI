"use client"

import type React from "react"

import { useState } from "react"
import { Send, Loader2, Mic, PhoneOff } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AutoResizeTextarea } from "@/components/ui/autoresize-text"
import { cn } from "@/lib/utils"

interface ChatInputProps {
    mode: "chat" | "voice"
    onSendMessage: (message: string) => void
    isLoading: boolean
    onStartRecording: () => void
    onStopRecording: () => void
    onEndCall: () => void
    isRecording: boolean
}

export default function ChatInput({
                                      mode,
                                      onSendMessage,
                                      isLoading,
                                      onStartRecording,
                                      onStopRecording,
                                      onEndCall,
                                      isRecording,
                                  }: ChatInputProps) {
    const [input, setInput] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() && !isLoading && mode === "chat") {
            onSendMessage(input.trim())
            setInput("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && mode === "chat") {
            e.preventDefault()
            handleSubmit(e as unknown as React.FormEvent)
        }
    }

    const handleMicrophoneClick = () => {
        if (isRecording) {
            onStopRecording()
        } else {
            onStartRecording()
        }
    }

    return (
        <div className="border-t border-gray-200/50 bg-white/90 backdrop-blur-md p-4">
            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                <div className="flex-1 relative">
                    <AutoResizeTextarea
                        value={input}
                        onChange={setInput}
                        onKeyDown={handleKeyDown}
                        placeholder={mode === "voice" ? "Voice input is active..." : "Share what's on your mind..."}
                        className={cn(
                            "w-full rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm",
                            "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                        )}
                        disabled={isLoading || mode === "voice"}
                    />
                </div>

                {mode === "chat" ? (
                    // Chat Mode - Send Button
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className="h-12 w-12 rounded-2xl bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white shadow-lg"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                ) : (
                    // Voice Mode - Call Controls
                    <div className="flex gap-2 items-end">
                        {/* Microphone Button */}
                        <motion.button
                            type="button"
                            onClick={handleMicrophoneClick}
                            className={cn(
                                "h-16 w-16 rounded-full flex items-center justify-center transition-all duration-200",
                                isRecording ? "bg-red-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                            )}
                            animate={isRecording ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                            transition={
                                isRecording
                                    ? {
                                        duration: 1.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeInOut",
                                    }
                                    : {}
                            }
                        >
                            <Mic className="h-6 w-6" />
                        </motion.button>

                        {/* End Call Button */}
                        <Button
                            type="button"
                            onClick={onEndCall}
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-2xl text-gray-700 hover:bg-gray-100"
                        >
                            <PhoneOff className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </form>
        </div>
    )
}
