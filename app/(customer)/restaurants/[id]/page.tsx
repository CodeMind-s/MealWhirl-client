"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Clock, MapPin, Star, Info, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { getUserByCategoryAndId, getUsersByCategory } from "@/lib/api/userApi";
import { USER_CATEGORIES } from "@/constants/userConstants";
import { MenuCategory, MenuItem, Restaurant } from "@/types/Restaurant";
import { mapToRestaurant } from "../page";

export const mapToMenuCategories = (
  menu: any[],
  restaurantId: string
): MenuCategory[] => {
  return menu.map((menuItem) => ({
    id: crypto.randomUUID(), // Generate a unique ID (or replace with actual ID if available)
    restaurantId: restaurantId, // Use the provided restaurantId
    name: menuItem.category, // Map the category field from each menu item
  }));
};

export const mapToMenuItems = (
  menu: any[],
  restaurantId: string,
  categoryIdMap: Record<string, string>
): MenuItem[] => {
  return menu.map((menuItem) => ({
    id: menuItem.name,
    restaurantId: restaurantId, // Use the provided restaurantId
    categoryId: categoryIdMap[menuItem.category] || "unknown", // Map category to categoryId
    name: menuItem.name, // Map the name field
    description: menuItem.description, // Map the description field
    price: menuItem.price, // Map the price field
    image: menuItem.image || undefined, // Map the image field (optional)
    isPopular: menuItem.isPopular || false, // Map the isPopular field (optional)
  }));
};

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [restaurant, setRestaurant] = useState<Restaurant>({
    id: "",
    name: "",
    image: undefined,
    description: "",
    cuisineType: "",
    rating: 0,
    reviewCount: 0,
    deliveryTime: 0,
    deliveryFee: 0,
    minOrder: 0,
    distance: 0,
    isOpen: false,
    isNew: false,
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const data = await getUserByCategoryAndId(
          USER_CATEGORIES.RESTAURANT,
          params.id
        );
        setRestaurant(mapToRestaurant([data])[0]);
        const menuCategories = mapToMenuCategories(data.menu, data.identifier);
        setMenuCategories(menuCategories);
        const categoryIdMap = Object.fromEntries(
          menuCategories.map((category) => [category.name, category.id])
        );
        setMenuItems(mapToMenuItems(data.menu, data.identifier, categoryIdMap));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (params.id) {
      fetchRestaurantData();
    }
  }, [params.id]);

  // Filter menu items by restaurant and category
  const filteredItems = menuItems.filter(
    (item) =>
      item.restaurantId === restaurant.id &&
      (selectedCategory === "all" || item.categoryId === selectedCategory)
  );

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      image: item.image,
    });

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <>
      <div className="relative w-full h-64 md:h-80 bg-blue-100 dark:bg-blue-900">
        <Image
          src={restaurant.image || "/placeholder.svg?height=400&width=1200"}
          alt={restaurant.name}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90"></div>

        <div className="container mx-auto px-4 relative h-full flex items-end pb-8">
          <div>
            <Link
              href="/restaurants"
              className="inline-flex items-center text-white bg-primary/80 hover:bg-primary px-3 py-1 rounded-full text-sm font-medium mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to restaurants
            </Link>
            <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-sm">
              {restaurant.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              {restaurant.description}
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-1">
                <div className="p-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                </div>
                <div>
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    ({restaurant.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="font-medium">
                    {restaurant.deliveryTime} min
                  </span>
                  <span className="text-muted-foreground"> delivery time</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="font-medium">
                    {restaurant.distance} miles
                  </span>
                  <span className="text-muted-foreground"> from you</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-4 flex-wrap">
            <Badge
              variant={restaurant.isOpen ? "default" : "secondary"}
              className="h-8 px-3 text-sm justify-center"
            >
              {restaurant.isOpen ? "Open Now" : "Closed"}
            </Badge>
            <Badge
              variant="outline"
              className="h-8 px-3 text-sm justify-center"
            >
              {restaurant.deliveryFee === 0 ? (
                <span className="text-green-600 dark:text-green-500">
                  Free Delivery
                </span>
              ) : (
                `$${restaurant.deliveryFee.toFixed(2)} Delivery Fee`
              )}
            </Badge>
            <Badge
              variant="outline"
              className="h-8 px-3 text-sm justify-center"
            >
              {restaurant.minOrder
                ? `$${restaurant.minOrder} min order`
                : "No minimum order"}
            </Badge>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="mb-6 flex w-full overflow-x-auto bg-blue-50 dark:bg-blue-950 p-1">
            <TabsTrigger value="all">All</TabsTrigger>
            {menuCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={
                        item.image || "/placeholder.svg?height=200&width=300"
                      }
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {item.isPopular && (
                      <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <span className="font-medium text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full"
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 p-6 rounded-xl bg-blue-50 dark:bg-blue-950">
          <div className="flex items-start gap-3 mb-4">
            <Info className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium text-lg mb-1">
                About {restaurant.name}
              </h3>
              <p className="text-muted-foreground">
                {restaurant.name} specializes in{" "}
                {restaurant.cuisineType.toLowerCase()} cuisine and has been
                serving customers since 2015. All meals are prepared with fresh
                ingredients and made to order.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium text-lg mb-1">Food Safety</h3>
              <p className="text-muted-foreground">
                This restaurant follows enhanced food safety protocols and
                maintains the highest standards of hygiene.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
