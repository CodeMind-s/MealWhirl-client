"use client"

import React from "react"

import { useState, Suspense } from "react"
import { Inter } from "next/font/google"
import { Bell, ChevronDown, Menu, Search } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SuperAdminSidebar } from "@/components/super/super-admin-sidebar"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Default to closed on mobile, open on desktop
    return typeof window !== "undefined" ? window.innerWidth >= 768 : false
  })

  // Update sidebar state on window resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <html lang="en">
      <body className={cn("bg-background h-screen overflow-hidden", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="flex h-screen max-h-screen overflow-hidden">
            <SuperAdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="border-b bg-background z-10">
                <div className="flex h-16 items-center px-4 gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                  <div className="flex-1 flex items-center gap-4 md:gap-8">
                    <div className="relative w-full max-w-md">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Search..." className="w-full pl-8 bg-background" />
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
                        <span className="sr-only">Notifications</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">SA</span>
                            </div>
                            <div className="hidden md:block text-sm font-medium">Admin User</div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Profile</DropdownMenuItem>
                          <DropdownMenuItem>Settings</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-auto p-4 md:p-6" style={{ height: "calc(100vh - 64px)" }}>
                <Suspense>{children}</Suspense>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
