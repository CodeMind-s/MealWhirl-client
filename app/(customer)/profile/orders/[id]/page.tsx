"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Package,
  CircleCheckBigIcon,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { use, useEffect, useState } from "react";
import { getOrderById } from "@/lib/api/orderApi";
import { promises } from "dns";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import socket from "@/lib/middleware/socket";

// Dynamically import Map with SSR disabled
const DriverMap = dynamic(
  () => import("../../../../../components/driver/DriverMap"),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);

interface DeliveryAddress {
  latitude: number;
  longitude: number;
  address: string;
}

type PaymentMethod = "CASH" | "CARD";

type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELLED";

interface OrderItem {
  itemName: string;
  quantity: number;
  total: number;
  // Add other item properties as needed
}

interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
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

export default function OrderDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const pathname = usePathname();
  const [orderId, setOrderId] = useState<string | any>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define the coordinates for the map
  const [Latitude, setLatitude] = useState<number>(6.952216);
  const [Longitude, setLongitude] = useState<number>(80.985924);
  const [restLatitude, setRestLatitude] = useState<number>(6.92254243510281);
  const [restLongitude, setRestLongitude] = useState<number>(79.91822361239088);
  const [liveLocation, setLiveLocation] = useState<any>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setOrderId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response: any = await getOrderById(orderId);
        if (response.data) {
          setOrderDetails(response.data);
          setLatitude(response.data.deliveryAddress.latitude);
          setLongitude(response.data.deliveryAddress.longitude);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "An unexpected error occurred. Please try again."
        );
        console.error("Order Details Fetching Failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    socket.on("location_update", (data) => {
      if (data) {
        setLiveLocation(data);
      }
    });
  }, []);

  useEffect(() => {
            console.log("Live Location Data:", liveLocation);
  },  [liveLocation]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PLACED":
        return <Package className="h-4 w-4" />;
      case "ACCEPTED":
        return <CircleCheckBigIcon className="h-4 w-4" />;
      case "PREPARING":
        return <Clock className="h-4 w-4" />;
      case "PICKED_UP":
        return <Truck className="h-4 w-4" />;
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLACED":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "PREPARING":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "PICKED_UP":
        return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";
      case "DELIVERED":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  // Define the order status steps
  const orderSteps = [
    { id: "PLACED", label: "Order Placed", completed: true },
    {
      id: "ACCEPTED",
      label: "Accepted",
      completed: orderDetails?.orderStatus
        ? [
            "ACCEPTED",
            "PREPARING",
            "PICKED_UP",
            "ON_THE_WAY",
            "DELIVERED",
          ].includes(orderDetails.orderStatus)
        : false,
    },
    {
      id: "PREPARING",
      label: "Preparing",
      completed: orderDetails?.orderStatus
        ? ["PREPARING", "PICKED_UP", "ON_THE_WAY", "DELIVERED"].includes(
            orderDetails.orderStatus
          )
        : false,
    },
    {
      id: "PICKED_UP",
      label: "Picked Up",
      completed: orderDetails?.orderStatus
        ? ["PICKED_UP", "ON_THE_WAY", "DELIVERED"].includes(
            orderDetails.orderStatus
          )
        : false,
    },
    {
      id: "ON_THE_WAY",
      label: "On the Way",
      completed: orderDetails?.orderStatus
        ? ["ON_THE_WAY", "DELIVERED"].includes(orderDetails.orderStatus)
        : false,
    },
    {
      id: "DELIVERED",
      label: "Delivered",
      completed: orderDetails?.orderStatus === "DELIVERED",
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-red-500 mb-4">{error}</div>
        <Link
          href="/profile/orders"
          className="inline-flex items-center text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <p>No order details found.</p>
        <Link
          href="/profile/orders"
          className="inline-flex items-center text-primary hover:underline mt-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/profile/orders"
        className="inline-flex items-center text-primary hover:underline mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Order #{orderDetails._id}</h1>
        <Badge
          variant="outline"
          className={`ml-2 flex items-center gap-1 font-normal ${getStatusColor(
            orderDetails.orderStatus
          )}`}
        >
          {getStatusIcon(orderDetails.orderStatus)}
          <span>{orderDetails.orderStatus}</span>
        </Badge>
      </div>

      {orderDetails.orderStatus !== "CANCELLED" && (
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
                        step.completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className="text-xs text-center">{step.label}</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted -z-10" />
            </div>

            {orderDetails.orderStatus !== "DELIVERED" && (
              <div className="mt-6 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  Estimated delivery: {orderDetails.duration || "N/A"} minutes
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Track Delivery</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <DriverMap
                latitude={Latitude}
                longitude={Longitude}
                restLatitude={restLatitude}
                restLongitude={restLongitude}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">Restaurant name</h3>
                  <p className="text-sm text-gray-500">
                    {orderDetails.createdAt
                      ? new Date(orderDetails.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )
                      : ""}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  {orderDetails.items?.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={
                            item.imageUrl ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={item.itemName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{item.itemName}</h4>
                          <span>{formatCurrency(item.total)}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.quentity} x{" "}
                          {formatCurrency(item.total / item.quentity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {formatCurrency(
                        orderDetails.totalAmount - orderDetails.deliveryFee
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{formatCurrency(orderDetails.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>
                      {formatCurrency(orderDetails.deliveryFee * 0.05)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(orderDetails.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {orderDetails.orderStatus === "DELIVERED" && (
            <Card>
              <CardHeader>
                <CardTitle>Rate Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-gray-500">
                    How was your experience with this order?
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant="outline"
                        size="lg"
                        className="h-12 w-12"
                      >
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
                      {orderDetails.deliveryAddress?.address ||
                        "No address provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Contact</h4>
                    <p className="text-sm text-gray-500">phone number</p>
                  </div>
                </div>
              </div>

              {orderDetails.specialInstructions && (
                <div className="space-y-2">
                  <h4 className="font-medium">Delivery Instructions</h4>
                  <p className="text-sm text-gray-500">
                    {orderDetails.specialInstructions}
                  </p>
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
                <p className="text-sm text-gray-500">
                  {orderDetails.paymentMethod || "Not specified"}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Payment Status</h4>
                <Badge variant="default">
                  {orderDetails.paymentMethod === "CASH" ? "Pending" : "Paid"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full">
            Need Help?
          </Button>
        </div>
      </div>
    </div>
  );
}
