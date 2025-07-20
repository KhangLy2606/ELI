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
            className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm flex items-center justify-between hover:bg-white/90 transition-all duration-200"
        >
            <span className="text-gray-800 font-medium">{label}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
    )
}
