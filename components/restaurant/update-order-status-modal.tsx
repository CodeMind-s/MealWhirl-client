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
import { sendSMSNotification } from "@/lib/api/notificationApi"; // Import the SMS notification function
import { updateOrderStatus, assignDeliveryPerson } from "@/lib/api/orderApi"; // Import the update order status function

interface UpdateOrderStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  currentStatus: string
  onStatusUpdate: (orderId: string, newStatus: string) => void
}

interface OrderStatusDto {
  orderStatus: OrderStatus;
}

type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "REDY_FOR_PICKUP"
  | "CANCELLED";

export function UpdateOrderStatusModal({
  open,
  onOpenChange,
  orderId,
  currentStatus,
  onStatusUpdate,
}: UpdateOrderStatusModalProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus as OrderStatus)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      const data: OrderStatusDto = {
        orderStatus: status,
      };
      const response = await updateOrderStatus(orderId, data);

      if (response.status === 200) {
        console.log("Order status updated successfully.");

        if (status === "REDY_FOR_PICKUP") {
          const assignData = {
            deliveryPersonId: "67fbb71ad2df7230c45110we", // Replace with actual delivery person ID logic
          };
          try {
            await assignDeliveryPerson(orderId, assignData);
            console.log("Delivery person assigned successfully.");
          } catch (assignError) {
            console.error("Error assigning delivery person:", assignError);
          }
        }

        // Send SMS notification to the customer
        const smsMessages = {
          preparing: "Your order is being prepared.",
          ready: "Your order is ready for pickup.",
          completed: "Your order has been completed. Enjoy your meal!",
          cancelled: "Your order has been cancelled. If you have any questions, please contact support.",
        };

        const smsData = {
          to: "94774338424", // Assuming phone number is available
          message: smsMessages[status as keyof typeof smsMessages],
        };

        try {
          // await sendSMSNotification(smsData);
          console.log("SMS notification sent successfully.");
        } catch (smsError) {
          console.error("Error sending SMS notification:", smsError);
        }

        // Call the onStatusUpdate callback
        onStatusUpdate(orderId, status);
        window.location.reload();
      }
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          console.error(`Order status update failed: ${data.message}`);
        } else {
          console.error("An unexpected error occurred. Please try again.");
        }
      } else {
        console.error("An unexpected error occurred. Please check your network and try again.");
      }
    } finally {
      setIsSubmitting(false);
      onOpenChange(false);
    }
  };

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
          <RadioGroup value={status} onValueChange={(value) => setStatus(value as OrderStatus)} className="gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PREPARING" id="preparing" />
              <Label htmlFor="preparing" className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                Preparing
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="REDY_FOR_PICKUP" id="ready" />
              <Label htmlFor="ready" className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                Ready for Pickup
              </Label>
            </div>
            {/* <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed" className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                Completed
              </Label>
            </div> */}
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
          <Button onClick={() => handleStatusChange(status)} disabled={isSubmitting}>
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
