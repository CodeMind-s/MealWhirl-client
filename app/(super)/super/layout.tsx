import type React from "react";
import ClientLayout from "./client-layout";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>
        <ClientLayout>{children}</ClientLayout>
      </AuthProvider>
      <Toaster />
    </>
  );
}

export const metadata = {
  title: "MealWhirl - Super",
};
