import type React from "react";
import ClientLayout from "./client-layout";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <ProtectedRoute allowedRoles={["Admin"]}> */}
        {/* <AuthProvider> */}
          <ClientLayout>{children}</ClientLayout>
        {/* </AuthProvider> */}
        <Toaster />
      {/* </ProtectedRoute> */}
    </>
  );
}

export const metadata = {
  title: "MealWhirl - Super",
};
