import { UserCircle2 } from 'lucide-react';

export default function ProfileHeader() {
    return (
        <div className="flex flex-col items-center pt-8 pb-6 bg-white rounded-b-3xl shadow-sm mb-6">
            {/* User Avatar */}
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <UserCircle2 className="w-16 h-16 text-gray-400" />
            </div>

            {/* User Name */}
            <h2 className="text-2xl font-bold text-gray-900">Alex Doe</h2>

            {/* User Email */}
            <p className="text-sm text-gray-500 mt-1">alex.doe@example.com</p>
        </div>
    );
}
