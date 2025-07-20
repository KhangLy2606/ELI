"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Bot } from "lucide-react"

interface ChatBubbleProps {
    message: {
        role: "user" | "assistant"
        content: string
    }
}

export default function ChatBubble({ message }: ChatBubbleProps) {
    const isUser = message.role === "user"

    return (
        <div className={cn("flex gap-3 mb-4", isUser ? "flex-row-reverse" : "flex-row")}>
            <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback
                    className={cn(
                        "text-white text-sm",
                        isUser ? "bg-gradient-to-br from-yellow-400 to-pink-400" : "bg-gradient-to-br from-purple-500 to-blue-500",
                    )}
                >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
            </Avatar>

            <div
                className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    isUser
                        ? "bg-gradient-to-r from-yellow-400 to-pink-400 text-white"
                        : "bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-800",
                )}
            >
                <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
        </div>
    )
}
