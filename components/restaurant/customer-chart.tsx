"use client"

import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

// Generate random data for the chart
const generateData = () => {
  return [
    {
      name: "18-24",
      value: Math.floor(Math.random() * 20) + 10,
      color: "#1e81d9",
    },
    {
      name: "25-34",
      value: Math.floor(Math.random() * 30) + 20,
      color: "#3498db",
    },
    {
      name: "35-44",
      value: Math.floor(Math.random() * 25) + 15,
      color: "#5dade2",
    },
    {
      name: "45-54",
      value: Math.floor(Math.random() * 20) + 10,
      color: "#85c1e9",
    },
    {
      name: "55+",
      value: Math.floor(Math.random() * 15) + 5,
      color: "#aed6f1",
    },
  ]
}

export function CustomerChart() {
  const [data, setData] = useState<{ name: string; value: number; color: string; }[]>([])

  useEffect(() => {
    setData(generateData())
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}%`, "Percentage"]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "none",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
