import Link from "next/link"
import Image from "next/image"
import { Star, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import type { Restaurant } from "@/lib/types"

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  rating: number;
  imageUrl: string;
  email: string;
  phone: string;
  type: string;
  isAdmin: boolean;
  reviewCount: number;
  deliveryTime: number;
  deliveryFee: number;
  distance: string;
  isOpen: boolean;
  refID: {
    address: {
      street: string;
      latitude: number;
      longitude: number;
    };
    id: string;
    name: string;
    __v: number;
  };
  createdAt: string;
  __v: number;
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md hover:border-primary/50 group">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={restaurant.imageUrl || "/placeholder.svg?height=200&width=300"}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* {restaurant.isNew && <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary">New</Badge>} */}
          {restaurant.isOpen ? (
            <Badge variant="secondary" className="absolute bottom-2 left-2">
              Open Now
            </Badge>
          ) : (
            <Badge variant="outline" className="absolute bottom-2 left-2 bg-background/80">
              Closed
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">{restaurant.cuisineType}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{restaurant.deliveryTime} min</span>
            <span>•</span>
            <span>
              {Number(restaurant.deliveryFee) === 0 ? (
                <span className="text-green-600 dark:text-green-500 font-medium">Free delivery</span>
              ) : (
                `$${Number(restaurant.deliveryFee).toFixed(2)} delivery`
              )}
            </span>
          </div>
        </CardContent>
        {/* <CardFooter className="p-4 pt-0 text-sm">
          <p className="text-primary">
            {restaurant.minOrder ? `$${restaurant.minOrder} min order` : "No minimum order"}
          </p>
        </CardFooter> */}
      </Card>
    </Link>
  )
}
