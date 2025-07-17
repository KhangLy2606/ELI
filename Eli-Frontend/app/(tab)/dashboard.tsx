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

        </div>
    )
}