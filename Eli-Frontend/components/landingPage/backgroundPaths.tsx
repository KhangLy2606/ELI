"use client"

import { motion } from "framer-motion"

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
    }))

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
                <title>Background Paths</title>
                {/* 1. Define the gradient */}
                <defs>
                    <linearGradient id="path-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#FBBF24", stopOpacity: 0.5 }} />
                        <stop offset="100%" style={{ stopColor: "#F472B6", stopOpacity: 0.5 }} />
                    </linearGradient>
                </defs>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        // 2. Apply the gradient by URL
                        stroke="url(#path-gradient)"
                        strokeWidth={path.width}
                        // 3. Keep the overall opacity animation but remove strokeOpacity
                        initial={{ pathLength: 0.3, opacity: 0 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0, 0.4, 0], // Animation fades path in and out
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    )
}

// The main component to be exported and used in other files.
export default function BackgroundPaths() {
    return (
        <div className="absolute inset-0 z-0">
            <FloatingPaths position={1} />
            <FloatingPaths position={-1} />
        </div>
    )
}
