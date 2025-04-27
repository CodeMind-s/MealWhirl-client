"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Package, Truck, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { orders } from "@/lib/data"

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    return order.status.toLowerCase() === activeTab
  })

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Package className="h-4 w-4" />
      case "preparing":
        return <Clock className="h-4 w-4" />
      case "delivering":
        return <Truck className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "preparing":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
      case "delivering":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800"
      case "completed":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
      case "cancelled":
        return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/profile" className="inline-flex items-center text-primary hover:underline mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Profile
      </Link>

      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start gap-2 bg-transparent h-auto p-0 mb-4">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 rounded-full"
            >
              All Orders
            </TabsTrigger>
            <TabsTrigger
              value="processing"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 rounded-full"
            >
              Processing
            </TabsTrigger>
            <TabsTrigger
              value="preparing"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 rounded-full"
            >
              Preparing
            </TabsTrigger>
            <TabsTrigger
              value="delivering"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 rounded-full"
            >
              Delivering
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 rounded-full"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 rounded-full"
            >
              Cancelled
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4 mt-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <h2 className="text-xl font-medium mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">You don't have any {activeTab !== "all" ? activeTab : ""} orders yet.</p>
            <Link href="/restaurants">
              <Button className="rounded-full">Browse Restaurants</Button>
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="overflow-hidden hover:shadow-md transition-shadow border-blue-100 dark:border-blue-900"
            >
              <CardHeader className="pb-3 bg-blue-50 dark:bg-blue-950">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="mr-2">Order #{order.orderNumber}</span>
                    <Badge
                      variant="outline"
                      className={`ml-2 flex items-center gap-1 font-normal ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </Badge>
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">{order.date}</div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{order.restaurant}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      {order.items.map((item, index) => (
                        <span key={index}>
                          {item.quantity} × {item.name}
                          {index < order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>

                  {order.status !== "completed" && order.status !== "cancelled" && (
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Estimated Delivery</span>
                      </div>
                      <div className="text-sm">{order.estimatedDelivery}</div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="font-medium text-primary">{formatCurrency(order.total)}</span>
                  </div>

                  <div className="flex justify-end">
                    <Link href={`/profile/orders/${order.id}`}>
                      <Button
                        variant="outline"
                        className="flex items-center gap-1 rounded-full hover:bg-primary hover:text-primary-foreground"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
