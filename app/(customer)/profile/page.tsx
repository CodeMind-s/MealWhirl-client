"use client"

import { useEffect, useState } from "react";
import Link from "next/link"
import Image from "next/image"
import { Clock, MapPin, Phone, Settings, ShoppingBag, User, Eye, EyeOff, Delete, Trash, Trash2, CheckCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orders } from "@/lib/data"
import { useAuth } from "@/contexts/auth-context"
import { updateUserById } from "@/lib/api/userApi";
import { useToast } from "@/hooks/use-toast";
import { deleteNotification, getNotificationsByUser, markNotificationsAsRead } from "@/lib/api/notificationApi";

export default function ProfilePage() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  // console.log(`user => `, user);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    password: "",
    phone: user?.phone || "",
    refID: {
      address: {
        street: user?.refID?.address?.street || "",
        latitude: user?.refID?.address?.latitude || 0,
        longitude: user?.refID?.address?.longitude || 0,
      },
    },
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; phone?: string; street?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; phone?: string; street?: string } = {};
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    if (!formData.refID.address.street) newErrors.street = "Street address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      refID: {
        ...prev.refID,
        address: {
          ...prev.refID.address,
          [name]: value,
        },
      },
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const updatedUser = await updateUserById(user._id, formData);
      console.log("User updated successfully:", updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
      window.location.reload();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
      variant: "default",
    });
    window.location.href = "/login";
  };

  const formattedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  }) : "";

  const recentOrders = orders.slice(0, 3)

  useEffect(() => {
    if (user && notifications.length === 0) {
      getAllNotifications(user._id);
    }

    // Request notification permission on component mount
    if (Notification.permission === "default") {
      Notification.requestPermission().catch((err) => {
        console.error("Notification permission error:", err);
      });
    }
  }, [user, notifications]);

  const showBrowserNotification = (notification: { title: string; message: string }): void => {
    console.log("Attempting to show notification:", notification);

    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      console.log("Notification permission granted. Displaying notification.");
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/images/logo.png", // Replace with your app's logo if available
        });
      } catch (error) {
        console.error("Error displaying notification:", error);
      }
    } else if (Notification.permission === "denied") {
      console.warn("Notification permission was denied by the user.");
    } else {
      console.warn("Notification permission is not granted. Current state:", Notification.permission);
    }
  };

  const getAllNotifications = async (userId: string): Promise<any> => {
    try {
      const response = await getNotificationsByUser(userId);
      if (response.status === 200) {
        const sortedNotifications = (response.data as any[]).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(sortedNotifications);

        // Show browser notifications for unread notifications
        sortedNotifications.forEach((notification) => {
          if (!notification.isRead) {
            showBrowserNotification(notification);
          }
        });
      } else {
        throw new Error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // Call the API to delete the notification
      await deleteNotification(notificationId);
      // await deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
      toast({
        title: "Notification Deleted",
        description: "The notification has been deleted successfully.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete the notification.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationsAsRead(notificationId, { isRead: true });
      toast({
        title: "Notification Marked as Read",
        description: `Marked notification as read: ${notificationId}`,
        variant: "default",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark the notification as read.",
        variant: "destructive",
      });
    }
  };

  // console.log(`notifications => `, notifications);

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
                    src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {user?.name || user?.email?.split("@")[0]?.charAt(0).toUpperCase() + user?.email?.split("@")[0]?.slice(1) || "John Doe"}</CardTitle>
                <CardDescription>{user?.email || "john.doe@example.com"}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{user?.refID?.address?.street || ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Member since {formattedDate || "Jan 2023"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Phone: {user?.phone || "N/A"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
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
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div >

        <div className="md:col-span-2">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notifications?.length > 0 ? (
                    notifications.map((notification: { title: string; message: string; isRead: boolean, _id: string }, index: number) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 flex justify-between items-start ${notification.isRead ? 'bg-gray-50' : 'bg-blue-100'}`}
                      >
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-500">{notification.message}</p>
                        </div>
                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <Button
                              variant="outline"
                              className="hover:text-white"
                              onClick={() => {
                                handleMarkAsRead(notification._id);
                                setNotifications((prev) =>
                                  prev.map((n) =>
                                    n._id === notification._id ? { ...n, read: true } : n
                                  )
                                );
                              }}
                            >
                              <CheckCheck className="h-5 w-5" />
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteNotification(notification._id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No notifications available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div >

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                name="street"
                type="text"
                value={formData.refID.address.street}
                onChange={handleAddressChange}
              />
              {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  )
}
