"use client"

import { formatDistanceToNow } from "date-fns"
import { Check, Store, Truck, User, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentActivities = [
  {
    id: 1,
    type: "restaurant_signup",
    name: "Spice Garden",
    status: "pending",
    time: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    icon: Store,
  },
  {
    id: 2,
    type: "driver_signup",
    name: "Michael Rodriguez",
    status: "pending",
    time: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    icon: Truck,
  },
  {
    id: 3,
    type: "customer_complaint",
    name: "Sarah Johnson",
    status: "urgent",
    time: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    icon: User,
  },
  {
    id: 4,
    type: "restaurant_signup",
    name: "Burger Bonanza",
    status: "pending",
    time: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    icon: Store,
  },
  {
    id: 5,
    type: "driver_signup",
    name: "David Chen",
    status: "pending",
    time: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    icon: Truck,
  },
]

export function RecentActivitiesTable() {
  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <activity.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">{activity.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatActivityType(activity.type)} • {formatDistanceToNow(activity.time, { addSuffix: true })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ActivityStatus status={activity.status} />
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatActivityType(type: string) {
  switch (type) {
    case "restaurant_signup":
      return "Restaurant Signup"
    case "driver_signup":
      return "Driver Application"
    case "customer_complaint":
      return "Customer Complaint"
    default:
      return type.replace("_", " ")
  }
}

function ActivityStatus({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === "pending" && "border-amber-500 text-amber-500",
        status === "urgent" && "border-rose-500 text-rose-500",
        status === "completed" && "border-emerald-500 text-emerald-500",
      )}
    >
      {status}
    </Badge>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
