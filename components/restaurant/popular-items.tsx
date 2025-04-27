"use client"

import Image from "next/image"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const popularItems = [
  {
    id: 1,
    name: "Truffle Pasta",
    category: "Main Course",
    price: "$24.99",
    sales: 142,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Beef Wellington",
    category: "Main Course",
    price: "$38.50",
    sales: 98,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Tiramisu",
    category: "Dessert",
    price: "$12.99",
    sales: 87,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Lobster Bisque",
    category: "Appetizer",
    price: "$18.75",
    sales: 76,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Signature Cocktail",
    category: "Beverage",
    price: "$14.50",
    sales: 65,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export function PopularItems() {
  return (
    <div className="space-y-4">
      {popularItems.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-muted-foreground">{item.category}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium">{item.price}</div>
              <div className="text-xs text-muted-foreground">{item.sales} sold</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit item</DropdownMenuItem>
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Remove from menu</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
