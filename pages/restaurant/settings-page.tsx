"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { createUpdateResaurant } from "@/lib/api/restaurantApi";
import { useRouter } from "next/navigation";
import { USER_ACCOUNT_STATUS, USER_CATEGORIES } from "@/constants/userConstants";
import { updateUserById } from "@/lib/api/userApi";
import { toast, useToast } from "@/hooks/use-toast";
import { set } from "date-fns";

const DEFAULT_RESTAURANT_DATA = {
  name: "",
  email: "",
  password: "",
  phone: "",
  address: {
    street: "",
    latitude: "",
    longitude: "",
  },
};

export function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [restaurantData, setRestaurantData] = useState(DEFAULT_RESTAURANT_DATA);

  useEffect(() => {
    // Load user data from localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setRestaurantData({
          name: userData.refID.name || "",
          email: userData.email || "",
          password: "",
          phone: userData.phone || "",
          address: {
            street: userData?.refID?.address?.street || "",
            latitude: userData?.refID?.address?.latitude || "",
            longitude: userData?.refID?.address?.longitude || "",
          },
        });
      } catch (e) {
        // If parsing fails, keep defaults
      }
    }
  }, []);

  const saveResaurantData = async () => {
    if (!user?._id) {
      // console.error("User ID is undefined.");
      return;
    }

    // Construct payload in required format
    const payload = {
      email: restaurantData.email,
      password: restaurantData.password,
      phone: restaurantData.phone,
      refID: {
        name: restaurantData.name,
        address: {
          street: restaurantData.address.street,
          latitude: parseFloat(restaurantData.address.latitude),
          longitude: parseFloat(restaurantData.address.longitude),
        },
      },
    };

    try {
      // console.log("Payload to backend =>", payload);
      await updateUserById(user._id, payload); // Uncomment to send to backend
      localStorage.setItem("user", JSON.stringify({ ...user, ...payload })); // Optionally update localStorage
      toast({
        title: "Success",
        description: "Restaurant settings updated successfully.",
        variant: "default",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      // console.error("Error saving restaurant data:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setRestaurantData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (subField: string, value: any) => {
    setRestaurantData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [subField]: value,
      },
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your restaurant settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-1 w-fit">
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>
                Update your restaurant's basic information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="grid grid-cols-3 gap-4">
                {/* Restaurant Name */}
                <div className="space-y-2">
                  <Label htmlFor="restaurant-name">Restaurant Name</Label>
                  <Input
                    id="restaurant-name"
                    value={restaurantData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter restaurant name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={restaurantData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={restaurantData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={restaurantData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                {/* Address Street */}
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    value={restaurantData.address.street}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                    placeholder="Enter street address"
                  />
                </div>
                {/* Latitude */}
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    value={restaurantData.address.latitude}
                    onChange={(e) => handleAddressChange("latitude", e.target.value)}
                    placeholder="Enter latitude"
                  />
                </div>
                {/* Longitude */}
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    value={restaurantData.address.longitude}
                    onChange={(e) => handleAddressChange("longitude", e.target.value)}
                    placeholder="Enter longitude"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={() => saveResaurantData()}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SettingsPage;
