import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { ClientOnly } from "@/components/ClientOnly";
import { ReactNode } from "react";
import '../styles/globals.css';

export const metadata = {
  title: "MealWhirl",
  description: "MealWhirl",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body lang="en" suppressHydrationWarning>
        <ClientOnly>
          <ThemeProvider
            attribute="class"
            // defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
