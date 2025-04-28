import type React from "react";
import ClientLayout from "./client-layout";
import { Toaster } from "@/components/ui/toaster";

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

import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata = {
  title: "MealWhirl - Restaurant",
};
