'use client'
import Link from "next/link"
import Image from "next/image"
import { Search, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import RestaurantCard from "@/components/restaurant-card"
import { restaurants } from "@/lib/data"

export default function Home() {

  return (
    <div>
      {/* Hero Section with Background */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern-dark opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium mb-3">
                  #1 Food Delivery App
                </span>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700 dark:from-blue-400 dark:to-primary">
                  Delicious Food, Delivered to Your Door
                </h1>
              </div>
              <p className="max-w-[600px] text-gray-600 dark:text-gray-300 text-lg md:text-xl">
                Browse through hundreds of restaurants and order your favorite meals with just a few clicks. Fast
                delivery, easy payment, and real-time order tracking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search for restaurants or cuisines"
                    className="pl-10 w-full h-12 rounded-full border-blue-200 focus-visible:ring-primary"
                  />
                </div>
                <Button size="lg" className="h-12 px-6 rounded-full">
                  Find Food
                </Button>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  500+ Restaurants
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Fast Delivery
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Live Tracking
                </span>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[480px] lg:w-[480px]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-3xl -z-10 transform scale-95"></div>
                <Image
                  src={require("@/assets/burger.png")}
                  alt="Food delivery illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2">Popular Restaurants</h2>
              <p className="text-muted-foreground">Explore our users' favorite food destinations</p>
            </div>
            <Link href="/restaurants" className="text-primary font-medium flex items-center hover:underline mt-2">
              View all restaurants
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.slice(0, 8).map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">How MealWhirl Works</h2>
            <p className="text-muted-foreground text-lg">Order your favorite food in just a few simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="font-medium text-xl mb-3">Choose a restaurant</h3>
              <p className="text-center text-muted-foreground">
                Browse through our wide selection of restaurants and find what you're craving
              </p>
            </div>
            <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="font-medium text-xl mb-3">Select your meals</h3>
              <p className="text-center text-muted-foreground">
                Add your favorite items to your cart and customize them to your liking
              </p>
            </div>
            <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="font-medium text-xl mb-3">Checkout & track</h3>
              <p className="text-center text-muted-foreground">
                Pay securely and track your order in real-time as it makes its way to you
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/restaurants">Start Ordering Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* App Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Why Choose MealWhirl?</h2>
            <p className="text-muted-foreground text-lg">We make food ordering simple, fast and enjoyable</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="font-medium text-xl mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Our delivery partners ensure your food arrives quickly and still hot
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M6 19V5c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v14" />
                  <path d="M12 10v6" />
                  <path d="M10 12h4" />
                  <path d="M4 19h16" />
                  <path d="M2 19h20" />
                </svg>
              </div>
              <h3 className="font-medium text-xl mb-2">Live Order Tracking</h3>
              <p className="text-muted-foreground">Track your order in real-time from the restaurant to your door</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 12h2" />
                  <path d="M6 12h2" />
                  <path d="M12 6v2" />
                  <path d="M12 16v2" />
                </svg>
              </div>
              <h3 className="font-medium text-xl mb-2">Wide Restaurant Selection</h3>
              <p className="text-muted-foreground">Choose from hundreds of restaurants catering to every taste</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                </svg>
              </div>
              <h3 className="font-medium text-xl mb-2">Personalized Experience</h3>
              <p className="text-muted-foreground">Get recommendations based on your preferences and order history</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <circle cx="12" cy="12" r="8" />
                  <path d="m12 16 1-3 3-1-3-1-1-3-1 3-3 1 3 1 1 3Z" />
                </svg>
              </div>
              <h3 className="font-medium text-xl mb-2">Special Offers</h3>
              <p className="text-muted-foreground">
                Enjoy exclusive deals and discounts from your favorite restaurants
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <h3 className="font-medium text-xl mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">Multiple secure payment options for hassle-free transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">Ready to satisfy your cravings?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who use MealWhirl to discover new restaurants and enjoy delicious
              meals delivered to their doorstep.
            </p>
            <Button size="lg" variant="secondary" className="rounded-full px-8">
              <Link href="/restaurants">Browse Restaurants</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
