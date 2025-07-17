import { ChevronRight } from "lucide-react"

export default function SummaryCard() {
    return (
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">Summary</h3>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquet pharetra sollicitudin. Cras consectetur
    arcu sed rhoncus finibus. Nunc velit est, euismod eu tortor at, efficitur varius sapien. Sed placerat, massa a
    molestie dapibus, ...
    </p>
    </div>
)
}
