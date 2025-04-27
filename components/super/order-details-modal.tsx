"use client"

import { Receipt, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { UpdateOrderStatusModal } from "./update-order-status-modal"
import { useState } from "react"

interface OrderItem {
  name: string
  quantity: number
  price: string
}

interface OrderDetailsProps {
  id: string
  customer: string
  items: OrderItem[]
  total: string
  status: string
  date: string
  payment: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusUpdate?: (orderId: string, newStatus: string) => void
}

export function OrderDetailsModal({
  id,
  customer,
  items,
  total,
  status,
  date,
  payment,
  open,
  onOpenChange,
  onStatusUpdate,
}: OrderDetailsProps) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  const handleUpdateStatus = () => {
    setIsStatusModalOpen(true)
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(orderId, newStatus)
    }
  }

  // Calculate subtotal (total minus estimated tax)
  const subtotal = Number.parseFloat(total.replace("$", "")) * 0.9
  const tax = Number.parseFloat(total.replace("$", "")) * 0.1

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Details - {id}
            </DialogTitle>
            <DialogDescription>View complete information about this order.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{customer}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Order Info</h3>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Date:</span>
                    <span className="text-sm font-medium">{date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Payment:</span>
                    <span className="text-sm font-medium">{payment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status:</span>
                    <OrderStatus status={status} />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="text-sm font-medium mb-3">Order Items</h3>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.price}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(Number.parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div>
              <h3 className="text-sm font-medium mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{total}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="outline">Print Receipt</Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UpdateOrderStatusModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        orderId={id}
        currentStatus={status}
        onStatusUpdate={handleStatusUpdate}
      />
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
