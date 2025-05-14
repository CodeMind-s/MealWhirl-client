"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { Bell, ChevronLeft, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import OrderCard from "@/components/driver/OrderCard";
import OrderDetails from "@/components/driver/OrderDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrdersProvider, useOrders } from "@/contexts/orders-context";
import { logout } from "@/lib/actions";
import { getUserFromCookie } from "@/lib/auth";
import { getAllOrders, getOrdersByDeliveryPersonId } from "@/lib/api/orderApi";
import { useToast } from "@/hooks/use-toast";
import notifySound from "@/assets/audio/notify.mp3";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function Dashboard() {
  return (
    <OrdersProvider>
      <DashboardContent />
    </OrdersProvider>
  );
}

function DashboardContent() {
  // const { orders } = useOrders();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [deliveryPersonId, setDeliveryPersonId] = useState<string>("");
  const [todayOrders, setTodayOrders] = useState<any>([]);
  const [pendingOrders, setPendingOrders] = useState<any>([]);
  const [inProgressOrders, setInProgressOrders] = useState<any>([]);
  const [completedOrders, setCompletedOrders] = useState<any>([]);
  const [driverOrders, setDriverOrders] = useState<any>([]);

  // Add a state to track if audio is enabled
  const [audioEnabled, setAudioEnabled] = useState(false);

  // const [userId, setUserId] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setDeliveryPersonId(user?._id);
    }
  }, [user]);

  // console.log(`deliveryPersonId => `, deliveryPersonId);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await getOrdersByDeliveryPersonId(user?._id ?? "");
        if (response.data) {
          setDriverOrders(response.data);
          console.log(`driverOrders => `, response.data);
          // Check for orders with status "READY_TO_PICKUP"
          const readyToPickupOrders = Array.isArray(response.data)
            ? response.data.filter(
              (order: any) => order.orderStatus === "REDY_FOR_PICKUP"
            )
            : [];

          if (readyToPickupOrders.length > 0 && audioEnabled) {
            // Play sound notification
            const audio = new Audio(notifySound);
            audio.play().catch((e) => {
              console.warn('Audio play blocked:', e);
            });

            toast({
              title: "New Orders Ready to Pickup",
              description: `${readyToPickupOrders.length} orders are ready to pickup.`,
              variant: "default",
            });

            // Show browser push notification
            if (Notification.permission === "granted") {
              readyToPickupOrders.forEach((order: any) => {
                new Notification("Order Ready for Pickup", {
                  body: `Order #${order._id} is ready for pickup.`,
                  icon: "/images/logo.png", // Replace with your app's logo
                });
              });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  readyToPickupOrders.forEach((order: any) => {
                    new Notification("Order Ready for Pickup", {
                      body: `Order #${order._id} is ready for pickup.`,
                      icon: "/images/logo.png", // Replace with your app's logo
                    });
                  });
                }
              });
            }
          }
        }
      } catch (err: any) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            console.log(`Order Details Fetching Failed: ${data.message}`);
          } else {
            console.log("An unexpected error occurred. Please try again.");
          }
        } else {
          console.log(
            "An unexpected error occurred. Please check your network and try again."
          );
        }
      }
    };

    fetchOrderDetails();
  }, [audioEnabled]);

  useEffect(() => {
    const filterTodayOrders = async () => {
      driverOrders.forEach((order: any) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const todayDate = new Date().toLocaleDateString();

        if (orderDate === todayDate) {
          setTodayOrders((prevOrders: any) => [...prevOrders, order]);
        }
      });
    };

    if (driverOrders) filterTodayOrders();
  }, [driverOrders]);

  useEffect(() => {
    const fetchUser = async () => {
      const pendingOrders = todayOrders.filter(
        (order: any) =>
          order.orderStatus !== "ON_THE_WAY" &&
          order.orderStatus !== "DELIVERED"
      );
      const inProgressOrders = todayOrders.filter(
        (order: any) => order.orderStatus === "ON_THE_WAY"
      );
      const completedOrders = todayOrders.filter(
        (order: any) => order.orderStatus === "DELIVERED"
      );

      setPendingOrders(pendingOrders);
      setInProgressOrders(inProgressOrders);
      setCompletedOrders(completedOrders);
    };

    if (todayOrders) fetchUser();
  }, [todayOrders]);


  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    // Add a click listener to enable audio playback
    const enableAudio = () => {
      setAudioEnabled(true);
      window.removeEventListener('click', enableAudio);
    };

    window.addEventListener('click', enableAudio);

    return () => {
      window.removeEventListener('click', enableAudio);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4">
          {selectedOrder ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToList}
              className="mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-4 py-4">
                  <div className="px-4 py-2">
                    <h2 className="text-lg font-semibold">Menu</h2>
                  </div>
                  <div className="px-4 py-2">
                    <h3 className="mb-2 text-sm font-medium">Navigation</h3>
                    <div className="grid gap-1">
                      <Button variant="ghost" className="w-full justify-start">
                        Dashboard
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        History
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <div className="flex items-center gap-2">
            {/* <div className="rounded-full bg-primary/10 p-1">
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
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                        </div> */}
            <h1 className="text-xl font-bold text-blue-500">MealWhirl</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { }}
              className="rounded-full"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage
                      src={"/placeholder.svg?height=40&width=40"}
                      alt={""}
                    />
                    <AvatarFallback>MW</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{"Email"}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {/* <Link href="/driver/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link> */}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {selectedOrder ? (
          <OrderDetails orderId={selectedOrder} onBack={handleBackToList} />
        ) : (
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Driver Dashboard
              </h2>
              <div className="hidden md:flex gap-2">
                <Button variant="outline" onClick={() => { window.location.href = "/driver/notifications"; }}>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button variant="outline" onClick={() => { window.location.href = "/driver/profile"; }}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2 md:col-span-1 bg-primary/10 rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Orders
                  </div>
                  <div className="text-2xl font-bold">{todayOrders.length}</div>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    Pending
                  </div>
                  <div className="text-2xl font-bold ">
                    {pendingOrders.length}
                  </div>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </div>
                  <div className="text-2xl font-bold">
                    {inProgressOrders.length}
                  </div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    Completed
                  </div>
                  <div className="text-2xl font-bold">
                    {completedOrders.length}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="assigned">Assigned</TabsTrigger>
                  {/* <TabsTrigger value="pending">
                    Pending
                    {pendingOrders.length > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-yellow-500/50">
                        {pendingOrders.length}
                      </Badge>
                    )}
                  </TabsTrigger> */}
                  <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {driverOrders.map((order: any) => (
                      <OrderCard
                        key={order._id}
                        order={order}
                        onClick={() => handleOrderSelect(order._id)}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="assigned" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {driverOrders
                      .filter((order: any) => order.orderStatus === "REDY_FOR_PICKUP")
                      .map((order: any) => (
                        <OrderCard
                          key={order._id}
                          order={order}
                          onClick={() => handleOrderSelect(order._id)}
                        />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="pending" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pendingOrders.map((order: any) => (
                      <OrderCard
                        key={order._id}
                        order={order}
                        onClick={() => handleOrderSelect(order._id)}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="in_progress" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {driverOrders
                      .filter((order: any) => order.orderStatus === "PICKED_UP" || order.orderStatus === "ON_THE_WAY")
                      .map((order: any) => (
                        <OrderCard
                          key={order._id}
                          order={order}
                          onClick={() => handleOrderSelect(order._id)}
                        />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="delivered" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {driverOrders
                      .filter((order: any) => order.orderStatus === "DELIVERED")
                      .map((order: any) => (
                        <OrderCard
                          key={order._id}
                          order={order}
                          onClick={() => handleOrderSelect(order._id)}
                        />
                      ))}
                  </div>
                </TabsContent>

              </Tabs>
            </div>
          </div>
        )
        }
      </main >
    </div >
  );
}
