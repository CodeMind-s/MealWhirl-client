"use client"

import type React from "react"

import { ArrowDown, ArrowUp, DollarSign, Store, Truck, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RecentActivitiesTable } from "./recent-activities-table"
import { SystemRevenueChart } from "./system-revenue-chart"
import { RestaurantPerformanceTable } from "./restaurant-performance-table"

export function SuperAdminDashboard() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your entire system.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs defaultValue="day" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Restaurants"
          value="248"
          description="+12 new this month"
          trend="up"
          trendValue="4.9%"
          icon={Store}
        />
        <MetricCard
          title="Active Customers"
          value="24,521"
          description="+2,145 this month"
          trend="up"
          trendValue="10.2%"
          icon={Users}
        />
        <MetricCard
          title="Active Drivers"
          value="842"
          description="-14 this month"
          trend="down"
          trendValue="1.6%"
          icon={Truck}
        />
        <MetricCard
          title="Total Revenue"
          value="$1.2M"
          description="+$124K this month"
          trend="up"
          trendValue="8.3%"
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>System Revenue</CardTitle>
              <CardDescription>Monthly revenue across all restaurants</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SystemRevenueChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Performing Restaurants</CardTitle>
            <CardDescription>Based on monthly revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <RestaurantPerformanceTable />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <RecentActivitiesTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Statistics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Order Completion Rate</div>
                <div className="text-sm font-medium">94.2%</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "94.2%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Average Delivery Time</div>
                <div className="text-sm font-medium">28 mins</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Customer Satisfaction</div>
                <div className="text-sm font-medium">4.8/5</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "96%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Restaurant Retention</div>
                <div className="text-sm font-medium">92.5%</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "92.5%" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  description: string
  trend: "up" | "down" | "neutral"
  trendValue: string
  icon: React.ElementType
}

function MetricCard({ title, value, description, trend, trendValue, icon: Icon }: MetricCardProps) {
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
            {trendValue}
          </span>
          <span className="ml-1">{description}</span>
        </p>
      </CardContent>
    </Card>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

export default SuperAdminDashboard
