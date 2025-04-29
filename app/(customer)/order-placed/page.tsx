'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheckIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className=" border-blue-100 dark:border-blue-900">
        <CardHeader className="bg-blue-50 dark:bg-blue-950">
          <CardTitle>Order Placed</CardTitle>
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
