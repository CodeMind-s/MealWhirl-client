import { Search, SlidersHorizontal, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RestaurantCard from "@/components/restaurant-card"
import { restaurants } from "@/lib/data"

export default function RestaurantsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Restaurants</h1>
        <p className="text-muted-foreground">Find and order from the best restaurants in your area</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Input
              type="search"
              placeholder="Search for restaurants or cuisines"
              className="pl-10 w-full h-12 bg-white dark:bg-gray-800"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 h-12 bg-white dark:bg-gray-800">
              <MapPin className="h-4 w-4" />
              Location
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-12 bg-white dark:bg-gray-800">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="pickup">Pickup</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-3 w-full sm:w-auto">
            <Select defaultValue="recommended">
              <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="delivery">Fastest Delivery</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  )
}
