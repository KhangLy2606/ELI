"use client"

import { useEffect, useRef, useState } from "react"
import { getEmotionDetails } from "@/data/services/emotions.service"; // Import the new service function
import { emotionColorStyles } from "@/data/models/emotions.model"; // Assuming this is in your model file

// --- Type Definition ---
export interface EmotionBubble {
    id: string;
    name: string;
    score: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    isLargest: boolean;
    emoji: string;
}

// --- Custom Hook for Physics and State Management ---
export const useEmotionBubbles = (
    emotionFeatures: Record<string, number>,
    containerRef: React.RefObject<HTMLDivElement>,
    mousePos: React.RefObject<{ x: number, y: number }>,
    isInteracting: boolean
) => {
    const [bubbles, setBubbles] = useState<EmotionBubble[]>([]);
    const animationRef = useRef<number>();

    // Initialization Effect - Now much cleaner
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const sortedEmotions = Object.entries(emotionFeatures).sort(([, a], [, b]) => b - a);
        if (!sortedEmotions.length) return;

        const { offsetWidth: containerWidth, offsetHeight: containerHeight } = container;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;

        const bubblesData: EmotionBubble[] = [];

        // Process the largest bubble
        const [largestName, largestScore] = sortedEmotions[0];
        const largestDetails = getEmotionDetails(largestName);
        const largestRadius = 20 + (largestScore * 80);

        bubblesData.push({
            id: largestName,
            name: largestName,
            score: largestScore,
            x: centerX,
            y: centerY,
            vx: 0,
            vy: 0,
            radius: largestRadius,
            color: emotionColorStyles[largestDetails.category],
            isLargest: true,
            emoji: largestDetails.emoji,
        });

        // Process smaller bubbles
        const smallerEmotions = sortedEmotions.slice(1);
        const numSmaller = smallerEmotions.length;
        const avgSmallerRadius = smallerEmotions.reduce((acc, [, score]) => acc + (20 + score * 80), 0) / numSmaller || 40;
        const orbitalRadius = largestRadius + avgSmallerRadius + 60;

        smallerEmotions.forEach(([name, score], index) => {
            const details = getEmotionDetails(name);
            const radius = 20 + (score * 80);
            const angle = (2 * Math.PI / numSmaller) * index;
            const x = centerX + orbitalRadius * Math.cos(angle);
            const y = centerY + orbitalRadius * Math.sin(angle);

            bubblesData.push({
                id: name,
                name,
                score,
                x, y,
                vx: 0, vy: 0,
                radius,
                color: emotionColorStyles[details.category],
                isLargest: false,
                emoji: details.emoji,
            });
        });

        setBubbles(bubblesData);
    }, [emotionFeatures, containerRef]);

    // Physics Animation Loop Effect
    useEffect(() => {
        const animate = () => {
            if (isInteracting) {
                const container = containerRef.current
                if (container) {
                    const { offsetWidth: containerWidth, offsetHeight: containerHeight } = container;
                    const centerX = containerWidth / 2;
                    const centerY = containerHeight / 2;

                    setBubbles((prevBubbles) => {
                        const newBubbles = prevBubbles.map(b => ({ ...b }));

                        newBubbles.forEach((bubble) => {
                            const centeringForce = bubble.isLargest ? 0.0005 : 0.0001;
                            bubble.vx += (centerX - bubble.x) * centeringForce;
                            bubble.vy += (centerY - bubble.y) * centeringForce;

                            const dxMouse = bubble.x - mousePos.current.x;
                            const dyMouse = bubble.y - mousePos.current.y;
                            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                            if (distMouse < 150) {
                                const force = (1 - distMouse / 150) * 0.8;
                                bubble.vx += (dxMouse / distMouse) * force;
                                bubble.vy += (dyMouse / distMouse) * force;
                            }

                            newBubbles.forEach((other) => {
                                if (bubble.id !== other.id) {
                                    const dx = other.x - bubble.x;
                                    const dy = other.y - bubble.y;
                                    const distance = Math.sqrt(dx * dx + dy * dy);
                                    const minDistance = bubble.radius + other.radius;
                                    if (distance < minDistance) {
                                        const overlap = minDistance - distance;
                                        const force = overlap * 0.015;
                                        const angle = Math.atan2(dy, dx);
                                        bubble.vx -= Math.cos(angle) * force;
                                        bubble.vy -= Math.sin(angle) * force;
                                        other.vx += Math.cos(angle) * force;
                                        other.vy += Math.sin(angle) * force;
                                    }
                                }
                            });
                        });

                        return newBubbles.map((bubble) => {
                            // Apply damping
                            bubble.vx *= 0.98;
                            bubble.vy *= 0.98;

                            // Update position
                            bubble.x += bubble.vx;
                            bubble.y += bubble.vy;

                            // Boundary collision detection
                            const wallDamping = 0.75; // How much velocity is lost on bounce

                            // Left wall
                            if (bubble.x - bubble.radius < 0) {
                                bubble.x = bubble.radius; // Clamp position
                                bubble.vx *= -wallDamping; // Reverse velocity
                            }
                            // Right wall
                            if (bubble.x + bubble.radius > containerWidth) {
                                bubble.x = containerWidth - bubble.radius; // Clamp position
                                bubble.vx *= -wallDamping; // Reverse velocity
                            }
                            // Top wall
                            if (bubble.y - bubble.radius < 0) {
                                bubble.y = bubble.radius; // Clamp position
                                bubble.vy *= -wallDamping; // Reverse velocity
                            }
                            // Bottom wall
                            if (bubble.y + bubble.radius > containerHeight) {
                                bubble.y = containerHeight - bubble.radius; // Clamp position
                                bubble.vy *= -wallDamping; // Reverse velocity
                            }

                            return bubble;
                        });
                    });
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isInteracting, containerRef, mousePos]);


    return bubbles;
}