"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, Car, Edit, Save, Star, TrendingUp, Trophy, Truck } from 'lucide-react'
import { PageHeader } from "@/components/super/page-header";

interface ProfileProps {
    onBack: () => void
}

export default function Profile() {
    const { user } = useAuth();
    const { toast } = useToast()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        email: user?.email || "driver@example.com",
        phone: user?.phone || "(555) 123-4567",
        address: "123 Main St, New York, NY 10001",
        vehicleModel: "Toyota Prius",
        vehicleColor: "Silver",
        vehiclePlate: "ABC-1234",
    })

    // Mock driver statistics
    const driverStats = {
        deliveries: 248,
        rating: 4.8,
        onTimeRate: 97,
        cancelRate: 1.2,
        earnings: 3245.75,
        topBadges: ["Speedy", "Reliable", "Friendly"],
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        setIsEditing(false)
        toast({
            title: "Profile updated",
            description: "Your profile information has been updated successfully.",
        })
    }

    return (
        <div className="container mx-auto p-4">
            <Button
                variant="outline"
                className="mb-4 flex items-center gap-2"
                onClick={() => window.location.href = "/driver"}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Driver Page
            </Button>
            <PageHeader
                title="Driver Profile"
                description="View and manage your profile information"
            // onClick={onBack}
            />

            <div className="grid gap-6 md:grid-cols-12">
                {/* Left column - Profile info */}
                <div className="md:col-span-8 space-y-6">
                    <Card>
                        <CardHeader className="relative pb-0">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={"https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?semt=ais_hybrid&w=740"} alt={"John Driver"} />
                                        <AvatarFallback className="text-2xl">
                                            JD
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                                        onClick={() => toast({
                                            title: "Feature coming soon",
                                            description: "Profile picture upload will be available soon.",
                                        })}
                                    >
                                        <Camera className="h-4 w-4" />
                                        <span className="sr-only">Upload picture</span>
                                    </Button>
                                </div>
                                <div>
                                    {/* <CardTitle className="text-2xl">{formData.name}</CardTitle> */}
                                    <CardDescription>{formData.email}</CardDescription>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="text-xs">Driver</Badge>
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="fill-yellow-500 h-4 w-4 mr-1" />
                                            <span className="text-sm font-medium">{driverStats.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="absolute top-4 right-4"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                                    {isEditing ? "Save" : "Edit"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        {isEditing && (
                            <CardFooter>
                                <Button onClick={handleSave} className="ml-auto">Save Changes</Button>
                            </CardFooter>
                        )}
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Car className="h-5 w-5 mr-2" />
                                Vehicle Information
                            </CardTitle>
                            <CardDescription>Details about your delivery vehicle</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="vehicleModel">Vehicle Model</Label>
                                    <Input
                                        id="vehicleModel"
                                        name="vehicleModel"
                                        value={formData.vehicleModel}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vehicleColor">Vehicle Color</Label>
                                    <Input
                                        id="vehicleColor"
                                        name="vehicleColor"
                                        value={formData.vehicleColor}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vehiclePlate">License Plate</Label>
                                    <Input
                                        id="vehiclePlate"
                                        name="vehiclePlate"
                                        value={formData.vehiclePlate}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right column - Stats and settings */}
                <div className="md:col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2" />
                                Driver Statistics
                            </CardTitle>
                            <CardDescription>Your performance metrics</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Deliveries</span>
                                <span className="font-medium">{driverStats.deliveries}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Rating</span>
                                <div className="flex items-center">
                                    <Star className="fill-yellow-500 h-4 w-4 mr-1" />
                                    <span className="font-medium">{driverStats.rating}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">On-time Rate</span>
                                <span className="font-medium">{driverStats.onTimeRate}%</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Cancellation Rate</span>
                                <span className="font-medium">{driverStats.cancelRate}%</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Earnings</span>
                                <span className="font-medium">${driverStats.earnings.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Trophy className="h-5 w-5 mr-2" />
                                Achievements
                            </CardTitle>
                            <CardDescription>Badges you've earned</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {driverStats.topBadges.map((badge) => (
                                    <Badge key={badge} variant="outline" className="bg-primary/5 text-primary">
                                        {badge}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>Manage your account preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="push-notifications">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive order alerts</p>
                                </div>
                                <Switch id="push-notifications" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notifications">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                                </div>
                                <Switch id="email-notifications" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="dark-mode">Dark Mode</Label>
                                    <p className="text-sm text-muted-foreground">Use dark theme</p>
                                </div>
                                <Switch id="dark-mode" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
