"use client"

import { useState } from "react"
import { Bell, CheckCheck, Filter, Search, Settings, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/super/page-header"

// Mock notification data
const notifications = [
  {
    id: 1,
    title: "New Restaurant Application",
    message: "Burger Palace has applied to join the platform. Review their application.",
    type: "restaurant",
    priority: "high",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    actionable: true,
    actionLink: "/restaurants?id=123",
  },
  {
    id: 2,
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight at 2:00 AM UTC. Expected downtime: 30 minutes.",
    type: "system",
    priority: "medium",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    actionable: false,
  },
  {
    id: 3,
    title: "New Driver Application",
    message: "John Doe has applied to become a driver. Review their application and documents.",
    type: "driver",
    priority: "medium",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    actionable: true,
    actionLink: "/drivers?id=456",
  },
  {
    id: 4,
    title: "Customer Complaint",
    message: "Customer #1089 has filed a complaint about order #12345. Requires immediate attention.",
    type: "customer",
    priority: "high",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    actionable: true,
    actionLink: "/customers?id=1089",
  },
  {
    id: 5,
    title: "Payment Processing Issue",
    message: "Multiple failed payment attempts detected. Check payment gateway status.",
    type: "system",
    priority: "high",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    actionable: false,
  },
  {
    id: 6,
    title: "Restaurant Rating Drop",
    message: "Pasta Paradise's rating has dropped below 3.5 stars. Consider reaching out.",
    type: "restaurant",
    priority: "low",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    actionable: true,
    actionLink: "/restaurants?id=789",
  },
  {
    id: 7,
    title: "Driver Performance Alert",
    message: "Driver #789 has received multiple low ratings this week.",
    type: "driver",
    priority: "medium",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    actionable: true,
    actionLink: "/drivers?id=789",
  },
  {
    id: 8,
    title: "New Feature Deployed",
    message: "The new analytics dashboard has been deployed successfully.",
    type: "system",
    priority: "low",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    actionable: false,
  },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")

  // Filter notifications based on active tab and search query
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by tab
    if (activeTab === "unread" && notification.isRead) return false
    if (activeTab !== "all" && activeTab !== "unread" && notification.type !== activeTab) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return notification.title.toLowerCase().includes(query) || notification.message.toLowerCase().includes(query)
    }

    return true
  })

  // Sort notifications
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.timestamp.getTime() - a.timestamp.getTime()
    } else if (sortOrder === "oldest") {
      return a.timestamp.getTime() - b.timestamp.getTime()
    } else if (sortOrder === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority as 'high' | 'medium' | 'low'] - priorityOrder[b.priority as 'high' | 'medium' | 'low']
    }
    return 0
  })

  // Count notifications by type
  const counts = {
    all: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    system: notifications.filter((n) => n.type === "system").length,
    restaurant: notifications.filter((n) => n.type === "restaurant").length,
    driver: notifications.filter((n) => n.type === "driver").length,
    customer: notifications.filter((n) => n.type === "customer").length,
  }

  // Format timestamp to relative time
  interface Notification {
    id: number
    title: string
    message: string
    type: "system" | "restaurant" | "driver" | "customer"
    priority: "high" | "medium" | "low"
    isRead: boolean
    timestamp: Date
    actionable: boolean
    actionLink?: string
  }

  const formatRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  // Mark all as read
  const markAllAsRead = () => {
    // In a real app, this would call an API
    console.log("Marking all notifications as read")
  }

  // Delete notification
  const deleteNotification = (id: any) => {
    // In a real app, this would call an API
    console.log(`Deleting notification ${id}`)
  }

  // Mark notification as read
  const markAsRead = (id: any) => {
    // In a real app, this would call an API
    console.log(`Marking notification ${id} as read`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Manage system notifications and alerts"
        icon={<Bell className="h-6 w-6" />}
      >
        <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={counts.unread === 0}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notification Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Email Notifications</DropdownMenuItem>
            <DropdownMenuItem>Push Notifications</DropdownMenuItem>
            <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notifications..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {sortOrder === "newest" ? "Newest first" : sortOrder === "oldest" ? "Oldest first" : "Priority"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder("newest")}>Newest first</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")}>Oldest first</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("priority")}>Priority</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="all">
            All
            <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">{counts.all}</span>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {counts.unread}
            </span>
          </TabsTrigger>
          <TabsTrigger value="system">
            System
            <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">{counts.system}</span>
          </TabsTrigger>
          <TabsTrigger value="restaurant">
            Restaurants
            <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">{counts.restaurant}</span>
          </TabsTrigger>
          <TabsTrigger value="driver">
            Drivers
            <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">{counts.driver}</span>
          </TabsTrigger>
          <TabsTrigger value="customer">
            Customers
            <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">{counts.customer}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {sortedNotifications.length > 0 ? (
            <div className="space-y-4">
              {sortedNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all ${!notification.isRead ? "border-l-4 border-l-primary" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          {!notification.isRead && (
                            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                              New
                            </span>
                          )}
                          {notification.priority === "high" && (
                            <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-xs font-semibold text-destructive">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(notification.timestamp)}
                          </span>
                          <span
                            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
                            ${notification.type === "system"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : notification.type === "restaurant"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : notification.type === "driver"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                    : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                              }`}
                          >
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                            <CheckCheck className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                        {notification.actionable && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2"
                            onClick={() => (window.location.href = notification.actionLink ?? "#")}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? "No notifications match your search query."
                  : "You're all caught up! No new notifications."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
