"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, ChevronDown, Filter, MoreHorizontal, Search, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RestaurantDetailsModal } from "../../components/super/restaurant-details-modal"
import { toast } from "@/components/ui/use-toast"

const initialRestaurants = [
  {
    id: 1,
    name: "Gourmet Delights",
    owner: "John Smith",
    location: "New York, NY",
    cuisine: "Fine Dining",
    status: "active",
    rating: 4.8,
    orders: 1245,
    revenue: "$42,580",
    joinDate: "Jan 15, 2023",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Pasta Paradise",
    owner: "Maria Garcia",
    location: "Chicago, IL",
    cuisine: "Italian",
    status: "active",
    rating: 4.7,
    orders: 1120,
    revenue: "$38,290",
    joinDate: "Feb 3, 2023",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Burger Bliss",
    owner: "Robert Johnson",
    location: "Los Angeles, CA",
    cuisine: "American",
    status: "active",
    rating: 4.6,
    orders: 1350,
    revenue: "$35,670",
    joinDate: "Mar 22, 2023",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "Sushi Supreme",
    owner: "Yuki Tanaka",
    location: "Seattle, WA",
    cuisine: "Japanese",
    status: "active",
    rating: 4.9,
    orders: 980,
    revenue: "$32,450",
    joinDate: "Apr 10, 2023",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Pizza Palace",
    owner: "Tony Romano",
    location: "Boston, MA",
    cuisine: "Italian",
    status: "active",
    rating: 4.5,
    orders: 1050,
    revenue: "$29,780",
    joinDate: "May 5, 2023",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 6,
    name: "Taco Time",
    owner: "Carlos Mendez",
    location: "Austin, TX",
    cuisine: "Mexican",
    status: "pending",
    rating: 0,
    orders: 0,
    revenue: "$0",
    joinDate: "Jun 18, 2023",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 7,
    name: "Curry Corner",
    owner: "Priya Patel",
    location: "San Francisco, CA",
    cuisine: "Indian",
    status: "inactive",
    rating: 4.2,
    orders: 720,
    revenue: "$18,450",
    joinDate: "Jul 7, 2023",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 8,
    name: "Noodle House",
    owner: "Liu Wei",
    location: "Portland, OR",
    cuisine: "Chinese",
    status: "active",
    rating: 4.4,
    orders: 890,
    revenue: "$24,670",
    joinDate: "Aug 12, 2023",
    image: "/placeholder.svg?height=50&width=50",
  },
]

export function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState(initialRestaurants)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null)

  const handleViewDetails = (restaurant: any) => {
    setSelectedRestaurant(restaurant)
    setIsDetailsModalOpen(true)
  }

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setRestaurants(
      restaurants.map((restaurant) => (restaurant.id === id ? { ...restaurant, status: newStatus } : restaurant)),
    )

    toast({
      title: "Restaurant status updated",
      description: `Restaurant status has been updated to ${newStatus}`,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
        <p className="text-muted-foreground">Manage all restaurants in the system.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurants.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {restaurants.filter((r) => r.status === "active").length} active restaurants
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurants.filter((r) => r.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Restaurants waiting for approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {(
                restaurants.filter((r) => r.status === "active").reduce((acc, r) => acc + r.rating, 0) /
                restaurants.filter((r) => r.status === "active").length
              ).toFixed(1)}
              <Star className="h-4 w-4 ml-1 fill-amber-500 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all active restaurants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$221,890</div>
            <p className="text-xs text-muted-foreground mt-1">Combined monthly revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Restaurants</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[180px] lg:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search restaurants..." className="w-full pl-8 bg-background" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Cuisine</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Italian</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>American</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Japanese</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Mexican</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Indian</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Chinese</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Rating</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>4.5+</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>4.0+</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>3.5+</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="mr-2 h-4 w-4" />
              Date
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4">
            <CardTitle>All Restaurants</CardTitle>
            <CardDescription>Showing {restaurants.length} restaurants</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Restaurant</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden md:table-cell">Cuisine</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="hidden lg:table-cell">Orders</TableHead>
                  <TableHead className="hidden lg:table-cell">Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <Image
                            src={restaurant.image || "/placeholder.svg"}
                            alt={restaurant.name}
                            width={50}
                            height={50}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{restaurant.name}</div>
                          <div className="text-xs text-muted-foreground">{restaurant.owner}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{restaurant.location}</TableCell>
                    <TableCell className="hidden md:table-cell">{restaurant.cuisine}</TableCell>
                    <TableCell>
                      {restaurant.status !== "pending" ? (
                        <div className="flex items-center">
                          {restaurant.rating}
                          <Star className="h-3 w-3 ml-1 fill-amber-500 text-amber-500" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {restaurant.status !== "pending" ? restaurant.orders : "N/A"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {restaurant.status !== "pending" ? restaurant.revenue : "N/A"}
                    </TableCell>
                    <TableCell>
                      <RestaurantStatus status={restaurant.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(restaurant)}>
                            View details
                          </DropdownMenuItem>
                          {restaurant.status === "pending" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(restaurant.id, "active")}>
                              Approve restaurant
                            </DropdownMenuItem>
                          )}
                          {restaurant.status === "active" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(restaurant.id, "inactive")}>
                              Deactivate restaurant
                            </DropdownMenuItem>
                          )}
                          {restaurant.status === "inactive" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(restaurant.id, "active")}>
                              Activate restaurant
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Contact owner</DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-500">Remove restaurant</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedRestaurant && (
        <RestaurantDetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          restaurant={selectedRestaurant}
          onStatusUpdate={(id, status) => handleUpdateStatus(id, status)}
        />
      )}
    </div>
  )
}

function RestaurantStatus({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === "active" && "border-emerald-500 text-emerald-500",
        status === "pending" && "border-amber-500 text-amber-500",
        status === "inactive" && "border-slate-500 text-slate-500",
      )}
    >
      {status}
    </Badge>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

export default RestaurantsPage
