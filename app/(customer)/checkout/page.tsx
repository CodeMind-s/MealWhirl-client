"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, CreditCard, MapPin, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { createNewOrder } from "@/lib/api/orderApi";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { usePlacedOrder } from "@/contexts/placed-order-context";
import { useOrders } from "@/contexts/orders-context";

interface ItemsData {
  itemName: string;
  quentity: string;
  total: string;
  imageUrl?: string | any;
}

interface AddressesData {
  address: string;
  latitude: number;
  longitude: number;
}

type PaymentMethod = "CASH" | "CARD";

interface OrderStatusDto {
  userId: string;
  restaurantId: string;
  items: ItemsData[];
  deliveryAddress: AddressesData;
  paymentId: string;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  deliveryFee: number;
  distance: number;
  duration: number;
  fare: number;
  specialInstructions: string;
}

export default function Checkout() {
  const { toast } = useToast();
  const { cart, cartTotal, cartSubtotal, deliveryFee, tax, clearCart } =
    useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<any>("CARD");
  const amount = 49.99;
  const [customerName, setCustomerName] = useState("induwara");
  const [description, setDescription] = useState("Payment for services");
  const [userId, setUserId] = useState<string>("67e43a6dd6708a25582d3aaa1");
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const { setPlacedOrder } = usePlacedOrder();
  const {order, setAddressDetails} = useOrders();

  useEffect(() => {
    console.log("orders", order);
  }, [order]);
 
  const handlePlaceOrder = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true); 
    setAddressDetails(address, instructions);
    router.push("/payment");
    // try {
    //   const data: any = {
    //     userId: userId,
    //     restaurantId: "restaurantId",
    //     items: cart.map((item) => ({
    //       itemName: item.name,
    //       quentity: item.quantity.toString(),
    //       total: item.price.toString(),
    //       imageUrl:
    //         "https://th.bing.com/th/id/OIP.5XZGu7I9rqQc67dpzviiugHaE7?rs=1&pid=ImgDetMain",
    //     })),
    //     deliveryAddress: {
    //       address: address,
    //       latitude: 0,
    //       longitude: 0,
    //     },
    //     paymentId: "paymentid",
    //     paymentMethod: paymentMethod,
    //     totalAmount: cartTotal,
    //     deliveryFee: deliveryFee,
    //     distance: 10,
    //     duration: 30,
    //     fare: 5,
    //     specialInstructions: instructions,
    //   };
    //   setPlacedOrder(data);
    //   const response = await createNewOrder(data);
    //   if (response) {
    //     // clearCart();
    //     router.push("/payment");
    //   }
    // } catch (error: any) {
    //   if (error.response) {
    //     const { data } = error.response;

    //     if (data && data.message) {
    //       toast({
    //         title: "Error",
    //         description: `Order creation failed: ${data.message}`,
    //         variant: "destructive",
    //         action: <ToastAction altText="Try again">Try again</ToastAction>,
    //       });
    //     } else {
    //       toast({
    //         variant: "destructive",
    //         title: "Uh oh! Something went wrong.",
    //         description: "An unexpected error occurred. Please try again.",
    //         action: <ToastAction altText="Try again">Try again</ToastAction>,
    //       });
    //     }
    //   } else {
    //     toast({
    //       variant: "destructive",
    //       title: "Uh oh! Something went wrong.",
    //       description:
    //         "An unexpected error occurred. Please check your network and try again.",
    //       action: <ToastAction altText="Try again">Try again</ToastAction>,
    //     });
    //   }
    // }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order processing
    setTimeout(() => {
      // clearCart();
      toast({
        title: "Order placed successfully!",
        description: "You can track your order in your profile.",
      });
      window.location.href = "/profile/orders";
    }, 2000);
  };

  // if (cart.length === 0) {
  //   return (
  //     <div className="container mx-auto px-4 py-8 max-w-4xl">
  //       <div className="text-center py-12">
  //         <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
  //         <p className="text-gray-500 mb-8">
  //           You need to add items to your cart before checkout.
  //         </p>
  //         <Link href="/restaurants">
  //           <Button>Browse Restaurants</Button>
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link
        href="/cart"
        className="inline-flex items-center text-primary hover:underline mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Cart
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <div className="flex items-center mt-2 sm:mt-0 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 mr-1 text-primary" />
          Secure Checkout
        </div>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-blue-100 dark:border-blue-900">
            <CardHeader className="bg-blue-50 dark:bg-blue-950">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">
                  Delivery Instructions (Optional)
                </Label>
                <Textarea
                  id="instructions"
                  placeholder="E.g., Ring the doorbell, leave at the door, etc."
                  className="resize-none"
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20 border-blue-100 dark:border-blue-900">
            <CardHeader className="bg-blue-50 dark:bg-blue-950">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {order?.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="flex-1">
                      {item.quentity} x {item.itemName}
                    </span>
                    <span className="font-medium">
                      {item.total}
                    </span>
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
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full rounded-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-4 p-4 rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your payment information is encrypted and securely processed.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
