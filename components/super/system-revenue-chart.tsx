"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Generate random data for the chart - monthly data for the year
const generateMonthlyData = () => {
  const data = []
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Current month
  const currentMonth = new Date().getMonth()

  // Generate data for the past 12 months
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - 11 + i) % 12
    let mutableMonthIndex = monthIndex
    if (mutableMonthIndex < 0) mutableMonthIndex += 12

    const month = months[mutableMonthIndex]
    const year = new Date().getFullYear() - (mutableMonthIndex > currentMonth ? 1 : 0)

    data.push({
      name: `${month} ${year}`,
      totalRevenue: Math.floor(Math.random() * 100000) + 50000,
      platformFees: Math.floor(Math.random() * 20000) + 10000,
    })
  }

  return data
}

export function SystemRevenueChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(generateMonthlyData())
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "none",
            }}
          />
          <Legend />
          <Bar dataKey="totalRevenue" name="Total Revenue" fill="hsl(210 76% 49%)" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="platformFees" name="Platform Fees" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
