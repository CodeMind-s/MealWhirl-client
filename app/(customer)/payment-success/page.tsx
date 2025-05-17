"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { removeItemFromCart } from "@/lib/api/cartApi";
import {
  createNotification,
  sendEmailNotification,
  sendSMSNotification,
} from "@/lib/api/notificationApi";
import { createNewOrder } from "@/lib/api/orderApi";
import { createNewTransaction } from "@/lib/api/paymentApi";
import { CircleCheckIcon } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function PaymentSuccess({
  searchParams: { amount, payment_intent, redirect_status },
}: {
  searchParams: {
    amount: string;
    payment_intent: string;
    redirect_status: string;
  };
}) {
  const [order, setOrder] = useState<any>();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const storedOrder = localStorage.getItem("order");
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      setOrder(parsedOrder);
    }
  }, []);

  useEffect(() => {
    if (payment_intent && order && redirect_status == "succeeded") {
      handleCreateOrder();
    }
  }, [order, payment_intent, redirect_status]);

  const handleCreateOrder = async () => {
    try {
      const paymentData: any = {
        userId: order.userId,
        totalAmount: order.totalAmount,
        deliveryFee: order.deliveryFee,
        paymentMethod: "CARD",
        paymentStatus: "PENDING",
        paymentGatewayTransactionId: payment_intent,
        description: "Payment for Food Order",
      };

      const paymentResponse: any = await createNewTransaction(paymentData);
      if (paymentResponse) {
        toast({
          title: "Success",
          description: "Payment created successfully!",
          variant: "default",
        });

        const data: any = {
          userId: order.userId,
          restaurantId: order.restaurantId,
          items: order.items.map((item: any) => ({
            itemName: item.itemName,
            quentity: item.quentity.toString(),
            total: item.total.toString(),
            imageUrl: item.imageUrl,
          })),
          deliveryAddress: {
            address: order.deliveryAddress.address,
            latitude: order.deliveryAddress.latitude,
            longitude: order.deliveryAddress.longitude,
          },
          paymentId: paymentResponse.data._id,
          paymentMethod: "CARD",
          totalAmount: order.totalAmount,
          deliveryFee: order.deliveryFee,
          distance: order.distance,
          duration: order.duration,
          fare: order.fare,
          specialInstructions: order.specialInstructions,
        };

        const response = await createNewOrder(data);
        if (response) {
          toast({
            title: "Success",
            description: "Order created successfully!",
            variant: "default",
          });

          const cartData = {
            cartId: order.cartId,
            updates: {
              type: "clear" as "clear",
            },
          };

          await removeItemFromCart(cartData);

          // Explicitly type the response data
          const responseData = response.data as { _id: string };

          // Send email notification
          const emailNotification = {
            email: user?.email || "customer@example.com", // Use actual customer email from user context
            order: {
              _id: responseData._id,
              items: order.items.map((item: any) => ({
                name: item.itemName,
                quantity: item.quentity.toString(),
                price: item.total.toString(),
              })),
              subtotal: order.subTotal?.toString() ?? "0",
              deliveryFee: order.deliveryFee?.toString() ?? "0",
              tax: order.tax?.toString() ?? "0",
              totalAmount: order.totalAmount?.toString() ?? "0",
              deliveryAddress: order.deliveryAddress?.address || "",
              estimatedDelivery: "30 minutes",
              status: "PLACED",
            },
          };

          try {
            console.log(`emailNotification => `, emailNotification);
            await sendEmailNotification(emailNotification);
          } catch (emailError) {
            // console.error("Failed to send email notification:", emailError);
          }

          const smsData = {
            to: "94774338424", // Use phone from deliveryAddress if available
            message: `MealWhirl\n\nHi ${
              user?.name || "Customer"
            },\nYour order has been placed successfully!\nItems: ${order.items
              .map((item: any) => `${item.itemName} x${item.quentity}`)
              .join(", ")}\n\nTotal: Rs. ${order.totalAmount}`,
          };

          try {
            await sendSMSNotification(smsData);
            console.log("SMS notification sent successfully.");
            toast({
              title: "Notification Sent",
              description: "Customer has been notified via SMS.",
            });
          } catch (smsError) {
            // console.error("Error sending SMS notification:", smsError);
            toast({
              variant: "destructive",
              title: "Notification Error",
              description: "Failed to send SMS notification to the customer.",
            });
          }

          // Create notification for the customer
          const customerNotification = {
            userId: order.userId, // Use the actual customer user ID
            title: "Order Placed Successfully",
            message: `Your order has been placed successfully!\n\nItems: ${order.items
              .map((item: any) => `${item.itemName} x${item.quentity}`)
              .join(", ")}\nTotal Amount: Rs. ${
              order.totalAmount
            }\nThank you for choosing MealWhirl.`,
          };

          try {
            await createNotification(customerNotification);
            console.log("Customer notification sent successfully.");
          } catch (customerNotificationError) {
            // console.error("Error sending customer notification:", customerNotificationError);
            toast({
              variant: "destructive",
              title: "Notification Error",
              description: "Failed to send notification to the customer.",
            });
          }

          // Create notification for the restaurant
          const restaurantNotification = {
            userId: order.restaurantId, // Use the actual restaurant user ID
            title: "New Order Received",
            message: `A new order has been placed!\n\nOrder ID: ${
              responseData._id
            }\nItems: ${order.items
              .map((item: any) => `${item.itemName} x${item.quentity}`)
              .join(", ")}\nTotal Amount: Rs. ${
              order.totalAmount
            }\nPlease prepare the order.`,
          };

          try {
            await createNotification(restaurantNotification);
            console.log("Restaurant notification sent successfully.");
          } catch (restaurantNotificationError) {
            // console.error("Error sending restaurant notification:", restaurantNotificationError);
            toast({
              variant: "destructive",
              title: "Notification Error",
              description: "Failed to send notification to the restaurant.",
            });
          }
        }
      }
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            title: "Error",
            description: `Order creation failed: ${data.message}`,
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

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className=" border-blue-100 dark:border-blue-900">
        <CardHeader className="bg-blue-50 dark:bg-blue-950">
          <CardTitle>Payment {redirect_status}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6">
              <CircleCheckIcon className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
            <p className="text-gray-500 mb-8 max-w-md">
              Your order has been placed successfully! the order will be
              delivered to you shortly.
            </p>
            <Link href="/profile/orders">
              <Button size="lg" className="px-8 rounded-full">
                Browse Orders
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
