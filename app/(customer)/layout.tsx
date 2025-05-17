import type React from "react";
import { CartProvider } from "@/lib/cart-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import MainNav from "@/components/main-nav";
import Footer from "@/components/footer";
import "./globals.css";
import { PlacedOrderProvider } from "@/contexts/placed-order-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import { OrdersProvider } from "@/contexts/orders-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    // <body className="min-h-screen flex flex-col">
    <>
      {/* <ProtectedRoute allowedRoles={["Customer"]}> */}
      <ThemeProvider
        attribute="class"
        // defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <PlacedOrderProvider>
          <CartProvider>
            <OrdersProvider>
              <MainNav />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </OrdersProvider>
          </CartProvider>
        </PlacedOrderProvider>
      </ThemeProvider>
      {/* </ProtectedRoute> */}
    </>
    // </body>
    // </html>
  );
}

// export const metadata = {
//   title: "MealWhirl",
// };
