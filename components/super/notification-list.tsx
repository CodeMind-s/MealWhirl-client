"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  AlertCircle,
  Bell,
  Check,
  ChevronRight,
  Info,
  MoreVertical,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  type: string
  priority: string
  read: boolean
  actionable?: boolean
  restaurantId?: string
  driverId?: string
  customerId?: string
  orderId?: string
}

interface NotificationListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export function NotificationList({ notifications, onMarkAsRead, onDelete }: NotificationListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Calculate pagination
  const totalPages = Math.ceil(notifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNotifications = notifications.slice(startIndex, startIndex + itemsPerPage)

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "system":
        return <Bell className="h-5 w-5" />
      case "restaurant":
        return <Store className="h-5 w-5" />
      case "driver":
        return <Truck className="h-5 w-5" />
      case "customer":
        return <User className="h-5 w-5" />
      case "order":
        return <ShoppingBag className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  // Get notification color based on priority
  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
      case "low":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  if (notifications.length === 0) {
    return (
      <div className="flex h-60 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Bell className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
        <p className="mt-2 text-sm text-muted-foreground">You're all caught up! No notifications to display.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {paginatedNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`group flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/5 ${
              notification.read ? "bg-background" : "bg-muted/30"
            }`}
          >
            <div className={`mt-1 rounded-full p-2 ${getNotificationColor(notification.priority)}`}>
              {getNotificationIcon(notification.type)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium">{notification.title}</h4>
                  {!notification.read && (
                    <Badge variant="default" className="bg-primary">
                      New
                    </Badge>
                  )}
                  {notification.priority === "high" && (
                    <Badge variant="destructive">
                      <AlertCircle className="mr-1 h-3 w-3" /> Urgent
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!notification.read && (
                      <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                        <Check className="mr-2 h-4 w-4" /> Mark as read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(notification.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete notification
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground">{notification.message}</p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>

                {notification.actionable && (
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Take Action <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              // Show first page, last page, and pages around current page
              let pageToShow = i + 1
              if (totalPages > 5) {
                if (currentPage <= 3) {
                  // Near the start
                  pageToShow = i + 1
                  if (i === 4) pageToShow = totalPages
                } else if (currentPage >= totalPages - 2) {
                  // Near the end
                  if (i === 0) pageToShow = 1
                  else pageToShow = totalPages - (4 - i)
                } else {
                  // In the middle
                  if (i === 0) pageToShow = 1
                  else if (i === 4) pageToShow = totalPages
                  else pageToShow = currentPage + (i - 2)
                }
              }

              // Add ellipsis
              if (
                (totalPages > 5 && i === 1 && currentPage > 3) ||
                (totalPages > 5 && i === 3 && currentPage < totalPages - 2)
              ) {
                return (
                  <PaginationItem key={i} className="cursor-default">
                    <span className="flex h-9 w-9 items-center justify-center">...</span>
                  </PaginationItem>
                )
              }

              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(pageToShow)
                    }}
                    isActive={currentPage === pageToShow}
                  >
                    {pageToShow}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
