export default function MoodStatusDisplay() {
    return (
        <div className="relative flex items-center justify-center h-32 mb-6">
            {/* Sad circle - left */}
            <div className="absolute left-8 w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-800 z-10">
        Sad
        </div>

    {/* Angry circle - center (larger) */}
    <div className="absolute w-24 h-24 bg-red-400 rounded-full flex items-center justify-center text-sm font-medium text-gray-800 z-20">
        Angry
        </div>

    {/* Happy circle - right */}
    <div className="absolute right-8 w-20 h-20 bg-pink-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-800 z-10">
        Happy
        </div>
        </div>
)
}
