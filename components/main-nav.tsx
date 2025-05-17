"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { getCartByUserId } from "@/lib/api/cartApi"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function MainNav() {
  const { cart } = useCart()
  const { user } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (user) {
      setUserId(user._id);
      console.log("User ID:", user._id);
    }
  }, [user]);

  useEffect(() => {
      const fetchCart = async () => {
        try {
          // setIsLoading(true);
          const response = await getCartByUserId(userId);
          
          if(response){
            const cartData:any = response.data;
            setCartItemCount(cartData.itemsByRestaurant[0]?.items.length || 0);
          }
        } catch (error) {
          toast.error("Failed to fetch cart data");
        }
      };
  
      if (userId) {
        fetchCart();
      }
    }, [userId]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
          <div>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-14 w-14 rounded-full p-1.5"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
            MealWhirl
          </span>
        </Link>

        {
          isMobile ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                  <div className="rounded-full bg-primary p-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary-foreground"
                    >
                      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                      <path d="M7 7h.01" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold">MealWhirl</span>
                </div>
                <nav className="flex flex-col gap-4">
                  <Link href="/" className="text-base font-medium hover:text-primary" onClick={() => setIsOpen(false)}>
                    Home
                  </Link>
                  <Link
                    href="/restaurants"
                    className="text-base font-medium hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Restaurants
                  </Link>
                  <Link
                    href="/profile"
                    className="text-base font-medium hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/profile/orders"
                    className="text-base font-medium hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    My Orders
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/restaurants" className="text-sm font-medium hover:text-primary transition-colors">
                Restaurants
              </Link>
              <Link href="/profile/orders" className="text-sm font-medium hover:text-primary transition-colors">
                Orders
              </Link>
              <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                Account
              </Link>
            </nav>
          )
        }

        <div className="flex items-center gap-3">
          <Link href="/cart">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "relative transition-all hover:scale-105",
                cartItemCount > 0 && "border-primary text-primary",
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          {/* <Link href="/profile">
            <Button
              variant="outline"
              size="icon"
              className="transition-all hover:scale-105 hover:border-primary hover:text-primary"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link> */}
        </div>
      </div >
    </header >
  )
}
