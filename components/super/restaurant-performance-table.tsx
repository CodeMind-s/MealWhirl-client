"use client"

import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const topRestaurants = [
  {
    id: 1,
    name: "Gourmet Delights",
    revenue: "$42,580",
    orders: 1245,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Pasta Paradise",
    revenue: "$38,290",
    orders: 1120,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Burger Bliss",
    revenue: "$35,670",
    orders: 1350,
    rating: 4.6,
  },
  {
    id: 4,
    name: "Sushi Supreme",
    revenue: "$32,450",
    orders: 980,
    rating: 4.9,
  },
  {
    id: 5,
    name: "Pizza Palace",
    revenue: "$29,780",
    orders: 1050,
    rating: 4.5,
  },
]

export function RestaurantPerformanceTable() {
  return (
    <div className="space-y-4">
      {topRestaurants.map((restaurant) => (
        <div key={restaurant.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <span className="font-medium text-primary">{restaurant.id}</span>
            </div>
            <div>
              <div className="font-medium">{restaurant.name}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                <span>{restaurant.rating}</span>
                <span className="mx-1">•</span>
                <span>{restaurant.orders} orders</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium">{restaurant.revenue}</div>
              <div className="text-xs text-muted-foreground">Monthly</div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
