"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartSubtotal, deliveryFee, tax } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // In a real app, you would redirect to checkout or process payment
    setTimeout(() => {
      window.location.href = "/checkout"
    }, 1000)
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center py-16 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8 max-w-md">
            Looks like you haven't added any items to your cart yet. Browse our restaurants and find something
            delicious!
          </p>
          <Link href="/restaurants">
            <Button size="lg" className="px-8 rounded-full">
              Browse Restaurants
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Group cart items by restaurant
  const itemsByRestaurant = cart.reduce(
    (acc, item) => {
      if (!acc[item.restaurantId]) {
        acc[item.restaurantId] = {
          restaurantName: item.restaurantName,
          items: [],
        }
      }
      acc[item.restaurantId].items.push(item)
      return acc
    },
    {} as Record<string, { restaurantName: string; items: typeof cart }>,
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/restaurants" className="inline-flex items-center text-primary hover:underline mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(itemsByRestaurant).map(([restaurantId, { restaurantName, items }]) => (
            <Card key={restaurantId} className="overflow-hidden border-blue-100 dark:border-blue-900">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 pb-3">
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-primary"
                    >
                      <path d="M17 12h-3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2.586a1 1 0 0 1 .707.293l.707.707" />
                      <path d="M12 19h5a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2.586a1 1 0 0 0-.707.293l-.707.707" />
                      <path d="M5 15v-3a1 1 0 0 1 1-1h3" />
                      <path d="M5 8v3" />
                      <path d="M8 5H7a2 2 0 0 0-2 2v12" />
                    </svg>
                  </div>
                  {restaurantName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg?height=80&width=80"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20 border-blue-100 dark:border-blue-900">
            <CardHeader className="bg-blue-50 dark:bg-blue-950">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
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
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(cartTotal)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full rounded-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
