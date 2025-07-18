"use client"

import { ChevronRight } from "lucide-react"

interface DashboardNavLinkProps {
    label: string
    onClick?: () => void
}

export default function DashboardNavLink({ label, onClick }: DashboardNavLinkProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-gradient-to-r from-white to-purple-50 rounded-2xl p-4 mb-3 shadow-lg border border-purple-100 flex items-center justify-between hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
        >
            <span className="text-gray-800 font-medium">{label}</span>
            <ChevronRight className="w-5 h-5 text-purple-400" />
        </button>
    )
}
