"use client"

import { ChevronRight, type LightbulbIcon as LucideProps } from "lucide-react"
import React from "react"

interface SettingsLinkProps {
    label: string
    icon: React.ReactElement<LucideProps>
    onClick?: () => void
}

export default function SettingsLink({ label, icon, onClick }: SettingsLinkProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white/60 backdrop-blur-sm p-3 flex items-center justify-between hover:bg-white/80 transition-colors rounded-xl border border-gray-200/30"
        >
            <div className="flex items-center">
                {React.cloneElement(icon, { className: "w-5 h-5 text-gray-500 mr-3" })}
                <span className="text-gray-900 font-medium text-sm">{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
    )
}
