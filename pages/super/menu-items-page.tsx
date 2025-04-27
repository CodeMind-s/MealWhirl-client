"use client"
import { useState } from "react"
import Image from "next/image"
import { ChevronDown, Edit, Filter, Plus, Search, Trash } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddMenuItemForm } from "../../components/super/add-menu-item-form"
import { toast } from "@/components/ui/use-toast"

const initialMenuItems = [
  {
    id: 1,
    name: "Truffle Pasta",
    category: "Main Course",
    price: "$24.99",
    description: "Handmade pasta with black truffle cream sauce and parmesan",
    status: "active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Beef Wellington",
    category: "Main Course",
    price: "$38.50",
    description: "Tender beef fillet wrapped in puff pastry with mushroom duxelles",
    status: "active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Tiramisu",
    category: "Dessert",
    price: "$12.99",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
    status: "active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "Lobster Bisque",
    category: "Appetizer",
    price: "$18.75",
    description: "Creamy soup made with lobster stock, aromatic vegetables and brandy",
    status: "active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Signature Cocktail",
    category: "Beverage",
    price: "$14.50",
    description: "House specialty with premium gin, elderflower liqueur and fresh citrus",
    status: "active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 6,
    name: "Seasonal Salad",
    category: "Appetizer",
    price: "$16.25",
    description: "Fresh greens with seasonal vegetables, nuts and house vinaigrette",
    status: "inactive",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 7,
    name: "Chocolate Soufflé",
    category: "Dessert",
    price: "$14.99",
    description: "Warm chocolate soufflé with vanilla ice cream",
    status: "active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 8,
    name: "Wagyu Steak",
    category: "Main Course",
    price: "$65.00",
    description: "Premium Wagyu beef steak with truffle butter and roasted vegetables",
    status: "active",
    image: "/placeholder.svg?height=50&width=50",
  },
]

export function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)

  const handleAddItem = (newItem: any) => {
    setMenuItems([newItem, ...menuItems])
  }

  const handleDeleteItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
    toast({
      title: "Menu item deleted",
      description: "The menu item has been deleted successfully.",
    })
  }

  const handleToggleStatus = (id: number) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item,
      ),
    )
    const item = menuItems.find((item) => item.id === id)
    const newStatus = item?.status === "active" ? "inactive" : "active"
    toast({
      title: "Status updated",
      description: `${item?.name} is now ${newStatus}.`,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Menu Items</h1>
        <p className="text-muted-foreground">Manage your restaurant's menu items and categories.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="main">Main Course</TabsTrigger>
              <TabsTrigger value="appetizer">Appetizers</TabsTrigger>
              <TabsTrigger value="dessert">Desserts</TabsTrigger>
              <TabsTrigger value="beverage">Beverages</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[180px] lg:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search menu items..." className="w-full pl-8 bg-background" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Main Course</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Appetizer</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Dessert</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Beverage</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default" size="sm" className="h-9" onClick={() => setIsAddItemModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4">
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>Showing {menuItems.length} items</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden lg:table-cell">Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[300px] truncate">{item.description}</TableCell>
                    <TableCell>
                      <ItemStatus status={item.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(item.id)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AddMenuItemForm open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen} onAddItem={handleAddItem} />
    </div>
  )
}

function ItemStatus({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === "active" && "border-emerald-500 text-emerald-500",
        status === "inactive" && "border-slate-500 text-slate-500",
      )}
    >
      {status}
    </Badge>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

export default MenuItemsPage
