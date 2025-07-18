"use client"

import type React from "react"
import { useRef, useState } from "react"
import { useEmotionBubbles } from "./mood/emotionalBubble"
import Bubble from "./mood/bubble"
import Tooltip from "./mood/tooltip"

interface MoodStatusDisplayProps {
    emotionFeatures: Record<string, number>
}

export default function MoodStatusDisplay({ emotionFeatures }: MoodStatusDisplayProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [hoveredBubbleId, setHoveredBubbleId] = useState<string | null>(null)
    const [isInteracting, setIsInteracting] = useState(false)
    const mousePos = useRef({ x: -9999, y: -9999 })

    const bubbles = useEmotionBubbles(emotionFeatures, containerRef, mousePos, isInteracting);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isInteracting) setIsInteracting(true);
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        }
    }

    const handleMouseLeave = () => {
        mousePos.current = { x: -9999, y: -9999 };
    }

    const hoveredBubble = bubbles.find(b => b.id === hoveredBubbleId);

    return (
        <div className="relative w-full h-96 md:h-[500px] mb-8 rounded-2xl overflow-hidden">
            <div
                ref={containerRef}
                className="relative w-full h-full"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {bubbles.map((bubble) => (
                    <Bubble
                        key={bubble.id}
                        bubble={bubble}
                        isHovered={hoveredBubbleId === bubble.id}
                        onMouseEnter={setHoveredBubbleId}
                        onMouseLeave={() => setHoveredBubbleId(null)}
                    />
                ))}
                <Tooltip hoveredBubble={hoveredBubble} containerRef={containerRef} />
            </div>
        </div>
    )
}
