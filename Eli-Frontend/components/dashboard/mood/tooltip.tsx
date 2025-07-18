"use client"

import type { EmotionBubble } from "./emotionalBubble"

interface TooltipProps {
    hoveredBubble: EmotionBubble | undefined;
    containerRef: React.RefObject<HTMLDivElement>;
}

const Tooltip = ({ hoveredBubble, containerRef }: TooltipProps) => {
    if (!hoveredBubble || !containerRef.current) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const style = {
        left: hoveredBubble.x + containerRect.left,
        top: hoveredBubble.y + containerRect.top - hoveredBubble.radius - 35,
        transform: 'translateX(-50%)',
    };

    return (
        <div className="fixed bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg z-50 pointer-events-none" style={style}>
            {hoveredBubble.name}: {hoveredBubble.score.toFixed(3)}
        </div>
    );
};

export default Tooltip;
