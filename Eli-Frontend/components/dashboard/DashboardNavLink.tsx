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
    className="w-full bg-white rounded-2xl p-4 mb-3 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
    <span className="text-gray-900 font-medium">{label}</span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
)
}
