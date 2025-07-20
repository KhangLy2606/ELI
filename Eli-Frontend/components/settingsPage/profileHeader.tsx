import { UserCircle2 } from "lucide-react"

export default function ProfileHeader() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex flex-col items-center text-center">
                {/* User Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
                    <UserCircle2 className="w-16 h-16 text-white" />
                </div>

                {/* User Name */}
                <h2 className="text-2xl font-bold text-gray-900">Alex Doe</h2>

                {/* User Email */}
                <p className="text-sm text-gray-500 mt-1">alex.doe@example.com</p>
            </div>
        </div>
    )
}
