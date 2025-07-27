"use client"

import ChatView from "@/components/dashboard/chat/chatView";
import { AuthProvider } from "@/context/authContext";
/**
 * ChatPage serves as the route segment for `/dashboard/chat`.
 * It renders the main ChatView component which contains the entire chat interface.
 */
export default function ChatPage() {
    return (
        <AuthProvider>
            <ChatView />
        </AuthProvider>
    );
}