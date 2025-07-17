import React, { useState } from 'react';
import { type LucideProps } from 'lucide-react';

interface SettingsToggleProps {
    label: string;
    icon: React.ReactElement<LucideProps>;
    initialValue?: boolean;
}

export default function SettingsToggle({ label, icon, initialValue = false }: SettingsToggleProps) {
    const [isEnabled, setIsEnabled] = useState(initialValue);

    return (
        <div className="w-full bg-white p-4 flex items-center justify-between">
            <div className="flex items-center">
                {React.cloneElement(icon, { className: "w-6 h-6 text-gray-500 mr-4" })}
                <span className="text-gray-900 font-medium">{label}</span>
            </div>

            {/* Custom Toggle Switch */}
            <button
                onClick={() => setIsEnabled(!isEnabled)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                    isEnabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
            >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
            </button>
        </div>
    );
}
