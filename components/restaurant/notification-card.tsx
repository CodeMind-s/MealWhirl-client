"use client"

import { useState } from "react"
import { Bell, Check, ChevronDown, Clock, Info, ShoppingBag, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample notification data
const notifications = [
  {
    id: 1,
    title: "New Order Received",
    description: "Order #ORD-007 has been placed by Emma Wilson",
    time: "2 minutes ago",
    type: "order",
    read: false,
  },
  {
    id: 2,
    title: "Order Ready for Pickup",
    description: "Order #ORD-005 is ready for pickup",
    time: "15 minutes ago",
    type: "order",
    read: false,
  },
  {
    id: 3,
    title: "Inventory Alert",
    description: "Truffle oil is running low (2 units remaining)",
    time: "1 hour ago",
    type: "alert",
    read: false,
  },
  {
    id: 4,
    title: "Payment Processed",
    description: "Payment for Order #ORD-004 has been processed successfully",
    time: "2 hours ago",
    type: "system",
    read: true,
  },
  {
    id: 5,
    title: "New Review",
    description: "Customer David Kim left a 5-star review",
    time: "3 hours ago",
    type: "system",
    read: true,
  },
  {
    id: 6,
    title: "Staff Schedule Updated",
    description: "The staff schedule for next week has been updated",
    time: "5 hours ago",
    type: "system",
    read: true,
  },
]

export function NotificationCard() {
  const [activeTab, setActiveTab] = useState("all")
  const [notificationState, setNotificationState] = useState(notifications)

  const filteredNotifications = notificationState.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const markAsRead = (id: number) => {
    setNotificationState(
      notificationState.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotificationState(notificationState.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle>Notifications</CardTitle>
          <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {notificationState.filter((n) => !n.read).length}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Show menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem onClick={markAllAsRead}>Mark all as read</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Enable notifications</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Show desktop alerts</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardDescription className="px-6">Stay updated with the latest activities</CardDescription>
      <div className="px-6 py-2">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="order">Orders</TabsTrigger>
            <TabsTrigger value="alert">Alerts</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <CardContent className="max-h-[320px] overflow-auto">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 rounded-lg p-3 transition-colors ${
                  notification.read ? "bg-background" : "bg-muted/50"
                }`}
              >
                <div
                  className={`mt-1 rounded-full p-2 ${
                    notification.type === "order"
                      ? "bg-blue-100 text-blue-600"
                      : notification.type === "alert"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {notification.type === "order" ? (
                    <ShoppingBag className="h-4 w-4" />
                  ) : notification.type === "alert" ? (
                    <Info className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{notification.title}</h5>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {notification.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">No notifications found</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        <Button variant="ghost" size="sm" className="w-full">
          View all notifications
        </Button>
      </CardFooter>
    </Card>
  )
}
