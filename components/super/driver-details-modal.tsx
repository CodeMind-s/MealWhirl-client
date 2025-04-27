"use client"

import { Truck } from "lucide-react"

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
import { cn } from "@/lib/utils"

interface DriverDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver: any
  onStatusUpdate: (id: number, status: string) => void
}

export function DriverDetailsModal({ open, onOpenChange, driver, onStatusUpdate }: DriverDetailsModalProps) {
  const handleStatusUpdate = (status: string) => {
    onStatusUpdate(driver.id, status)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Driver Details
          </DialogTitle>
          <DialogDescription>View and manage driver information.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="h-40 w-full rounded-md bg-primary/10 flex items-center justify-center">
                  <Truck className="h-20 w-20 text-primary/40" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        driver.status === "active" && "border-emerald-500 text-emerald-500",
                        driver.status === "on_delivery" && "border-blue-500 text-blue-500",
                        driver.status === "pending" && "border-amber-500 text-amber-500",
                        driver.status === "inactive" && "border-slate-500 text-slate-500",
                      )}
                    >
                      {driver.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Driver Status</p>
                </div>
              </div>
              <div className="md:w-2/3 space-y-2">
                <h4 className="text-lg font-medium">Personal Information</h4>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{driver.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{driver.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{driver.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{driver.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="deliveries" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Recent Deliveries</h4>
              <Separator />
              <p className="text-sm text-muted-foreground">No deliveries found.</p>
            </div>
          </TabsContent>
          <TabsContent value="earnings" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Earnings</h4>
              <Separator />
              <p className="text-sm text-muted-foreground">No earnings found.</p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-start">
          {driver.status === "active" ? (
            <Button variant="destructive" onClick={() => handleStatusUpdate("inactive")}>
              Deactivate Driver
            </Button>
          ) : (
            <Button variant="default" onClick={() => handleStatusUpdate("active")}>
              Activate Driver
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
