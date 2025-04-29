"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customers" | "restaurants" | "drivers">("customers");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await register(email, password, role, "email");

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Registration failed",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Your account has been created successfully.",
      });

      // Router will redirect based on the useEffect above
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen pattern-bg flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold primary-text mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Sign up to get started</p>
        </div>
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="h-2 primary-bg"></div>
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="shadow-sm focus:ring-brand-blue focus:border-brand-blue block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="mt-1">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="shadow-sm focus:ring-brand-blue focus:border-brand-blue block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) =>
                    setRole(value)
                  }
                >
                  <div className="flex items-center space-x-2">
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
                <Button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-brand-blue hover:text-brand-blue-dark"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
