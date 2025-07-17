import { ChevronRight, type LucideProps } from 'lucide-react';
import React from 'react';

interface SettingsLinkProps {
    label: string;
    icon: React.ReactElement<LucideProps>;
    onClick?: () => void;
}

export default function SettingsLink({ label, icon, onClick }: SettingsLinkProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center">
                {/* We clone the icon to add standard styling */}
                {React.cloneElement(icon, { className: "w-6 h-6 text-gray-500 mr-4" })}
                <span className="text-gray-900 font-medium">{label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
    );
}
