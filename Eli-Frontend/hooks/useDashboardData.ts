"use client"

import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:3001";
const MAX_CHATS_TO_AVERAGE = 5;

// Define the structure of the analytics response from the API
interface EmotionAnalytics {
    emotion: string;
    average_score: number;
}

/**
 * Custom hook to fetch and process dashboard data.
 *
 * It fetches a list of all chats, finds the last 5 with emotion data,
 * and calculates the average score for each emotion across those chats.
 */
export function useDashboardData() {
    const [emotionData, setEmotionData] = useState<Record<string, number> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAndProcessData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Authentication token not found.");
                }
                const headers = { Authorization: `Bearer ${token}` };

                const chatsResponse = await fetch(`${API_BASE_URL}/api/chats`, { headers });
                if (!chatsResponse.ok) {
                    throw new Error("Failed to fetch chats.");
                }
                const allChats = await chatsResponse.json();

                if (allChats.length === 0) {
                    setEmotionData({});
                    return;
                }

                // Iterate chats to find the last 5 with emotion data
                const emotionsFromRecentChats: EmotionAnalytics[][] = [];
                for (const chat of allChats) {
                    if (emotionsFromRecentChats.length >= MAX_CHATS_TO_AVERAGE) {
                        break;
                    }

                    const analyticsResponse = await fetch(`${API_BASE_URL}/api/chats/${chat.id}/analytics`, { headers });
                    if (analyticsResponse.ok) {
                        const analytics: EmotionAnalytics[] = await analyticsResponse.json();
                        if (analytics.length > 0) {
                            emotionsFromRecentChats.push(analytics);
                        }
                    }
                }

                if (emotionsFromRecentChats.length === 0) {
                    setEmotionData({});
                    return;
                }

                //  Aggregate and average the emotion scores
                const emotionAggregates: Record<string, { totalScore: number; count: number }> = {};

                emotionsFromRecentChats.flat().forEach(({ emotion, average_score }) => {
                    if (!emotionAggregates[emotion]) {
                        emotionAggregates[emotion] = { totalScore: 0, count: 0 };
                    }
                    emotionAggregates[emotion].totalScore += average_score;
                    emotionAggregates[emotion].count += 1;
                });

                // Calculate the final average for each emotion
                const averagedEmotions: Record<string, number> = {};
                for (const emotion in emotionAggregates) {
                    const { totalScore, count } = emotionAggregates[emotion];
                    averagedEmotions[emotion] = totalScore / count;
                }

                setEmotionData(averagedEmotions);

            } catch (err: any) {
                setError(err.message || "An unknown error occurred.");
                setEmotionData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndProcessData();
    }, []);

    return { emotionData, isLoading, error };
}