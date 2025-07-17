export default function AuroraBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-blue-400/30 via-purple-400/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-2xl animate-pulse"></div>
        </div>
    )
}
