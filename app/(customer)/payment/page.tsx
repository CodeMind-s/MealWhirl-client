"use client";

import { use, useEffect, useState } from "react";
import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/contexts/orders-context";
import { set } from "date-fns";
import { createNewOrder } from "@/lib/api/orderApi";
import { ToastAction } from "@/components/ui/toast";
import { createNewTransaction } from "@/lib/api/paymentApi";
import { createNotification, sendEmailNotification, sendSMSNotification } from "@/lib/api/notificationApi";
import { useAuth } from "@/contexts/auth-context";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const { user } = useAuth();
  const amount = 49.99;
  const [customerName, setCustomerName] = useState("induwara");
  const [description, setDescription] = useState("Payment for services");
  const [paymentMethod, setPaymentMethod] = useState<any>("CARD");
  const { cart, cartTotal, cartSubtotal, deliveryFee, tax, clearCart } =
    useCart();
  const router = useRouter();
  const { toast } = useToast();
  const { order, setOrderPaymentMethod } = useOrders();

  useEffect(() => {
    setOrderPaymentMethod(paymentMethod);
    localStorage.setItem("order", JSON.stringify(order));
  }, [paymentMethod]);

  const handleNavigate = async () => {
    try {
      const paymentData: any = {
        userId: order.userId,
        totalAmount: order.totalAmount,
        deliveryFee: order.deliveryFee,
        paymentMethod: paymentMethod,
        paymentStatus: "PENDING",
        paymentGatewayTransactionId: "",
        description: description,
      };

      // setPlacedOrder(data);
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
          items: order.items.map((item) => ({
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
          paymentMethod: paymentMethod,
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
          clearCart();

          // Explicitly type the response data
          const responseData = response.data as { _id: string };

          // Send email notification
          const emailNotification = {
            email: user?.email || "customer@example.com", // Use actual customer email from user context
            order: {
              _id: responseData._id,
              items: order.items.map((item) => ({
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
            console.error("Failed to send email notification:", emailError);
          }

          const smsData = {
            to: "94774338424", // Assuming phone number is part of deliveryAddress
            message: 'MealWhirl\n\nYour order has been placed successfully!',
          };

          try {
            await sendSMSNotification(smsData);
            console.log("SMS notification sent successfully.");
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

          // Create notification for the customer
          const customerNotification = {
            userId: order.userId, // Use the actual customer user ID
            title: "Order Placed Successfully",
            message: `Your order has been placed successfully! Order ID: ${responseData._id}. Thank you for choosing MealWhirl.`,
          };

          try {
            await createNotification(customerNotification);
            console.log("Customer notification sent successfully.");
          } catch (customerNotificationError) {
            console.error("Error sending customer notification:", customerNotificationError);
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
            message: `A new order has been placed! Order ID: ${responseData._id}. Please prepare the order.`,
          };

          try {
            await createNotification(restaurantNotification);
            console.log("Restaurant notification sent successfully.");
          } catch (restaurantNotificationError) {
            console.error("Error sending restaurant notification:", restaurantNotificationError);
            toast({
              variant: "destructive",
              title: "Notification Error",
              description: "Failed to send notification to the restaurant.",
            });
          }

          // router.push("/order-placed");
          // router.refresh();
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
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {order?.items?.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="flex-1">
                  {item.quentity} × {item.itemName}
                </span>
                <span className="font-medium">{item.total}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span className="text-primary">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>

          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
              <RadioGroupItem value="CARD" id="CARD" />
              <Label htmlFor="CARD" className="flex-1 cursor-pointer">
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
              <RadioGroupItem value="CASH" id="CASH" />
              <Label htmlFor="CASH" className="flex-1 cursor-pointer">
                Cash on Delivery
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="!p-4">
          {paymentMethod === "CASH" && (
            <button
              onClick={handleNavigate}
              className="text-white w-full bg-blue-600 h-11 mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
            >
              Checkout
            </button>
          )}

          {paymentMethod == "CARD" && (
            <div className=" w-full flex justify-center items-center">
              <div className="w-full">
                <p className="font-medium text-lg p-2">Payment Details</p>
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: "payment",
                    amount: convertToSubcurrency(order.totalAmount),
                    currency: "usd",
                  }}
                >
                  <CheckoutPage
                    amount={order.totalAmount}
                    customerName={customerName}
                    description={description}
                  />
                </Elements>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
