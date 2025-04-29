// driver card component"use client"

import { Clock, MapPin, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import type { Order } from "@/types/Order"

// Ensure the 'order' prop matches the 'Order' interface
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
  estimatedDelivery: string;
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

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const statusColors: Record<OrderStatus, string> = {
    PLACED: "bg-yellow-500 hover:bg-yellow-600",
    ACCEPTED: "bg-blue-500 hover:bg-blue-600",
    PREPARING: "bg-orange-500 hover:bg-orange-600",
    REDY_FOR_PICKUP: "bg-indigo-500 hover:bg-indigo-600",
    PICKED_UP: "bg-cyan-500 hover:bg-cyan-600",
    ON_THE_WAY: "bg-primary hover:bg-primary/90",
    DELIVERED: "bg-green-500 hover:bg-green-600",
    CANCELLED: "bg-red-500 hover:bg-red-600",
  };

  const statusLabels: Record<OrderStatus, string> = {
    PLACED: "Placed",
    ACCEPTED: "Accepted",
    PREPARING: "Preparing",
    REDY_FOR_PICKUP: "Ready for Pickup",
    PICKED_UP: "Picked Up",
    ON_THE_WAY: "On The Way",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
        <div>
          {/* <div className="font-semibold">Order #{order._id.slice(-4)}</div> */}
          <div className="font-semibold">Order #{order._id}</div>
          <div className="text-sm text-muted-foreground">Restaurant name</div>
        </div>
        <Badge className={statusColors[order.orderStatus]}>
          {statusLabels[order.orderStatus]}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{order.deliveryAddress.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{order.items.length} items</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 border-t flex justify-between">
        <div className="text-sm font-medium"><span className=" text-green-600 text-xl font-bold">${order.deliveryFee.toFixed(2)}</span>/${order.totalAmount.toFixed(2)}</div>
        <div className="text-sm text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}
