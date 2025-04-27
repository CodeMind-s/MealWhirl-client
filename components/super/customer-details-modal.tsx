"use client"

import { Check, ChevronRight, Clock, DollarSign, MapPin, Phone, ShoppingBag, User } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CustomerDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: any
  onStatusUpdate: (id: number, status: string) => void
}

export function CustomerDetailsModal({ open, onOpenChange, customer, onStatusUpdate }: CustomerDetailsModalProps) {
  const handleStatusUpdate = (status: string) => {
    onStatusUpdate(customer.id, status)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Details
          </DialogTitle>
          <DialogDescription>View and manage customer information.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="h-40 w-full rounded-md bg-primary/10 flex items-center justify-center">
                  <User className="h-20 w-20 text-primary/40" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        customer.status === "active" && "border-emerald-500 text-emerald-500",
                        customer.status === "inactive" && "border-slate-500 text-slate-500",
                      )}
                    >
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    Joined {customer.joinDate}
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Location:</span>
                      <span>{customer.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Last Order:</span>
                      <span>{customer.lastOrder}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Total Orders:</span>
                      <span>{customer.orders}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Total Spent:</span>
                      <span>{customer.totalSpent}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Avg. Order Value:</span>
                      <span>
                        $
                        {(
                          Number.parseFloat(customer.totalSpent.replace("$", "").replace(",", "")) / customer.orders
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Customer Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {customer.name} is a {customer.status} customer who has placed {customer.orders} orders totaling{" "}
                    {customer.totalSpent}. Their last order was {customer.lastOrder}.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="orders" className="space-y-4 pt-4">
            <div className="text-center py-8">
              <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium">Order History</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {customer.name} has placed {customer.orders} orders totaling {customer.totalSpent}.
              </p>
              <Button variant="outline" className="mt-4">
                View Order History
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="activity" className="space-y-4 pt-4">
            <div className="text-center py-8">
              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium">Activity Log</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                View {customer.name}'s activity history including logins, orders, and support requests.
              </p>
              <Button variant="outline" className="mt-4">
                View Activity Log
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          {customer.status === "active" && (
            <Button variant="destructive" onClick={() => handleStatusUpdate("inactive")}>
              Deactivate Customer
            </Button>
          )}
          {customer.status === "inactive" && (
            <Button variant="default" onClick={() => handleStatusUpdate("active")}>
              <Check className="mr-2 h-4 w-4" />
              Activate Customer
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
