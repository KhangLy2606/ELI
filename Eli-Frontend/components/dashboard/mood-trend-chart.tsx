"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "6 AM", mood: 6.2 },
  { time: "9 AM", mood: 7.1 },
  { time: "12 PM", mood: 7.8 },
  { time: "3 PM", mood: 8.2 },
  { time: "6 PM", mood: 7.5 },
  { time: "9 PM", mood: 6.8 },
]

export function MoodTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="time" stroke="#64748b" />
        <YAxis domain={[0, 10]} stroke="#64748b" />
        <Tooltip
          formatter={(value) => [`${value}/10`, "Mood Score"]}
          labelStyle={{ color: "#1e293b" }}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Line
          type="monotone"
          dataKey="mood"
          stroke="url(#gradient)"
          strokeWidth={3}
          dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "#7c3aed" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </LineChart>
    </ResponsiveContainer>
  )
}
