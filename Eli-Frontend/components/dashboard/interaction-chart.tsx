"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { day: "Mon", joy: 65, calm: 78, engagement: 82, energy: 58 },
  { day: "Tue", joy: 70, calm: 75, engagement: 85, energy: 62 },
  { day: "Wed", joy: 68, calm: 80, engagement: 78, energy: 55 },
  { day: "Thu", joy: 72, calm: 82, engagement: 88, energy: 65 },
  { day: "Fri", joy: 75, calm: 85, engagement: 90, energy: 68 },
  { day: "Sat", joy: 78, calm: 88, engagement: 85, energy: 70 },
  { day: "Sun", joy: 73, calm: 83, engagement: 82, energy: 63 },
]

export function InteractionChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="day" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          formatter={(value, name) => [`${value}%`, name]}
          labelStyle={{ color: "#1e293b" }}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend />
        <Area type="monotone" dataKey="joy" stackId="1" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.6} name="Joy" />
        <Area
          type="monotone"
          dataKey="calm"
          stackId="1"
          stroke="#60a5fa"
          fill="#60a5fa"
          fillOpacity={0.6}
          name="Calm"
        />
        <Area
          type="monotone"
          dataKey="engagement"
          stackId="1"
          stroke="#34d399"
          fill="#34d399"
          fillOpacity={0.6}
          name="Engagement"
        />
        <Area
          type="monotone"
          dataKey="energy"
          stackId="1"
          stroke="#fb7185"
          fill="#fb7185"
          fillOpacity={0.6}
          name="Energy"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
