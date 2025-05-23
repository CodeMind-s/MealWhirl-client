"use client"
import { useEffect, useState } from "react"
import { Calendar, ChevronDown, Filter, MoreHorizontal, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpdateOrderStatusModal } from "../../components/restaurant/update-order-status-modal"
import { toast } from "@/components/ui/use-toast"
import { OrderDetailsModal } from "../../components/restaurant/order-details-modal"
import { getOrdersByRestaurantId } from "@/lib/api/orderApi"
import { useAuth } from "@/contexts/auth-context"

export function OrdersPage() {
  interface Order {
    id: string
    customer: string
    items: { itemName: string; total: string; quentity: string }[]
    total: number
    payment: string
    orderStatus: string
    createdAt: string
  }

  const [orders, setOrders] = useState<Order[]>([])
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const { user} = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user || !user.refID || !user.refID._id) return;
        const restaurantId = user.refID._id; // Replace with actual restaurant ID
        const response = await getOrdersByRestaurantId(restaurantId)
        setOrders(response.data as Order[])
        console.log(`re => `, response.data);
      } catch (error) {
        // console.error("Error fetching orders:", error)
      }
    }

    fetchOrders()
  }, [user])

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order)
    setIsDetailsModalOpen(true)
  }

  const handleUpdateStatus = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setIsUpdateModalOpen(true)
    }
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

    toast({
      title: "Order status updated",
      description: `Order ${orderId} has been updated to ${newStatus}`,
    })
  }

  const statusColors = {
    PLACED: "bg-yellow-500",
    PREPARING: "bg-orange-500",
    REDY_FOR_PICKUP: "bg-indigo-500",
    CANCELLED: "bg-red-500",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage and track all customer orders in one place.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[180px] lg:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search orders..." className="w-full pl-8 bg-background" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Today</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>This Week</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>This Month</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Completed</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Preparing</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Ready</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Cancelled</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default" size="sm" className="h-9">
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4">
            <CardTitle>All Orders</CardTitle>
            <CardDescription>Showing {orders.length} orders</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Contact number</TableHead>
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead className="hidden md:table-cell">Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order._id}</TableCell>
                    <TableCell>
                      {`94${Math.floor(100000000 + Math.random() * 900000000)}`}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{order.items.length}</TableCell>
                    {/* <TableCell>{order.total}</TableCell> */}
                    <TableCell className="hidden md:table-cell">${order.totalAmount}</TableCell>
                    <TableCell>
                      <OrderStatus status={order.orderStatus} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{order.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(order)}>View details</DropdownMenuItem>
                          {/* <DropdownMenuItem onClick={() => handleUpdateStatus(order.id)}>
                            Update status
                          </DropdownMenuItem> */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Print receipt</DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-500">Cancel order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedOrder && (
        <>
          <UpdateOrderStatusModal
            open={isUpdateModalOpen}
            onOpenChange={setIsUpdateModalOpen}
            orderId={selectedOrder._id}
            userId={selectedOrder.userId}
            currentStatus={selectedOrder.orderStatus}
            onStatusUpdate={handleStatusUpdate}
          />
          <OrderDetailsModal
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
            id={selectedOrder._id}
            customer={selectedOrder.customer ? selectedOrder.customer : `Arshartisan`}
            items={selectedOrder.items}
            total={selectedOrder.total ? selectedOrder.total : "0"}
            status={selectedOrder.orderStatus}
            date={selectedOrder.createdAt}
            payment={selectedOrder.totalAmount}
            deliveryFee={selectedOrder.deliveryFee ? selectedOrder.deliveryFee : 0}
            onStatusUpdate={handleStatusUpdate}
          />
        </>
      )}
    </div>
  )
}

function OrderStatus({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === "PLACED" && "border-emerald-500 text-emerald-500",
        status === "COMPLETED" && "border-emerald-500 text-emerald-500",
        status === "PREPARING" && "border-amber-500 text-amber-500",
        status === "REDY_FOR_PICKUP" && "border-blue-500 text-blue-500",
        status === "CANCELLED" && "border-rose-500 text-rose-500",
      )}
    >
      {status}
    </Badge>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

export default OrdersPage
