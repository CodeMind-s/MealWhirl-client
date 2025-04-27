"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UpdateOrderStatusModal } from "./update-order-status-modal"
import { toast } from "@/components/ui/use-toast"
import { OrderDetailsModal } from "./order-details-modal"

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
    date: "2 mins ago",
    payment: "Credit Card",
  },
  {
    id: "ORD-002",
    customer: "Michael Chen",
    items: [
      { name: "Beef Wellington", quantity: 1, price: "$38.50" },
      { name: "Signature Cocktail", quantity: 1, price: "$14.50" },
    ],
    total: "$32.50",
    status: "preparing",
    date: "15 mins ago",
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
    date: "45 mins ago",
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
    total: "$54.75",
    status: "ready",
    date: "1 hour ago",
    payment: "PayPal",
  },
  {
    id: "ORD-005",
    customer: "Jessica Patel",
    items: [
      { name: "Signature Cocktail", quantity: 1, price: "$14.50" },
      { name: "Tiramisu", quantity: 1, price: "$12.99" },
    ],
    total: "$18.99",
    status: "cancelled",
    date: "2 hours ago",
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
    total: "$92.30",
    status: "completed",
    date: "3 hours ago",
    payment: "Cash",
  },
]

export function RecentOrdersTable() {
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
    <>
      <div className="rounded-md border">
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
                      <DropdownMenuItem onClick={() => handleUpdateStatus(order.id)}>Update status</DropdownMenuItem>
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
    </>
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
