"use client"

import { useEffect, useState } from "react"
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
import { deleteNotification, getNotificationsByUser, markNotificationsAsRead } from "@/lib/api/notificationApi"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth();
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
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return 0
  })

  // Count notifications by type
  const counts = {
    all: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    system: notifications.filter((n) => n.type === "system").length,
    order: notifications.filter((n) => n.type === "order").length,
    payment: notifications.filter((n) => n.type === "payment").length,
    review: notifications.filter((n) => n.type === "review").length,
  }

  type NotificationType = "order" | "payment" | "system" | "review"

  // Format timestamp to relative time
  interface Notification {
    _id: string
    title: string
    message: string
    isRead: boolean
    type: NotificationType
    createdAt: string
  }
  const formatRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  useEffect(() => {
    if (user && notifications.length === 0) {
      getAllNotifications(user._id);
    }
  }, [user, notifications]);

  const getAllNotifications = async (userId: string): Promise<any> => {
    try {
      const response = await getNotificationsByUser(userId);
      if (response.status === 200) {
        const sortedNotifications = (response.data as any[]).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(sortedNotifications);
      } else {
        throw new Error("Failed to fetch notifications");
      }
    } catch (error) {
      // console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // Call the API to delete the notification
      await deleteNotification(notificationId);
      // await deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((notification) => notification._id !== notificationId));
      toast({
        title: "Notification Deleted",
        description: "The notification has been deleted successfully.",
        variant: "destructive",
      });
      setNotifications((prev) => [...prev]);

    } catch (error) {
      // console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete the notification.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationsAsRead(notificationId, { isRead: true });
      toast({
        title: "Notification Marked as Read",
        variant: "default",
      });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      // console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark the notification as read.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Manage system notifications and alerts"
        icon={<Bell className="h-6 w-6" />}
      >
        {/* <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={counts.unread === 0}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all as read
        </Button> */}
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
        <TabsList className="grid grid-cols-2">
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
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {sortedNotifications.length > 0 ? (
            <div className="space-y-4">
              {sortedNotifications.map((notification) => (
                <Card
                  key={notification._id}
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
                          {/* {notification.priority === "high" && (
                            <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-xs font-semibold text-destructive">
                              Urgent
                            </span>
                          )} */}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                        <div className="mt-2 flex items-center gap-4">
                          {/* <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(notification.timestamp)}
                          </span> */}
                          {/* <span
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
                          </span> */}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification._id)}>
                            <CheckCheck className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteNotification(notification._id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                          <span className="sr-only">Delete</span>
                        </Button>
                        {/* {notification.actionable && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2"
                            onClick={() => (window.location.href = notification.actionLink ?? "#")}
                          >
                            View
                          </Button>
                        )} */}
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
