"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Joy", value: 35, color: "#fbbf24" },
  { name: "Calm", value: 28, color: "#60a5fa" },
  { name: "Engagement", value: 20, color: "#34d399" },
  { name: "Energy", value: 12, color: "#fb7185" },
  { name: "Other", value: 5, color: "#a78bfa" },
]

export function EmotionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
