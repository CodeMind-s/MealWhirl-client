"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronLeft,
  Coffee,
  LayoutDashboard,
  Receipt,
  Settings,
  Store,
  Truck,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function SuperAdminSidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300 md:relative",
        open ? "w-72" : "-translate-x-full md:translate-x-0 md:w-20",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn("flex items-center gap-2", !open && "md:justify-center")}>
          <Coffee className="h-6 w-6 text-primary" />
          <span className={cn("font-semibold", !open && "hidden")}>Super Admin</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="hidden md:flex">
          <ChevronLeft className={cn("h-5 w-5 transition-transform", !open && "rotate-180")} />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-3 py-2">
          <h2
            className={cn(
              "mb-2 text-xs font-semibold text-muted-foreground",
              !open && "hidden md:block md:text-center",
            )}
          >
            {open ? "DASHBOARD" : "MENU"}
          </h2>
          <div className="space-y-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" href="/super" open={open} active={pathname === "/super"} />
            <NavItem icon={Users} label="Customers" href="/super/customers" open={open} active={pathname === "/super/customers"} />
            <NavItem
              icon={Store}
              label="Restaurants"
              href="/super/restaurants"
              open={open}
              active={pathname === "/super/restaurants"}
            />
            <NavItem icon={Truck} label="Drivers" href="/super/drivers" open={open} active={pathname === "/super/drivers"} />
            <NavItem
              icon={Receipt}
              label="Transactions"
              href="/super/transactions"
              open={open}
              active={pathname === "/super/transactions"}
            />
            <NavItem
              icon={Bell}
              label="Notifications"
              href="/super/notifications"
              open={open}
              active={pathname === "/super/notifications"}
            />
            <NavItem
              icon={BarChart3}
              label="Analytics"
              href="/super/analytics"
              open={open}
              active={pathname === "/super/analytics"}
            />
            <NavItem icon={Settings} label="Settings" href="/super/settings" open={open} active={pathname === "/super/settings"} />

          </div>
        </div>
      </nav>
      <div className="border-t p-4">
        <div className={cn("flex items-center gap-3", !open && "md:justify-center")}>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">SA</span>
          </div>
          <div className={cn(!open && "hidden")}>
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-muted-foreground">Super Admin</div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ElementType
  label: string
  href: string
  open: boolean
  active?: boolean
}

function NavItem({ icon: Icon, label, href, open, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        !open && "md:justify-center md:px-2",
      )}
    >
      <Icon className="h-5 w-5" />
      <span className={cn(!open && "hidden")}>{label}</span>
    </Link>
  )
}
