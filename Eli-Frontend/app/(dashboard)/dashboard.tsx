"use client"

import { useDashboardData } from "@/hooks/useDashboardData"; // Adjust the import path
import MoodStatusDisplay from "@/components/dashboard/MoodStatusDisplay";
import SummaryCard from "@/components/dashboard/SummaryCard";
import DashboardNavLink from "@/components/dashboard/DashboardNavLink";

export default function Dashboard() {
    // Call the custom hook to get data and state
    const { emotionData, isLoading, error } = useDashboardData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
            <main className="max-w-2xl mx-auto px-4 pt-12 pb-28">
                <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                    How you're{" "}
                    <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                        feeling
                    </span>
                </h1>

                {/* The rendering logic remains the same */}
                {isLoading && <p className="text-center">Loading your data...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {emotionData && <MoodStatusDisplay emotionFeatures={emotionData} />}

                <div className="space-y-3 mt-8">
                    <SummaryCard />
                    <DashboardNavLink label="Mood Trends" />
                    <DashboardNavLink label="View/Edit Notes" />
                    <DashboardNavLink label="Notifications" />
                </div>
            </main>
        </div>
    )
}