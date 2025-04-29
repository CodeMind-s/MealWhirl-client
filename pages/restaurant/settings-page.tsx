"use client";

import { useEffect, useState } from "react";
import { Save, User } from "lucide-react";

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
import {
  addPayamentMethod,
  createUpdateResaurant,
} from "@/lib/api/restaurantApi";
import { useRouter } from "next/navigation";
import {
  USER_ACCOUNT_STATUS,
  USER_CATEGORIES,
} from "@/constants/userConstants";
import { getUserByCategoryAndId } from "@/lib/api/userApi";

export const validatePaymentMethods = (paymentMethods: any[]) => {
  const errors: string[] = [];

  paymentMethods.forEach((method, index) => {
    if (!method.cardNumber || !/^\d{16}$/.test(method.cardNumber)) {
      errors.push(
        `Payment Method ${
          index + 1
        }: Card number is required and must be 16 digits.`
      );
    }
    if (!method.cardHolderName || typeof method.cardHolderName !== "string") {
      errors.push(
        `Payment Method ${
          index + 1
        }: Card holder name is required and must be a string.`
      );
    }
    if (
      !method.expiryDate ||
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(method.expiryDate)
    ) {
      errors.push(
        `Payment Method ${
          index + 1
        }: Expiry date is required and must be in MM/YY format.`
      );
    }
    if (!method.cvv || !/^\d{3,4}$/.test(method.cvv)) {
      errors.push(
        `Payment Method ${
          index + 1
        }: CVV is required and must be 3 or 4 digits.`
      );
    }
    if (
      method.isDefault !== undefined &&
      typeof method.isDefault !== "boolean"
    ) {
      errors.push(`Payment Method ${index + 1}: isDefault must be a boolean.`);
    }
  });

  return errors;
};

const DEFAULT_PAYMENT_METHOD = {
  cardNumber: "",
  cardHolderName: "",
  expiryDate: "",
  cvv: "",
  isDefault: false,
};

export function SettingsPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    profilePicture: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    location: {
      latitude: "",
      longitude: "",
    },
    registrationNumber: "",
    owner: {
      name: "",
      email: "",
      phone: "",
      nationalId: "",
    },
    paymentMethods: [DEFAULT_PAYMENT_METHOD],
  });
  const [isValidPayment, setIsValidPayment] = useState(true);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserByCategoryAndId(
          USER_CATEGORIES.RESTAURANT,
          user?.identifier,
          null
        );
        if (userData) {
          setRestaurantData({
            name: userData.name || "",
            profilePicture: userData.profilePicture || "",
            address: {
              street: userData.address?.street || "",
              city: userData.address?.city || "",
              state: userData.address?.state || "",
              zipCode: userData.address?.zipCode || "",
              country: userData.address?.country || "",
            },
            location: {
              latitude: userData.location?.latitude || "",
              longitude: userData.location?.longitude || "",
            },
            registrationNumber: userData.registrationNumber || "",
            owner: {
              name: userData.owner?.name || "",
              email: userData.owner?.email || "",
              phone: userData.owner?.phone || "",
              nationalId: userData.owner?.nationalId || "",
            },
            paymentMethods: [DEFAULT_PAYMENT_METHOD],
          });
          setSavedPaymentMethods(userData.paymentMethods?.map((method) => method.id) || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (
      user?.accountStatus !== USER_ACCOUNT_STATUS.CREATING &&
      user?.identifier
    ) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const errors = validatePaymentMethods(restaurantData.paymentMethods);
    setIsValidPayment(errors.length === 0);
  }, [restaurantData.paymentMethods]);

  const savePaymentData = async () => {
    try {
      const { data } = await addPayamentMethod({
        ...restaurantData.paymentMethods[0],
        identifier: user?.identifier,
      });
      setSavedPaymentMethods((prev) => [...prev, data._id]);
    } catch (error) {
      console.error("Error saving payment data:", error);
    }
  };

  const saveResaurantData = async () => {
    try {
      await createUpdateResaurant(
        {
          ...restaurantData,
          paymentMethods: savedPaymentMethods.filter(
            (method) => typeof method === "string"
          ),
          identifier: user?.identifier,
        },
        user?.accountStatus
      );
      setUser((prev: User) => ({
        ...prev,
        accountStatus: USER_ACCOUNT_STATUS.ACTIVE,
      }));
      router.push("/restaurant/profile");
    } catch (error) {
      console.error("Error saving restaurant data:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setRestaurantData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    field: string,
    subField: string,
    value: any
  ) => {
    setRestaurantData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value,
      },
    }));
  };

  const handlePaymentMethodChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedPaymentMethods = [...restaurantData.paymentMethods];
    updatedPaymentMethods[index][field] = value;
    setRestaurantData((prev) => ({
      ...prev,
      paymentMethods: updatedPaymentMethods,
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
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-fit">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
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
                <Label htmlFor="restaurant-name">Registration No</Label>
                <Input
                  id="restaurant-number"
                  value={restaurantData.registrationNumber}
                  onChange={(e) =>
                    handleInputChange("registrationNumber", e.target.value)
                  }
                  placeholder="Enter registration number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-pic">Profile Picture</Label>
                <Input
                  id="restaurant-pic"
                  value={restaurantData.profilePicture}
                  onChange={(e) =>
                    handleInputChange("profilePicture", e.target.value)
                  }
                placeholder="https://example.com/image.jpg" 
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label>Address</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Street"
                    value={restaurantData.address.street}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "street",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    placeholder="City"
                    value={restaurantData.address.city}
                    onChange={(e) =>
                      handleNestedInputChange("address", "city", e.target.value)
                    }
                  />
                  <Input
                    placeholder="State"
                    value={restaurantData.address.state}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "state",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    placeholder="Zip Code"
                    value={restaurantData.address.zipCode}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "zipCode",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    placeholder="Country"
                    value={restaurantData.address.country}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "country",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Latitude"
                    value={restaurantData.location.latitude}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "location",
                        "latitude",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Longitude"
                    value={restaurantData.location.longitude}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "location",
                        "longitude",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              {/* Owner */}
              <div className="space-y-2">
                <Label>Owner</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Name"
                    value={restaurantData.owner.name}
                    onChange={(e) =>
                      handleNestedInputChange("owner", "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Email"
                    value={restaurantData.owner.email}
                    onChange={(e) =>
                      handleNestedInputChange("owner", "email", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Phone"
                    value={restaurantData.owner.phone}
                    onChange={(e) =>
                      handleNestedInputChange("owner", "phone", e.target.value)
                    }
                  />
                  <Input
                    placeholder="National ID"
                    value={restaurantData.owner.nationalId}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "owner",
                        "nationalId",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={() => saveResaurantData()}
                disabled={savedPaymentMethods.length === 0}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {restaurantData.paymentMethods.map((method, index) => (
                <div key={index} className="space-y-4 border-b pb-4">
                  <div className="space-y-2">
                    <Label htmlFor={`card-number-${index}`}>Card Number</Label>
                    <Input
                      id={`card-number-${index}`}
                      value={method.cardNumber}
                      onChange={(e) =>
                        handlePaymentMethodChange(
                          index,
                          "cardNumber",
                          e.target.value
                        )
                      }
                      placeholder="Enter card number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`card-holder-name-${index}`}>
                      Card Holder Name
                    </Label>
                    <Input
                      id={`card-holder-name-${index}`}
                      value={method.cardHolderName}
                      onChange={(e) =>
                        handlePaymentMethodChange(
                          index,
                          "cardHolderName",
                          e.target.value
                        )
                      }
                      placeholder="Enter card holder name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`expiry-date-${index}`}>Expiry Date</Label>
                    <Input
                      id={`expiry-date-${index}`}
                      value={method.expiryDate}
                      onChange={(e) =>
                        handlePaymentMethodChange(
                          index,
                          "expiryDate",
                          e.target.value
                        )
                      }
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`cvv-${index}`}>CVV</Label>
                    <Input
                      id={`cvv-${index}`}
                      value={method.cvv}
                      onChange={(e) =>
                        handlePaymentMethodChange(index, "cvv", e.target.value)
                      }
                      placeholder="Enter CVV"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`is-default-${index}`}
                      checked={method.isDefault}
                      onChange={(e) =>
                        handlePaymentMethodChange(
                          index,
                          "isDefault",
                          e.target.checked
                        )
                      }
                    />
                    <Label htmlFor={`is-default-${index}`}>
                      Set as Default
                    </Label>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={() => savePaymentData()}
                disabled={!isValidPayment}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Payment Methods
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SettingsPage;
