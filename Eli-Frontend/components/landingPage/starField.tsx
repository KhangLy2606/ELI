"use client"

import { useEffect, useRef } from "react"

export default function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Generate stars
        const stars: Array<{ x: number; y: number; size: number; opacity: number; twinkle: number }> = []
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkle: Math.random() * 0.02 + 0.01,
            })
        }

        let animationId: number
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            stars.forEach((star) => {
                star.opacity += star.twinkle
                if (star.opacity > 1 || star.opacity < 0.2) {
                    star.twinkle *= -1
                }

                ctx.beginPath()
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
                ctx.fill()
            })

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
    )
}
