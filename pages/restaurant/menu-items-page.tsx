"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, Edit, Filter, Plus, Search, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddMenuItemForm } from "../../components/restaurant/add-menu-item-form";
import { toast } from "@/components/ui/use-toast";
import { deleteMenuItem, updateMenuItem } from "@/lib/api/restaurantApi";
import { useAuth } from "@/contexts/auth-context";
import { getUserByCategoryAndId } from "@/lib/api/userApi";
import { USER_CATEGORIES } from "@/constants/userConstants";
import {
  mapToMenuCategories,
  mapToMenuItems,
} from "@/app/(customer)/restaurants/[id]/page";

export function MenuItemsPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuRawData, setMenuRawData] = useState([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const data = await getUserByCategoryAndId(
          USER_CATEGORIES.RESTAURANT,
          user.identifier,
          null
        );
        setMenuRawData(data.menu);
        const menuCategories = mapToMenuCategories(data.menu, data.identifier);
        const categoryIdMap = Object.fromEntries(
          menuCategories.map((category) => [category.name, category.id])
        );
        setMenuItems(mapToMenuItems(data.menu, data.identifier, categoryIdMap));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user && `${user.role}s` === USER_CATEGORIES.RESTAURANT) {
      fetchRestaurantData();
    }
  }, [user]);

  const handleAddItem = (newItem: any) => {
    setMenuItems([newItem, ...menuItems]);
  };

  const handleDeleteItem = async (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    const itemToDelete = menuItems.find((item) => item.id === id);
    const itemToDeleteRaw = menuRawData.find(
      (rawItem) => rawItem.name === itemToDelete.name
    );
    await deleteMenuItem({ menuId: itemToDeleteRaw.name, id: user.identifier });
    toast({
      title: "Menu item deleted",
      description: "The menu item has been deleted successfully.",
    });
  };

  const handleToggleStatus = async (id: number) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item
      )
    );

    const item = menuItems.find((item) => item.id === id);
    const itemToUpdate = menuRawData.find(
      (rawItem) => rawItem.name === item.name
    );
    await updateMenuItem({
      menu: {
        name: itemToUpdate.name,
        description: itemToUpdate.description,
        price: itemToUpdate.price,
        category: itemToUpdate.category,
        image: itemToUpdate.image,
        ingredients: itemToUpdate.ingredients,
        dietaryRestrictions: itemToUpdate.dietaryRestrictions,
        isAvailable: !itemToUpdate.isAvailable,
      },
      identifier: user.identifier,
    });
    const newStatus = item?.status === "active" ? "inactive" : "active";
    toast({
      title: "Status updated",
      description: `${item?.name} is now ${newStatus}.`,
    });
  };

  useEffect(() => {
    if (searchQuery) {
      const filteredItems = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setMenuItems(filteredItems);
    } else {
      setMenuItems(menuItems);
    }
  }, [searchQuery, menuRawData]);

  const filteredMenuItems = menuItems.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });


  console.log("Filtered Menu Items:", filteredMenuItems);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Menu Items</h1>
        <p className="text-muted-foreground">
          Manage your restaurant's menu items and categories.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs
            defaultValue="all"
            className="w-full sm:w-auto"
            onValueChange={setSelectedCategory}
          >
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="Main Course">Main Course</TabsTrigger>
              <TabsTrigger value="Appetizer">Appetizers</TabsTrigger>
              <TabsTrigger value="Dessert">Desserts</TabsTrigger>
              <TabsTrigger value="Beverage">Beverages</TabsTrigger>
              <TabsTrigger value="Fast Food">Fast Food</TabsTrigger>
              <TabsTrigger value="Side">Side</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[180px] lg:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search menu items..."
                className="w-full pl-8 bg-background"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                <DropdownMenuCheckboxItem checked>
                  Main Course
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Appetizer
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Dessert
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Beverage
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="default"
              size="sm"
              className="h-9"
              onClick={() => setIsAddItemModalOpen(true)}
            >
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
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Description
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMenuItems.map((item) => (
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
                    <TableCell className="hidden md:table-cell">
                      {item.category}
                    </TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[300px] truncate">
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <ItemStatus status={item.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(item.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                        >
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
      <AddMenuItemForm
        open={isAddItemModalOpen}
        onOpenChange={setIsAddItemModalOpen}
        onAddItem={handleAddItem}
      />
    </div>
  );
}

function ItemStatus({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === "active" && "border-emerald-500 text-emerald-500",
        status === "inactive" && "border-slate-500 text-slate-500"
      )}
    >
      {status}
    </Badge>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default MenuItemsPage;
