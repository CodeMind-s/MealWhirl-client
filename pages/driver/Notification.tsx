"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Check, CheckCheck, Clock, Info, Package, Settings, Trash2, Truck, Star, ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/super/page-header";
import { getNotificationsByUser, markNotificationsAsRead } from "@/lib/api/notificationApi"
import { useAuth } from "@/contexts/auth-context"

interface NotificationsProps {
    onBack: () => void
}

type NotificationType = "order" | "payment" | "system" | "review"

interface Notification {
    _id: string
    title: string
    message: string
    isRead: boolean
    type: NotificationType
}

export default function Notifications() {
    const { user } = useAuth();
    const { toast } = useToast()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [activeTab, setActiveTab] = useState<string>("all")

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const filteredNotifications =
        activeTab === "all"
            ? notifications
            : activeTab === "unread"
                ? notifications.filter((n) => !n.isRead)
                : notifications.filter((n) => n.type === activeTab)

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationsAsRead(id, { isRead: true });
            setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
            toast({
                title: "Notification marked as read",
                description: "The notification has been marked as read.",
            });
            setNotifications((prevNotifications) =>
                prevNotifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            // console.error("Error marking notification as read:", error);
            toast({
                title: "Error",
                description: "Failed to mark the notification as read.",
                variant: "destructive",
            });
        }
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
        toast({
            title: "All notifications marked as read",
            description: "All notifications have been marked as read.",
        })
    }

    const handleClearAll = () => {
        setNotifications([])
        toast({
            title: "Notifications cleared",
            description: "All notifications have been cleared.",
        })
    }

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case "order":
                return <Package className="h-5 w-5 text-primary" />
            case "payment":
                return <Truck className="h-5 w-5 text-green-500" />
            case "system":
                return <Info className="h-5 w-5 text-blue-500" />
            case "review":
                return <Star className="h-5 w-5 text-yellow-500" />
            default:
                return <Bell className="h-5 w-5" />
        }
    }

    useEffect(() => {
        if (user && notifications.length === 0) {
            getAllNotifications(user._id);
        }
    }, [user, notifications]);

    const getAllNotifications = async (userId: string): Promise<any> => {
        try {
            const response = await getNotificationsByUser(userId);
            if (response.status === 200) {
                const sortedNotifications = (response.data as any[]).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setNotifications(sortedNotifications);
            } else {
                throw new Error("Failed to fetch notifications");
            }
        } catch (error) {
            // console.error("Error fetching notifications:", error);
            toast({
                title: "Error",
                description: "Failed to fetch notifications.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        if (notifications.length > 0) {
            const unreadNotifications = notifications.filter((n) => !n.isRead);
            unreadNotifications.forEach((notification) => {
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification(notification.title, {
                        body: notification.message,
                        icon: "/images/logo.png", // Replace with your app's icon if available
                    });
                }
            });
        }
    }, [notifications]);

    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission().then((permission) => {
                if (permission !== "granted") {
                    console.warn("Push notifications permission denied");
                }
            });
        }
    }, []);

    return (
        <div className="container mx-auto py-24">
            <Button
                variant="outline"
                className="mb-4 flex items-center gap-2"
                onClick={() => window.location.href = "/driver"}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Driver Page
            </Button>
            <PageHeader title="Notifications" description="Stay updated with your delivery activities" />
            <br />
            <div className="grid gap-6 md:grid-cols-12">
                {/* Main notifications panel */}
                <div className="md:col-span-8 space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>Your Notifications</CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                                        <CheckCheck className="h-4 w-4 mr-2" />
                                        Mark all read
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleClearAll} disabled={notifications.length === 0}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear all
                                    </Button>
                                </div>
                            </div>
                            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid grid-cols-2">
                                    <TabsTrigger value="all">
                                        All
                                        {notifications.length > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {notifications.length}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="unread">
                                        Unread
                                        {unreadCount > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {unreadCount}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    {/* <TabsTrigger value="order">Orders</TabsTrigger>
                                    <TabsTrigger value="payment">Payments</TabsTrigger>
                                    <TabsTrigger value="system">System</TabsTrigger> */}
                                </TabsList>
                            </Tabs>
                        </CardHeader>
                        <CardContent>
                            {filteredNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">No notifications</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {activeTab === "all"
                                            ? "You don't have any notifications yet."
                                            : activeTab === "unread"
                                                ? "You don't have any unread notifications."
                                                : `You don't have any ${activeTab} notifications.`}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredNotifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`p-4 rounded-lg border ${!notification.isRead ? "bg-primary/5 border-primary/20" : ""}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <h4 className="font-medium">{notification.title}</h4>
                                                        <div className="flex items-center gap-2">
                                                            {/* <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                {notification.time}
                                                            </span> */}
                                                            {!notification.isRead && (
                                                                <Badge variant="default" className="bg-primary text-white">
                                                                    New
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                                    {!notification.isRead && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="mt-2 h-8 text-primary"
                                                            onClick={() => handleMarkAsRead(notification._id)}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" /> Mark as read
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Settings panel */}
                <div className="md:col-span-4 space-y-6">
                    {/* <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Settings className="h-5 w-5 mr-2" />
                                Notification Settings
                            </CardTitle>
                            <CardDescription>Manage your notification preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="order-notifications">Order Updates</Label>
                                    <p className="text-sm text-muted-foreground">New orders and status changes</p>
                                </div>
                                <Switch id="order-notifications" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="payment-notifications">Payment Updates</Label>
                                    <p className="text-sm text-muted-foreground">Earnings and bonuses</p>
                                </div>
                                <Switch id="payment-notifications" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="system-notifications">System Updates</Label>
                                    <p className="text-sm text-muted-foreground">App updates and maintenance</p>
                                </div>
                                <Switch id="system-notifications" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="review-notifications">Customer Reviews</Label>
                                    <p className="text-sm text-muted-foreground">Ratings and feedback</p>
                                </div>
                                <Switch id="review-notifications" defaultChecked />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                    toast({
                                        title: "Settings saved",
                                        description: "Your notification preferences have been updated.",
                                    })
                                }
                            >
                                Save Preferences
                            </Button>
                        </CardFooter>
                    </Card> */}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Clock className="h-5 w-5 mr-2" />
                                Notification History
                            </CardTitle>
                            <CardDescription>Your notification activity</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Notifications</span>
                                <span className="font-medium">{notifications.length}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Unread</span>
                                <span className="font-medium">{unreadCount}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Order Notifications</span>
                                <span className="font-medium">{notifications.filter((n) => n.type === "order").length}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Last Updated</span>
                                <span className="font-medium">{new Date().toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
