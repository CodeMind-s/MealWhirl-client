"use client";

import { useState } from "react";
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

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const amount = 49.99;
  const [customerName, setCustomerName] = useState("induwara");
  const [description, setDescription] = useState("Payment for services");
  const [paymentMethod, setPaymentMethod] = useState<any>("CARD");
  const { cart, cartTotal, cartSubtotal, deliveryFee, tax, clearCart } =
    useCart();
  const router = useRouter();
  const { toast } = useToast();

  const handleNavigate = () => {
    toast({
      title: "Success",
      description: "Order created successfully!",
      variant: "default",
    });
    clearCart();
    router.push("/order-placed");
    router.refresh();
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className=" border-blue-100 dark:border-blue-900">
        <CardHeader className="bg-blue-50 dark:bg-blue-950">
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="flex-1">
                  {item.quantity} × {item.name}
                </span>
                <span className="font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(cartTotal)}</span>
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
                    amount: convertToSubcurrency(cartTotal),
                    currency: "usd",
                  }}
                >
                  <CheckoutPage
                    amount={cartTotal}
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
