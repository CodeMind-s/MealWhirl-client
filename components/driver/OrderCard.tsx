// driver card component"use client"

import { Clock, MapPin, Package } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import type { Order } from "@/types/Order"

// Ensure the 'order' prop matches the 'Order' interface
export type OrderStatus = "pending" | "in_progress" | "delivered";

export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    restaurant: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    status: OrderStatus;
    createdAt: string;
    estimatedDelivery: string;
}

interface OrderCardProps {
    order: Order;
    onClick: () => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
    const statusColors = {
        pending: "bg-yellow-500 hover:bg-yellow-600",
        in_progress: "bg-primary hover:bg-primary/90", // Changed to primary color
        delivered: "bg-green-500 hover:bg-green-600",
    }

    const statusLabels = {
        pending: "Pending",
        in_progress: "In Progress",
        delivered: "Delivered",
    }

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={onClick}>
            <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                <div>
                    <div className="font-semibold">Order #{order.id.slice(-4)}</div>
                    <div className="text-sm text-muted-foreground">{order.restaurant}</div>
                </div>
                <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
            </CardHeader>
            <CardContent className="p-4 pt-2 pb-2">
                <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{order.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {new Date(order.estimatedDelivery).toLocaleTimeString([], {
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
                <div className="text-sm font-medium">${order.total.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
            </CardFooter>
        </Card>
    )
}
