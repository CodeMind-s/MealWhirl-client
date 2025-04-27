"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface UpdateOrderStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  currentStatus: string
  onStatusUpdate: (orderId: string, newStatus: string) => void
}

export function UpdateOrderStatusModal({
  open,
  onOpenChange,
  orderId,
  currentStatus,
  onStatusUpdate,
}: UpdateOrderStatusModalProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 800))

    onStatusUpdate(orderId, status)
    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the status for order <span className="font-medium">{orderId}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={status} onValueChange={setStatus} className="gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="preparing" id="preparing" />
              <Label htmlFor="preparing" className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                Preparing
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ready" id="ready" />
              <Label htmlFor="ready" className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                Ready for Pickup
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed" className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                Completed
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cancelled" id="cancelled" />
              <Label htmlFor="cancelled" className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-rose-500 mr-2"></span>
                Cancelled
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Update Status
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
