"use client"

import { memo } from "react"
import type { EmotionBubble } from "./emotionalBubble"

interface BubbleProps {
    bubble: EmotionBubble;
    isHovered: boolean;
    onMouseEnter: (id: string) => void;
    onMouseLeave: () => void;
}

const Bubble = memo(({ bubble, isHovered, onMouseEnter, onMouseLeave }: BubbleProps) => {
    return (
        <div
            key={bubble.id}
            className={`absolute rounded-full ${bubble.color} bg-opacity-80 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer transition-transform duration-200 ${
                isHovered ? "scale-110 bg-opacity-100 z-10" : ""
            }`}
            style={{
                left: bubble.x,
                top: bubble.y,
                width: bubble.radius * 2,
                height: bubble.radius * 2,
                transform: `translate(-50%, -50%)`,
            }}
            onMouseEnter={() => onMouseEnter(bubble.id)}
            onMouseLeave={onMouseLeave}
        >
            <span
                className="select-none"
                style={{ fontSize: bubble.radius * 0.8 }} // Scale emoji size with bubble radius
            >
                {bubble.emoji}
            </span>
        </div>
    );
});
Bubble.displayName = 'Bubble';

export default Bubble;
