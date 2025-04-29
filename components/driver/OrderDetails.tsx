"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  MapPin,
  Phone,
  User,
  Navigation,
  CheckCircle2,
  Package,
  Truck,
  HandPlatter,
} from "lucide-react";
import { useOrders } from "@/contexts/orders-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getOrderById, updateOrderStatus } from "@/lib/api/orderApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { sendSMSNotification } from "@/lib/api/notificationApi"; // Import the SMS notification function

import dynamic from "next/dynamic";

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

interface DeliveryAddress {
  latitude: number;
  longitude: number;
  address: string;
}

type PaymentMethod = "CASH" | "CARD";

interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  items: any[];
  deliveryAddress: DeliveryAddress;
  paymentId: string;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  deliveryFee: number;
  distance: string;
  duration: string;
  fare: string;
  specialInstructions: string;
  orderStatus: OrderStatus;
  createdAt: string;
}

type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "REDY_FOR_PICKUP"
  | "PICKED_UP"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELLED";

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
}

interface OrderStatusDto {
  orderStatus: OrderStatus;
}

export default function OrderDetails({ orderId, onBack }: OrderDetailsProps) {
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const { toast } = useToast();
  const [orderDestination, setOrderDestination] = useState(false);
  const [Latitude, setLatitude] = useState<number>(6.952216);
  const [Longitude, setLongitude] = useState<number>(80.985924);
  const [restLatitude, setRestLatitude] = useState<number>(6.92254243510281);
  const [restLongitude, setRestLongitude] = useState<number>(79.91822361239088);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response: any = await getOrderById(orderId);
        if (response.data) {
          setOrderDetails(response.data);
          setLatitude(response.data.deliveryAddress.latitude);
          setLongitude(response.data.deliveryAddress.longitude);
        }
      } catch (err: any) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            console.log(`Order Details Fetching Faild: ${data.message}`);
          } else {
            console.log("An unexpected error occurred. Please try again.");
          }
        } else {
          console.log(
            "An unexpected error occurred. Please check your network and try again."
          );
        }
      }
    };
    fetchOrderDetails();
  }, []);

  if (!orderDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-xl font-semibold mb-2">Order not found</h2>
        <Button onClick={onBack}>Back to orders</Button>
      </div>
    );
  }

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      const data: OrderStatusDto = {
        orderStatus: status,
      };
      const response = await updateOrderStatus(orderId, data);

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Order status updated successfully.",
        });

        // Send SMS notification to the customer
        const smsMessages = {
          PLACED: "Our valued cutomer, Your order has been placed successfully!",
          ACCEPTED: "Our valued cutomer, Your order has been accepted by the restaurant.",
          PREPARING: "Our valued cutomer, Your order is being prepared.",
          REDY_FOR_PICKUP: "Our valued cutomer,Your order is ready for pickup.",
          PICKED_UP: "Our valued cutomer, Your order has been picked up by the delivery person.",
          ON_THE_WAY: "Our valued cutomer,Your order is on the way!",
          DELIVERED: "Our valued cutomer, Your order has been delivered. Enjoy your meal!",
          CANCELLED:
            "Our valued cutomer, Your order has been cancelled. If you have any questions, please contact support.",
        };

        const smsData = {
          to: "94774338424", // Assuming phone number is part of deliveryAddress
          message: smsMessages[status],
        };
        try {
          // await sendSMSNotification(smsData);
          toast({
            title: "Notification Sent",
            description: "Customer has been notified via SMS.",
          });
        } catch (smsError) {
          console.error("Error sending SMS notification:", smsError);
          toast({
            variant: "destructive",
            title: "Notification Error",
            description: "Failed to send SMS notification to the customer.",
          });
        }

        // Reload the page after updating the status
        window.location.reload();
      }
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            title: "Error",
            description: `Order status update failed: ${data.message}`,
            variant: "destructive",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unexpected error occurred. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  const statusLabels = {
    PLACED: "Placed",
    ACCEPTED: "Accepted",
    PREPARING: "Preparing",
    REDY_FOR_PICKUP: "Ready for Pickup",
    PICKED_UP: "Picked Up",
    ON_THE_WAY: "On The Way",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  const statusColors = {
    PLACED: "bg-yellow-500",
    ACCEPTED: "bg-blue-500",
    PREPARING: "bg-orange-500",
    REDY_FOR_PICKUP: "bg-indigo-500",
    PICKED_UP: "bg-cyan-500",
    ON_THE_WAY: "bg-primary",
    DELIVERED: "bg-green-500",
    CANCELLED: "bg-red-500",
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Order #{orderId}</h2>
        <Badge
          className={`${statusColors[orderDetails.orderStatus]} text-white`}
        >
          {statusLabels[orderDetails.orderStatus]}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Details</CardTitle>
            <CardDescription>Customer and delivery information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Customer</div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Customer Name</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>ustomer Phone</span>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="font-medium">Delivery Address</div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{orderDetails.deliveryAddress.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  Estimated delivery:{" "}
                  {/* {new Date(orderDetails.estimatedDelivery).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} */}
                  {orderDetails.duration} minutes
                </span>
              </div>
            </div>
            <div className="flex justify-center mt-2">
              {orderDestination ? (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setOrderDestination(false)}
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Close Navigation
                </Button>
              ) : (
                <Button
                  className="w-full  bg-blue-500 text-white hover:bg-blue-600"
                  variant="outline"
                  onClick={() => setOrderDestination(true)}
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Navigate to Address
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>From {orderDetails.restaurantId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex gap-2">
                    <div className="font-medium">{item.quentity}x</div>
                    <div>{item.itemName}</div>
                  </div>
                  <div>{item.itemName}</div>
                  <div>${parseInt(item.total).toFixed(2)}</div>
                </div>
              ))}
              <div className="flex justify-between font-medium">
                <div>Subtotal</div>
                <div>
                  $
                  {(
                    orderDetails.totalAmount - orderDetails.deliveryFee
                  ).toFixed(2)}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Delivery Fee</div>
                <div>${orderDetails.deliveryFee.toFixed(2)}</div>
              </div>
              {/* <div className="flex justify-between text-sm">
                <div>Tax</div>
                <div>${order.tax.toFixed(2)}</div>
              </div> */}
              <div className="flex justify-between font-bold">
                <div>Total</div>
                <div>${orderDetails.totalAmount.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {orderDestination && (
        <Card>
          {/* <OrderDestination /> */}
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle>Route To Destination</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              <Map
                latitude={Latitude}
                longitude={Longitude}
                restLatitude={restLatitude}
                restLongitude={restLongitude}
              />
            </CardContent>
          </Card>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Update Order Status</CardTitle>
          <CardDescription>
            Change the current status of this order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-center">
              <div
                className={`p-4 rounded-lg border ${orderDetails.orderStatus === "REDY_FOR_PICKUP" ||
                  orderDetails.orderStatus === "PREPARING" ||
                  orderDetails.orderStatus === "ACCEPTED" ||
                  orderDetails.orderStatus === "PLACED"
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                  : ""
                  }`}
              >
                <Package className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <div className="font-medium">Ready for Pickup</div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div
                    className={`p-4 rounded-lg border ${orderDetails.orderStatus === "PICKED_UP"
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20"
                      : ""
                      }`}
                  >
                    <HandPlatter className="h-6 w-6 mx-auto mb-2 text-cyan-500" />
                    <div className="font-medium">Picked Up</div>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Pick Up</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you have picked up the order? You can't undo
                      this action.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => handleStatusChange("PICKED_UP")}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div
                    className={`p-4 rounded-lg border ${orderDetails.orderStatus === "ON_THE_WAY"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : ""
                      }`}
                  >
                    <Truck className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <div className="font-medium">On The Way</div>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Pick Up</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you have picked up the order? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => handleStatusChange("ON_THE_WAY")}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div
                    className={`p-4 rounded-lg border ${orderDetails.orderStatus === "DELIVERED"
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : ""
                      }`}
                  >
                    <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <div className="font-medium">Delivered</div>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Delivery</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you have delivered the order? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => handleStatusChange("DELIVERED")}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back to Orders
          </Button>
          {/* <Button onClick={handleUpdateStatus}>Update Status</Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
