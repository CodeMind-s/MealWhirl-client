"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Loader,
  MapPin,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { orders } from "@/lib/data";
import { useEffect, useState } from "react";
// import { getUserByCategoryAndId } from "@/lib/api/userApi";
import {
  USER_ACCOUNT_STATUS,
  USER_CATEGORIES,
} from "@/constants/userConstants";
import { useAuth } from "@/contexts/auth-context";

const defaultProfilePicture =
  "https://i.pinimg.com/736x/68/99/ca/6899ca7b98e648292a35f8be1c7e563c.jpg";

export default function ProfilePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const { identifier = null } = user || {};
  //       const data = await getUserByCategoryAndId(
  //         USER_CATEGORIES.RESTAURANT,
  //         identifier,
  //         null
  //       );
  //       setUserData(data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (user && user.accountStatus !== USER_ACCOUNT_STATUS.CREATING) {
  //     fetchUserData();
  //   }
  // }, [user]);

  if (isLoading) {
    return (
      <div>
        <Loader>Loading. Be patient...</Loader>
      </div>
    );
  }

  // edit profile page
  if (!isLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <Link href="/login" className="text-blue-500 underline">
          Go to Login
        </Link>
      </div>
    );
  }

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
                    src={userData?.profilePicture || defaultProfilePicture}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <CardTitle className="text-center">
                  {user?.refID?.name || 'N/A'}
                </CardTitle>
                <CardDescription>{userData?.email?.value}</CardDescription>
                <span className=" text-sm">{user?.email || "N/A"}</span>
                <Badge className="text-xs mt-2">Verified</Badge>
          
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {user?.refID?.address
                      ? `${user?.refID?.address?.street}`
                      : "Address not available"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Member since{" "}
                    {new Date(user?.createdAt ?? "").toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
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
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Business Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p>{user?.refID?.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Registration No</p>
                        <p>{user?._id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p>{user?.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p>{user?.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p>{user?.refID?.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">National ID</p>
                        <p>{user?.refID?._id?.toString().slice(0, 12) || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p>{user?.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p>{user?.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Business</p>
                            <p className="text-sm text-gray-500">
                              <span className="text-sm">
                                {user?.refID?.address
                                  ? `${user?.refID?.address?.street}`
                                  : "Address not available"}
                              </span>
                            </p>
                          </div>
                          <Badge>Main Branch</Badge>
                        </div>
                      </div>
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
                            <p className="font-medium">Visa and Master cards</p>
                            <p className="text-sm text-gray-500">
                              no extra charge for this payment method.
                            </p>
                          </div>
                          <Badge>Default</Badge>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Cash on Delivary</p>
                            <p className="text-sm text-gray-500">
                              Around 5% of the total amount will be charged as a
                              service fee.
                            </p>
                          </div>
          
                        </div>
                      </div>
                      {/* <Button variant="outline" className="w-full">
                        Add Payment Method
                      </Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
