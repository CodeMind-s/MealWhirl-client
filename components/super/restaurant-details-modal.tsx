"use client"

import Image from "next/image"
import { Check, ChevronRight, Clock, DollarSign, MapPin, Phone, Star, Store, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RestaurantDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  restaurant: any
  onStatusUpdate: (id: number, status: string) => void
}

export function RestaurantDetailsModal({
  open,
  onOpenChange,
  restaurant,
  onStatusUpdate,
}: RestaurantDetailsModalProps) {
  const handleStatusUpdate = (status: string) => {
    onStatusUpdate(restaurant.id, status)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Restaurant Details
          </DialogTitle>
          <DialogDescription>View and manage restaurant information.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="rounded-md overflow-hidden h-40 w-full">
                  <Image
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    width={300}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        restaurant.status === "active" && "border-emerald-500 text-emerald-500",
                        restaurant.status === "pending" && "border-amber-500 text-amber-500",
                        restaurant.status === "inactive" && "border-slate-500 text-slate-500",
                      )}
                    >
                      {restaurant.status}
                    </Badge>
                    {restaurant.status !== "pending" && (
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span className="ml-1 text-sm">{restaurant.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    Joined {restaurant.joinDate}
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground">{restaurant.cuisine} Cuisine</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Owner:</span>
                      <span>{restaurant.owner}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Location:</span>
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Contact:</span>
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {restaurant.status !== "pending" && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Revenue:</span>
                          <span>{restaurant.revenue} / month</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Orders:</span>
                          <span>{restaurant.orders} completed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Commission:</span>
                          <span>15% per order</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Restaurant Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {restaurant.name} is a {restaurant.cuisine.toLowerCase()} restaurant located in{" "}
                    {restaurant.location}.
                    {restaurant.status !== "pending"
                      ? ` With a rating of ${restaurant.rating}/5 stars and over ${restaurant.orders} orders completed, it's one of our ${
                          restaurant.rating >= 4.7 ? "top-performing" : "reliable"
                        } partners.`
                      : " This restaurant is currently pending approval to join our platform."}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="menu" className="space-y-4 pt-4">
            <div className="text-center py-8">
              <Store className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium">Menu Information</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {restaurant.status === "pending"
                  ? "Menu will be available after restaurant approval."
                  : `${restaurant.name} has 24 items across 6 categories in their menu.`}
              </p>
              <Button variant="outline" className="mt-4">
                View Full Menu
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="orders" className="space-y-4 pt-4">
            <div className="text-center py-8">
              <Store className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium">Order History</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {restaurant.status === "pending"
                  ? "Order history will be available after restaurant approval."
                  : `${restaurant.name} has completed ${restaurant.orders} orders with a total revenue of ${restaurant.revenue}.`}
              </p>
              <Button variant="outline" className="mt-4">
                View Order History
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          {restaurant.status === "pending" && (
            <Button variant="default" onClick={() => handleStatusUpdate("active")}>
              <Check className="mr-2 h-4 w-4" />
              Approve Restaurant
            </Button>
          )}
          {restaurant.status === "active" && (
            <Button variant="destructive" onClick={() => handleStatusUpdate("inactive")}>
              Deactivate Restaurant
            </Button>
          )}
          {restaurant.status === "inactive" && (
            <Button variant="default" onClick={() => handleStatusUpdate("active")}>
              Activate Restaurant
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
