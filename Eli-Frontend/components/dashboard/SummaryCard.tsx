import { ChevronRight } from "lucide-react"

export default function SummaryCard() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Summary
                </h3>
                <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
                Your emotional journey shows strong contemplative patterns with balanced positive engagement. Recent insights
                suggest increased self-awareness and emotional clarity.
            </p>
        </div>
    )
}
