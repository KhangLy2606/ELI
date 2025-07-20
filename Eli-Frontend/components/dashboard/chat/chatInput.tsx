"use client"

import type React from "react"

import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AutoResizeTextarea } from "@/components/ui/autoresize-text"
import { cn } from "@/lib/utils"

interface ChatInputProps {
    onSendMessage: (message: string) => void
    isLoading: boolean
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
    const [input, setInput] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim())
            setInput("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as React.FormEvent)
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
                    disabled={!input.trim() || isLoading}
                    className="h-12 w-12 rounded-2xl bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white shadow-lg"
                >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
            </form>
        </div>
    )
}
