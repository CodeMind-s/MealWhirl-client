"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        email: email,
        password: password,
      };
      await login(data);
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // async function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   try {
  //     const result = await login(email, password)

  //     if (!result.success) {
  //       toast({
  //         title: "Error",
  //         description: result.error || "Invalid credentials",
  //         variant: "destructive",
  //       })
  //       setIsLoading(false)
  //       return
  //     }

  //     toast({
  //       title: "Success",
  //       description: "You have been logged in successfully.",
  //     })

  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Something went wrong. Please try again.",
  //       variant: "destructive",
  //     })
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div className="min-h-screen pattern-bg flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-8 py-6">
            <div className="text- mb-8">
              <h1 className="text-3xl font-bold primary-text mb-2">
                Welcome To MealWhirl
              </h1>
              <p className="text-gray-600">Sign in to access your account</p>
            </div>
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="shadow-sm focus:ring-brand-blue focus:border-brand-blue block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-brand-blue hover:text-brand-blue-dark"
                >
                  Sign up
                </Link>
              </div>

              <div className="space-y-2">
                <details className="text-sm text-muted-foreground">
                  <summary className="cursor-pointer">
                    Available test accounts
                  </summary>
                  <div className="mt-2 space-y-2 rounded-md bg-muted p-3">
                    <p>
                      <strong>Customer:</strong> cust.test@mail.com / cust123
                    </p>
                    <p>
                      <strong>Driver:</strong> driver.test@mail.com / driver123
                    </p>
                    <p>
                      <strong>Restaurant:</strong> rest.test@mail.com / rest123
                    </p>
                    <p>
                      <strong>Admin:</strong> admin.test@mail.com / admin123
                    </p>
                  </div>
                </details>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
