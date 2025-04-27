"use client"

import type React from "react"

import { useState } from "react"
import { ArrowDown, ArrowUp, Calendar, ChevronDown, Download, Filter, LineChart, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueChart } from "@/components/restaurant/revenue-chart"

// Import additional chart components
import { SalesChart } from "@/components/restaurant/sales-chart"
import { CustomerChart } from "@/components/restaurant/customer-chart"
import { CategoryChart } from "@/components/restaurant/category-chart"

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30days")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Analyze your restaurant's performance and identify trends.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs defaultValue={dateRange} onValueChange={setDateRange} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="7days">7 Days</TabsTrigger>
            <TabsTrigger value="30days">30 Days</TabsTrigger>
            <TabsTrigger value="90days">90 Days</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Sales"
          value="$45,231.89"
          description="+20.1% from previous period"
          trend="up"
          icon={LineChart}
        />
        <MetricCard
          title="Average Order Value"
          value="$42.50"
          description="+5.2% from previous period"
          trend="up"
          icon={LineChart}
        />
        <MetricCard
          title="Customer Retention"
          value="68%"
          description="-2.4% from previous period"
          trend="down"
          icon={Users}
        />
        <MetricCard
          title="New Customers"
          value="324"
          description="+12.3% from previous period"
          trend="up"
          icon={Users}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Daily revenue for the selected period</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>View Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Show Target</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Show Previous Period</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales by Time of Day</CardTitle>
              <CardDescription>Order distribution throughout the day</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Customer Demographics</CardTitle>
              <CardDescription>Customer age and visit frequency</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <CustomerChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Revenue distribution by menu category</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Performing Items</CardTitle>
            <CardDescription>Your best selling menu items for the selected period</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-40 lg:w-60">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search items..." className="w-full pl-8 bg-background" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left text-sm font-medium">Item Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Units Sold</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Revenue</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Profit Margin</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-4 text-sm">{item.name}</td>
                    <td className="py-3 px-4 text-sm">{item.category}</td>
                    <td className="py-3 px-4 text-sm">{item.unitsSold}</td>
                    <td className="py-3 px-4 text-sm">{item.revenue}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center">
                        <span className={item.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                          {item.profitMargin}
                        </span>
                        {item.trend === "up" ? (
                          <ArrowUp className="ml-1 h-4 w-4 text-emerald-500" />
                        ) : (
                          <ArrowDown className="ml-1 h-4 w-4 text-rose-500" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  description: string
  trend: "up" | "down" | "neutral"
  icon: React.ElementType
}

function MetricCard({ title, value, description, trend, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {trend === "up" && <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />}
          {trend === "down" && <ArrowDown className="mr-1 h-3 w-3 text-rose-500" />}
          <span className={cn(trend === "up" && "text-emerald-500", trend === "down" && "text-rose-500")}>
            {description}
          </span>
        </p>
      </CardContent>
    </Card>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

const topItems = [
  {
    id: 1,
    name: "Truffle Pasta",
    category: "Main Course",
    unitsSold: 142,
    revenue: "$3,548.58",
    profitMargin: "68%",
    trend: "up",
  },
  {
    id: 2,
    name: "Beef Wellington",
    category: "Main Course",
    unitsSold: 98,
    revenue: "$3,773.00",
    profitMargin: "72%",
    trend: "up",
  },
  {
    id: 3,
    name: "Tiramisu",
    category: "Dessert",
    unitsSold: 87,
    revenue: "$1,130.13",
    profitMargin: "80%",
    trend: "up",
  },
  {
    id: 4,
    name: "Lobster Bisque",
    category: "Appetizer",
    unitsSold: 76,
    revenue: "$1,425.00",
    profitMargin: "65%",
    trend: "down",
  },
  {
    id: 5,
    name: "Signature Cocktail",
    category: "Beverage",
    unitsSold: 65,
    revenue: "$942.50",
    profitMargin: "85%",
    trend: "up",
  },
]

export default AnalyticsPage
