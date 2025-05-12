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
import { updateMenuItem } from "@/lib/api/restaurantApi";
import { useAuth } from "@/contexts/auth-context";
import { getUserByCategoryAndId } from "@/lib/api/userApi";
import { USER_CATEGORIES } from "@/constants/userConstants";
import {
  mapToMenuCategories,
  mapToMenuItems,
} from "@/app/(customer)/restaurants/[id]/page";
import {
  deleteMenuItem,
  getMenuItemByRestaurantId,
} from "@/lib/api/menuItemApi";
import { UpdateMenuItemForm } from "@/components/restaurant/update-menu-item-form";
import { ToastAction } from "@/components/ui/toast";
import { Alert } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function MenuItemsPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuRawData, setMenuRawData] = useState([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteTrigger, setDeleteTrigger] = useState(false);

  // useEffect(() => {
  //   const fetchRestaurantData = async () => {
  //     try {
  //       const data = await getUserByCategoryAndId(
  //         USER_CATEGORIES.RESTAURANT,
  //         user.identifier,
  //         null
  //       );
  //       setMenuRawData(data.menu);
  //       const menuCategories = mapToMenuCategories(data.menu, data.identifier);
  //       const categoryIdMap = Object.fromEntries(
  //         menuCategories.map((category) => [category.name, category.id])
  //       );
  //       setMenuItems(mapToMenuItems(data.menu, data.identifier, categoryIdMap));
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   if (user && `${user.role}s` === USER_CATEGORIES.RESTAURANT) {
  //     fetchRestaurantData();
  //   }
  // }, [user]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response: any = await getMenuItemByRestaurantId(user.refID._id);
        if (response.data) {
          setMenuItems(response.data);
          // console.log(`driverOrders => `, response.data);
        }
      } catch (err: any) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            console.log(`MenuItem Details Fetching Failed: ${data.message}`);
          } else {
            console.log("An unexpected error occurred. Please try again.");
          }
        } else {
          console.log(
            "An unexpected error occurred. Please check your network and try again."
          );
        }
      }
    };

    if (user.refID._id) fetchMenuItems();
  }, [user.refID._id, isAddItemModalOpen, isUpdateItemModalOpen, deleteTrigger]);

  const handleAddItem = (newItem: any) => {
    setMenuItems([newItem, ...menuItems]);
  };

  // const handleDeleteItem = async (id: number) => {
  //   setMenuItems(menuItems.filter((item) => item.id !== id));
  //   const itemToDelete = menuItems.find((item) => item.id === id);
  //   const itemToDeleteRaw = menuRawData.find(
  //     (rawItem) => rawItem.name === itemToDelete.name
  //   );
  //   await deleteMenuItem({ menuId: itemToDeleteRaw.name, id: user.identifier });
  //   toast({
  //     title: "Menu item deleted",
  //     description: "The menu item has been deleted successfully.",
  //   });
  // };

  const handleUpdateItem = (updatedItem: any) => {
    setSelectedItem(updatedItem);
    setIsUpdateItemModalOpen(true);
  };

  // const handleToggleStatus = async (id: string) => {
  //   setMenuItems(
  //     menuItems.map((item : any) =>
  //       item._id === id
  //         ? {
  //             ...item,
  //             status: item.status === "active" ? "inactive" : "active",
  //           }
  //         : item
  //     )
  //   );

  //   const item = menuItems.find((item) => item.id === id);
  //   const itemToUpdate = menuRawData.find(
  //     (rawItem) => rawItem.name === item.name
  //   );
  //   console.log("itemToUpdate", itemToUpdate);
  //   await updateMenuItem({
  //     menu: {
  //       name: itemToUpdate.name,
  //       description: itemToUpdate.description,
  //       price: itemToUpdate.price,
  //       category: itemToUpdate.category,
  //       image: itemToUpdate.image,
  //       ingredients: itemToUpdate.ingredients,
  //       dietaryRestrictions: itemToUpdate.dietaryRestrictions,
  //       isAvailable: !itemToUpdate.isAvailable,
  //     },
  //     identifier: user.identifier,
  //   });
  //   const newStatus = item?.status === "active" ? "inactive" : "active";
  //   toast({
  //     title: "Status updated",
  //     description: `${item?.name} is now ${newStatus}.`,
  //   });
  // };

  useEffect(() => {
    if (searchQuery) {
      const filteredItems = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setMenuItems(filteredItems);
    } else {
      setMenuItems(menuRawData);
    }
  }, [searchQuery, menuRawData]);

  const filteredMenuItems = menuItems.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await deleteMenuItem(id);
      if (response) {
        toast({
          title: "Success",
          description: `Menu item has been deleted successfully.`,
          variant: "default",
        });
        setDeleteTrigger(!deleteTrigger);
      }
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            title: "Error",
            description: `MenuItem deletion failed: ${data.message}`,
            variant: "destructive",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unexpected error occurred. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

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
                {filteredMenuItems.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
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
                      <ItemStatus status={item.isAvailable} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to Delete this item?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Once deleted, this item cannot be recovered.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteItem(item._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
      <UpdateMenuItemForm
        open={isUpdateItemModalOpen}
        onOpenChange={setIsUpdateItemModalOpen}
        selectedItem={selectedItem}
      />
    </div>
  );
}

function ItemStatus({ status }: { status: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === true && "border-emerald-500 text-emerald-500",
        status === false && "border-slate-500 text-slate-500"
      )}
    >
      {status ? "Available" : "Not Available"}
    </Badge>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default MenuItemsPage;
