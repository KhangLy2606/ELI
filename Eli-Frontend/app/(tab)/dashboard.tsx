"use client"

import { Home, Bell, Settings } from "lucide-react"
// CORRECTED IMPORT PATHS
import MoodStatusDisplay from "../../components/dashboard/MoodStatusDisplay"
import SummaryCard from "../../components/dashboard/SummaryCard"
import DashboardNavLink from "../../components/dashboard/DashboardNavLink"

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="px-6 pt-12 pb-20">
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

                {/* Mood Status Display */}
                <MoodStatusDisplay />

                {/* Summary Card */}
                <SummaryCard />

                {/* Navigation Links */}
                <div className="space-y-0">
                    <DashboardNavLink label="Mood Trends" onClick={() => console.log("Navigate to Mood Trends")} />
                    <DashboardNavLink label="View/Edit Notes" onClick={() => console.log("Navigate to View/Edit Notes")} />
                    <DashboardNavLink label="Notifications" onClick={() => console.log("Navigate to Notifications")} />
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="flex items-center justify-around py-2">
                    <button className="flex flex-col items-center py-2 px-4">
                        <Home className="w-6 h-6 text-blue-500" />
                        <span className="text-xs text-blue-500 mt-1">home</span>
                    </button>
                    <button className="flex flex-col items-center py-2 px-4">
                        <Bell className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1">notifications</span>
                    </button>
                    <button className="flex flex-col items-center py-2 px-4">
                        <Settings className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1">settings</span>
                    </button>
                </div>
            </div>
        </div>
    )
}