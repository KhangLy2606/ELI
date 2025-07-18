import { ChevronRight } from "lucide-react"

export default function SummaryCard() {
    return (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-4 mb-6 shadow-lg border border-purple-100">
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
