"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Generate random data for the chart
const generateData = () => {
  const timeSlots = ["6-8 AM", "8-10 AM", "10-12 PM", "12-2 PM", "2-4 PM", "4-6 PM", "6-8 PM", "8-10 PM", "10-12 AM"]

  return timeSlots.map((time) => ({
    time,
    orders: Math.floor(Math.random() * 80) + 20,
    revenue: Math.floor(Math.random() * 2000) + 500,
  }))
}

export function SalesChart() {
  const [data, setData] = useState<{ time: string; orders: number; revenue: number; }[]>([])

  useEffect(() => {
    setData(generateData())
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
          <Tooltip
            formatter={(value, name) => [
              name === "orders" ? value : `$${value}`,
              name === "orders" ? "Orders" : "Revenue",
            ]}
            labelFormatter={(label) => `Time: ${label}`}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "none",
            }}
          />
          <Bar dataKey="orders" fill="hsl(210 76% 49%)" radius={[4, 4, 0, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
