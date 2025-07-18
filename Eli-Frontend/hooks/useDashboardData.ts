// hooks/useDashboardData.ts
import { useState, useEffect } from 'react';

// Define a type for the emotion data for better type safety
type EmotionData = Record<string, number>;

// Define the base URL for your API to avoid repeating it
const API_BASE_URL = 'http://localhost:3001';

export function useDashboardData() {
    // State is managed inside the hook
    const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Authentication token not found. Please log in.");
                }

                const headers = {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                };

                const chatsResponse = await fetch(`${API_BASE_URL}/api/chats`, { headers });
                if (!chatsResponse.ok) throw new Error("Failed to fetch chats.");
                const chats = await chatsResponse.json();

                if (chats.length === 0) {
                    setEmotionData({}); // Set to empty object if no chats exist
                    return;
                }

                const mostRecentChatId = chats[0].id;
                const analyticsResponse = await fetch(`${API_BASE_URL}/api/chats/${mostRecentChatId}/analytics`, { headers });
                if (!analyticsResponse.ok) throw new Error("Failed to fetch analytics.");
                const analytics = await analyticsResponse.json();

                const formattedData = analytics.reduce((acc: EmotionData, item: { emotion: string; average_score: string }) => {
                    acc[item.emotion] = parseFloat(item.average_score);
                    return acc;
                }, {});

                setEmotionData(formattedData);

            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return { emotionData, isLoading, error };
}