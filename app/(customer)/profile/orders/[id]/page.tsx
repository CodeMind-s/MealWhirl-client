"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, MapPin, Phone, Clock, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { orders } from "@/lib/data"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  // Find the order by ID
  const order = orders.find((o) => o.id === params.id) || orders[0]

  // Define the order status steps
  const orderSteps = [
    { id: "placed", label: "Order Placed", completed: true },
    {
      id: "processing",
      label: "Processing",
      completed: ["processing", "preparing", "delivering", "completed"].includes(order.status),
    },
    { id: "preparing", label: "Preparing", completed: ["preparing", "delivering", "completed"].includes(order.status) },
    { id: "delivering", label: "On the Way", completed: ["delivering", "completed"].includes(order.status) },
    { id: "completed", label: "Delivered", completed: order.status === "completed" },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/profile/orders" className="inline-flex items-center text-primary hover:underline mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
        <Badge
          variant={order.status === "completed" ? "default" : order.status === "cancelled" ? "destructive" : "outline"}
          className="text-sm px-3 py-1"
        >
          {order.status}
        </Badge>
      </div>

      {order.status !== "cancelled" && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex justify-between mb-2">
                {orderSteps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                        step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="h-5 w-5" /> : <span>{index + 1}</span>}
                    </div>
                    <span className="text-xs text-center">{step.label}</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted -z-10" />
            </div>

            {order.status !== "completed" && (
              <div className="mt-6 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>Estimated delivery: {order.estimatedDelivery}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{order.restaurant}</h3>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{item.name}</h4>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{formatCurrency(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.status === "completed" && (
            <Card>
              <CardHeader>
                <CardTitle>Rate Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-gray-500">How was your experience with this order?</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button key={rating} variant="outline" size="lg" className="h-12 w-12">
                        {rating}
                      </Button>
                    ))}
                  </div>
                  <Button className="mt-4">Submit Rating</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Delivery Address</h4>
                    <p className="text-sm text-gray-500">
                      {order.deliveryAddress.street}
                      <br />
                      {order.deliveryAddress.city}, {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Contact</h4>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                  </div>
                </div>
              </div>

              {order.deliveryInstructions && (
                <div className="space-y-2">
                  <h4 className="font-medium">Delivery Instructions</h4>
                  <p className="text-sm text-gray-500">{order.deliveryInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Payment Method</h4>
                <p className="text-sm text-gray-500">{order.paymentMethod}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Payment Status</h4>
                <Badge variant={order.paymentStatus === "Paid" ? "default" : "outline"}>{order.paymentStatus}</Badge>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full">
            Need Help?
          </Button>
        </div>
      </div>
    </div>
  )
}
