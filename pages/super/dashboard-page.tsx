"use client"

import type React from "react"
import { ArrowDown, ArrowUp, Calendar, DollarSign, Filter, Package, Search, ShoppingBag, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RecentOrdersTable } from "../../components/super/recent-orders-table"
import { PopularItems } from "../../components/super/popular-items"
import { RevenueChart } from "../../components/super/revenue-chart"
import { NotificationCard } from "../../components/super/notification-card"

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your restaurant's performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value="$45,231.89"
          description="+20.1% from last month"
          trend="up"
          icon={DollarSign}
        />
        <MetricCard title="New Orders" value="356" description="+12.2% from last month" trend="up" icon={ShoppingBag} />
        <MetricCard
          title="Active Customers"
          value="2,420"
          description="+5.4% from last month"
          trend="up"
          icon={Users}
        />
        <MetricCard title="Menu Items" value="48" description="+2 new items added" trend="neutral" icon={Package} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the past year</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="mr-2 h-4 w-4" />
                Last 12 months
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Popular Items</CardTitle>
            <CardDescription>Your top selling menu items this month</CardDescription>
          </CardHeader>
          <CardContent>
            <PopularItems />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage your recent customer orders</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-40 lg:w-60">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search orders..." className="w-full pl-8 bg-background" />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable />
          </CardContent>
        </Card>
        <div className="lg:col-span-1">
          <NotificationCard />
        </div>
      </div>
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

export default DashboardPage
