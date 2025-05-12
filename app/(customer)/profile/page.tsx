"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, MapPin, Settings, ShoppingBag, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { orders } from "@/lib/data"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { logout } = useAuth();

  // Get recent orders (last 3)
  const recentOrders = orders.slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <CardTitle>John Doe</CardTitle>
                <CardDescription>john.doe@example.com</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">123 Main St, Anytown, CA 12345</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Member since Jan 2023</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{orders.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Favorites</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">5</p>
              </CardContent>
            </Card>
          </div>
          <br />
          <Card>
            <CardHeader>
              <CardTitle>Logout</CardTitle>
              <CardDescription>Click the button below to log out of your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link href="/profile/orders">
                  <Button variant="link">View All</Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "cancelled"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <CardDescription>{order.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div>
                        <h3 className="font-medium">{order.restaurant}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {order.items.map((item, index) => (
                            <span key={index}>
                              {item.quantity} × {item.name}
                              {index < order.items.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/profile/orders/${order.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p>John Doe</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p>john.doe@example.com</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p>+1 (555) 123-4567</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date of Birth</p>
                        <p>January 1, 1990</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Addresses
                    </h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Home</p>
                            <p className="text-sm text-gray-500">
                              123 Main St
                              <br />
                              Anytown, CA 12345
                            </p>
                          </div>
                          <Badge>Default</Badge>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Work</p>
                            <p className="text-sm text-gray-500">
                              456 Office Blvd
                              <br />
                              Anytown, CA 12345
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Add New Address
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Payment Methods
                    </h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-gray-500">Expires 12/25</p>
                          </div>
                          <Badge>Default</Badge>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Add Payment Method
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
