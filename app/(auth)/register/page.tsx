"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { createUser } from "@/lib/api/userApi";
import router from "next/router";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customers" | "restaurants" | "drivers">("customers");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  // const { register } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if ((role === "customers" || role === "restaurants") && !latitude && !longitude) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude.toString());
            setLongitude(position.coords.longitude.toString());
          },
          () => {
            toast({
              title: "Location Required",
              description: "Please enable location services in your browser to autofill your address coordinates.",
              variant: "destructive",
            });
          }
        );
      } else {
        toast({
          title: "Geolocation not supported",
          description: "Your browser does not support geolocation.",
          variant: "destructive",
        });
      }
    }
  }, [role, latitude, longitude, toast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const typeMap: Record<string, string> = {
      customers: "Customer",
      restaurants: "Restaurant",
      drivers: "Driver",
    };

    let userData: any = {
      name,
      email,
      password,
      phone,
      type: typeMap[role],
      isAdmin: false,
      additionalData: {},
    };

    if (role === "customers") {
      userData.additionalData = {
        address: {
          street,
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
        },
      };
    } else if (role === "restaurants") {
      userData.additionalData = {
        name: restaurantName,
        address: {
          street,
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
        },
      };
    } else if (role === "drivers") {
      userData.additionalData = {
        vehicleType,
        licenseNumber,
      };
    }

    try {
      console.log(`Registering user: `, userData);
      await createUser(userData);
      // Assert response type if you expect a Response object
      // const res = response as { status: number };
      toast({
        title: "Success",
        description: "Account created successfully. Please log in.",
        variant: "default",
      });
      setIsLoading(false);

      setTimeout(() => {
        // Redirect to login page after 2 seconds
        window.location.href = "/login";
      }, 1500);
      // Redirect to login page
      // router.push("/login");
    } catch (error) {
      console.error("Error creating user: ", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">Create Account</h1>
          <p className="text-sm text-gray-500">Sign up to get started</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <Label className="mb-2">Account Type</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as typeof role)}
                className="grid grid-cols-3 gap-4 bg-slate-100 p-4 rounded-md "
              >
                <div className="flex items-center space-x-2 ">
                  <RadioGroupItem value="customers" id="customer" />
                  <Label htmlFor="customer">Customer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="restaurants" id="restaurant" />
                  <Label htmlFor="restaurant">Restaurant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="drivers" id="driver" />
                  <Label htmlFor="driver">Driver</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>



            {role === "restaurants" && (
              <div>
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            {(role === "restaurants" || role === "customers") && (
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            {role === "drivers" && (
              <>
                <div>
                  <Label htmlFor="vehicleType" className="">Vehicle Type</Label>
                  <br />
                  <select
                    id="vehicleType"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-slate-100 border-slate-300 rounded-md text-sm p-4"
                    required
                  >
                    <option value="">Select vehicle type</option>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Van">Van</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
