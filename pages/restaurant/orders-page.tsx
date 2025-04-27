"use client"
import { useState } from "react"
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

const initialOrders = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    items: [
      { name: "Truffle Pasta", quantity: 2, price: "$24.99" },
      { name: "Tiramisu", quantity: 2, price: "$12.99" },
    ],
    total: "$86.24",
    status: "completed",
    date: "Today, 2:30 PM",
    payment: "Credit Card",
  },
  {
    id: "ORD-002",
    customer: "Michael Chen",
    items: [
      { name: "Beef Wellington", quantity: 1, price: "$38.50" },
      { name: "Signature Cocktail", quantity: 1, price: "$14.50" },
    ],
    total: "$53.00",
    status: "preparing",
    date: "Today, 2:15 PM",
    payment: "Cash",
  },
  {
    id: "ORD-003",
    customer: "Emily Rodriguez",
    items: [
      { name: "Lobster Bisque", quantity: 2, price: "$18.75" },
      { name: "Beef Wellington", quantity: 2, price: "$38.50" },
      { name: "Tiramisu", quantity: 2, price: "$12.99" },
    ],
    total: "$124.00",
    status: "completed",
    date: "Today, 1:45 PM",
    payment: "Credit Card",
  },
  {
    id: "ORD-004",
    customer: "David Kim",
    items: [
      { name: "Truffle Pasta", quantity: 1, price: "$24.99" },
      { name: "Lobster Bisque", quantity: 1, price: "$18.75" },
      { name: "Signature Cocktail", quantity: 1, price: "$14.50" },
    ],
    total: "$58.24",
    status: "ready",
    date: "Today, 1:30 PM",
    payment: "PayPal",
  },
  {
    id: "ORD-005",
    customer: "Jessica Patel",
    items: [
      { name: "Signature Cocktail", quantity: 1, price: "$14.50" },
      { name: "Tiramisu", quantity: 1, price: "$12.99" },
    ],
    total: "$27.49",
    status: "cancelled",
    date: "Today, 1:00 PM",
    payment: "Credit Card",
  },
  {
    id: "ORD-006",
    customer: "Robert Wilson",
    items: [
      { name: "Beef Wellington", quantity: 2, price: "$38.50" },
      { name: "Lobster Bisque", quantity: 1, price: "$18.75" },
      { name: "Signature Cocktail", quantity: 2, price: "$14.50" },
    ],
    total: "$124.75",
    status: "completed",
    date: "Today, 12:30 PM",
    payment: "Cash",
  },
]

export function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

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
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="hidden md:table-cell">Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.items.length}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.payment}</TableCell>
                    <TableCell>
                      <OrderStatus status={order.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{order.date}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id)}>
                            Update status
                          </DropdownMenuItem>
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
            orderId={selectedOrder.id}
            currentStatus={selectedOrder.status}
            onStatusUpdate={handleStatusUpdate}
          />
          <OrderDetailsModal
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
            id={selectedOrder.id}
            customer={selectedOrder.customer}
            items={selectedOrder.items}
            total={selectedOrder.total}
            status={selectedOrder.status}
            date={selectedOrder.date}
            payment={selectedOrder.payment}
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
        status === "completed" && "border-emerald-500 text-emerald-500",
        status === "preparing" && "border-amber-500 text-amber-500",
        status === "ready" && "border-blue-500 text-blue-500",
        status === "cancelled" && "border-rose-500 text-rose-500",
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
