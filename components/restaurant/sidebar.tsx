"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Bell, ChevronLeft, Coffee, LayoutDashboard, Package, Receipt, Settings, ShoppingBag } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300 md:relative",
        open ? "w-72" : "-translate-x-full md:translate-x-0 md:w-20",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn("flex items-center gap-2", !open && "md:justify-center")}>
          {/* <Coffee className="h-6 w-6 text-primary" /> */}
          <span className={cn("font-semibold", !open && "hidden")}>MealWhirl</span>
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
            <NavItem icon={LayoutDashboard} label="Dashboard" href="/restaurant/" open={open} />
            <NavItem icon={ShoppingBag} label="Orders" href="/restaurant/orders" open={open} />
            <NavItem icon={Receipt} label="Transactions" href="/restaurant/transactions" open={open} />
            <NavItem icon={Package} label="Menu Items" href="/restaurant/menu-items" open={open} />
            <NavItem icon={Bell} label="Notifications" href="/restaurant/notifications" open={open} />
            <NavItem icon={Settings} label="Settings" href="/restaurant/settings" open={open} />
          </div>
        </div>
      </nav>
      <div className="border-t p-4">
        <div className={cn("flex items-center gap-3", !open && "md:justify-center")}>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
          <div className={cn(!open && "hidden")}>
            <div className="text-sm font-medium">John Doe</div>
            <div className="text-xs text-muted-foreground">Admin</div>
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
  const pathname = usePathname()
  const isActive = pathname?.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive || active || href === "/restaurant"
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
