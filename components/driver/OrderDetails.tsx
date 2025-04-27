"use client"

import { useState } from "react"
import { Clock, MapPin, Phone, User, Navigation, CheckCircle2, Package, Truck } from "lucide-react"
import { useOrders } from "@/contexts/orders-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface OrderDetailsProps {
    orderId: string
    onBack: () => void
}

export default function OrderDetails({ orderId, onBack }: OrderDetailsProps) {
    const { orders, updateOrderStatus } = useOrders()
    const order = orders.find((o) => o.id === orderId)

    const [status, setStatus] = useState(order?.status || "pending")

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <h2 className="text-xl font-semibold mb-2">Order not found</h2>
                <Button onClick={onBack}>Back to orders</Button>
            </div>
        )
    }

    const handleStatusChange = (newStatus: "pending" | "in_progress" | "delivered") => {
        setStatus(newStatus)
    }

    const handleUpdateStatus = () => {
        updateOrderStatus(orderId, status)
        toast.success("Status updated", {
            description: `Order #${orderId.slice(-4)} status changed to ${status.replace("_", " ")}`,
        })
    }

    const statusLabels = {
        pending: "Pending",
        in_progress: "In Progress",
        delivered: "Delivered",
    }

    const statusColors = {
        pending: "bg-yellow-500",
        in_progress: "bg-blue-500",
        delivered: "bg-green-500",
    }

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Order #{orderId.slice(-4)}</h2>
                <Badge className={`${statusColors[order.status]} text-white`}>{statusLabels[order.status]}</Badge>
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
                                <span>{order.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{order.customerPhone}</span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <div className="font-medium">Delivery Address</div>
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <span>{order.deliveryAddress}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    Estimated delivery:{" "}
                                    {new Date(order.estimatedDelivery).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-center mt-2">
                            <Button className="w-full" variant="outline">
                                <Navigation className="mr-2 h-4 w-4" />
                                Navigate to Address
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                        <CardDescription>From {order.restaurant}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                    <div className="flex gap-2">
                                        <div className="font-medium">{item.quantity}x</div>
                                        <div>{item.name}</div>
                                    </div>
                                    <div>${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                            <div className="flex justify-between font-medium">
                                <div>Subtotal</div>
                                <div>${order.subtotal.toFixed(2)}</div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <div>Delivery Fee</div>
                                <div>${order.deliveryFee.toFixed(2)}</div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <div>Tax</div>
                                <div>${order.tax.toFixed(2)}</div>
                            </div>
                            <div className="flex justify-between font-bold">
                                <div>Total</div>
                                <div>${order.total.toFixed(2)}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Update Order Status</CardTitle>
                    <CardDescription>Change the current status of this order</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div
                                className={`p-4 rounded-lg border ${status === "pending" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20" : ""}`}
                            >
                                <Package className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                                <div className="font-medium">Pending</div>
                            </div>
                            <div
                                className={`p-4 rounded-lg border ${status === "in_progress" ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : ""}`}
                            >
                                <Truck className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                                <div className="font-medium">In Progress</div>
                            </div>
                            <div
                                className={`p-4 rounded-lg border ${status === "delivered" ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""}`}
                            >
                                <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                                <div className="font-medium">Delivered</div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-4">
                            <div className="font-medium">Select Status</div>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={onBack}>
                        Back to Orders
                    </Button>
                    <Button onClick={handleUpdateStatus}>Update Status</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
