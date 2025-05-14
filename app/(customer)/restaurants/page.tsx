"use client";

import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RestaurantCard from "@/components/restaurant-card";
import { useEffect, useState } from "react";
import { getUsersByCategory } from "@/lib/api/userApi";
import { USER_CATEGORIES } from "@/constants/userConstants";
import { Restaurant } from "@/types/Restaurant";

export const mapToRestaurant = (data: any[]): Restaurant[] => {
  return data.map((restaurant) => ({
    id: restaurant.identifier,
    name: restaurant.name,
    image: restaurant.profilePicture || undefined,
    description: `${restaurant.address.street}, ${restaurant.address.city}`,
    cuisineType: "Unknown", // Replace with actual cuisine type if available
    rating: restaurant.ratings.average,
    reviewCount: restaurant.ratings.count,
    deliveryTime: Math.floor(Math.random() * (60 - 20 + 1)) + 20, // Random delivery time between 20 and 60 minutes
    deliveryFee: parseFloat((Math.random() * (10 - 2) + 2).toFixed(2)), // Random delivery fee between $2.00 and $10.00
    minOrder: Math.floor(Math.random() * (50 - 10 + 1)) + 10, // Random minimum order between $10 and $50
    distance: parseFloat((Math.random() * (20 - 1) + 1).toFixed(1)), // Random distance between 1 and 20 miles
    isOpen: restaurant.accountStatus === "active",
    isNew:
      new Date().getTime() - new Date(restaurant.createdAt).getTime() <
      30 * 24 * 60 * 60 * 1000, // Check if created within the last 30 days
  }));
};

export default function RestaurantsPage() {
  // const [restaurants, setRestaurants] = useState<any>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchRestaurantData = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await getUsersByCategory(USER_CATEGORIES.RESTAURANT);
  //       setRestaurants(mapToRestaurant(data));
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchRestaurantData();
  // }, []);

   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        const transformedData = (data as any[]).map((restaurant) => ({
          id: restaurant._id || "default-id", // Default id
          name: restaurant.refID?.name || "Default Restaurant", // Default name
          description: "No description available",
          cuisineType: "Various",
          rating: 0,
          imageUrl: "/default-restaurant.jpg", // Default image
          email: restaurant.email || "dummyemail@example.com",
          phone: restaurant.phone || "0000000000",
          type: restaurant.type || "Restaurant",
          isAdmin: restaurant.isAdmin || false,
          reviewCount: 0,
          deliveryTime: 30,
          deliveryFee: 0,
          distance: "2 km",
          isOpen: true,
          refID: restaurant.refID || {
            address: {
              street: "123 Main St",
              latitude: 40.7128,
              longitude: -74.006,
            },
            id: "default-ref-id",
            name: "Default Ref Name",
            __v: 0,
          },
          createdAt: restaurant.createdAt || new Date().toISOString(),
          __v: restaurant.__v || 0,
        }));
        setRestaurants(transformedData);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
  
    useEffect(() => {
      fetchRestaurants();
    }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Restaurants</h1>
        <p className="text-muted-foreground">
          Find and order from the best restaurants in your area
        </p>
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
            <Button
              variant="outline"
              className="flex items-center gap-2 h-12 bg-white dark:bg-gray-800"
            >
              <MapPin className="h-4 w-4" />
              Location
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 h-12 bg-white dark:bg-gray-800"
            >
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
          {restaurants.slice(0, 8).map((restaurant) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
      </div>
    </div>
  );
}
