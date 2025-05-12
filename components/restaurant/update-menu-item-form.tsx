"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { updateMenuItem } from "@/lib/api/restaurantApi";
import { useAuth } from "@/contexts/auth-context";
import { createNewMenuItem, updateMenuItems } from "@/lib/api/menuItemApi";
import { ToastAction } from "../ui/toast";
import { useToast } from "@/hooks/use-toast";

interface UpdateMenuItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: any;
}

export function UpdateMenuItemForm({
  open,
  onOpenChange,
  selectedItem,
}: UpdateMenuItemFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: selectedItem?.name || "",
    category: selectedItem?.category || "",
    price: selectedItem?.price || 0,
    description: selectedItem?.description || "",
    isAvailable: selectedItem?.isAvailable || true,
    imagePreview: selectedItem?.imageUrl || "",
    ingredients: "",
    dietaryRestrictions: "",
  });
  const { toast } = useToast();

    useEffect(() => {
        if (selectedItem) {
        setFormData({
            name: selectedItem.name,
            category: selectedItem.category,
            price: selectedItem.price,
            description: selectedItem.description,
            isAvailable: selectedItem.isAvailable,
            imagePreview: selectedItem.imageUrl,
            ingredients: "",
            dietaryRestrictions: "",
        });
        }
    }, [selectedItem]);
    
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const data: any = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        imageUrl: formData.imagePreview,
        isAvailable: formData.isAvailable,
      };

      const response = await updateMenuItems(selectedItem._id, data);
      if (response) {
        toast({
          title: "Success",
          description: `${formData.name} has been updateed to the menu.`,
          variant: "default",
        });
        setFormData({
          name: "",
          category: "",
          price: 0,
          description: "",
          imagePreview: "",
          ingredients: "",
          dietaryRestrictions: "",
          isAvailable: true,
        });
        setIsSubmitting(false);
        onOpenChange(false);
      }
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            title: "Error",
            description: `MenuItem update failed: ${data.message}`,
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


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   // Validate form
  //   if (!formData.name || !formData.category || !formData.price) {
  //     toast({
  //       title: "Missing required fields",
  //       description: "Please fill in all required fields.",
  //       variant: "destructive",
  //     });
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   // Create new item object
  //   const newItem = {
  //     id: Math.floor(Math.random() * 1000),
  //     name: formData.name,
  //     category: formData.category,
  //     price: formData.price,
  //     description: formData.description,
  //     status: formData.status,
  //     image:
  //       formData.imagePreview ||
  //       "https://img.freepik.com/free-icon/recipe_318-514507.jpg",
  //     ingredients: formData.ingredients.split(",").map((item) => item.trim()),
  //     dietaryRestrictions: formData.dietaryRestrictions
  //       .split(",")
  //       .map((item) => item.trim()),
  //     isAvailable: formData.isAvailable,
  //   };

  //   // Simulate saving the item (console log for now)
  //   const { id, status, ...rest } = newItem;
  //   await updateMenuItem({ menu: rest, identifier: user.identifier });

  //   // Call the onUpdateItem callback if provided
  //   if (onUpdateItem) {
  //     onUpdateItem(newItem);
  //   }

  //   // Show success toast
  //   toast({
  //     title: "Menu item updateed",
  //     description: `${formData.name} has been updateed to the menu.`,
  //   });

  //   // Reset form and close dialog
  //   setFormData({
  //     name: "",
  //     category: "",
  //     price: 0,
  //     description: "",
  //     status: "active",
  //     image: null,
  //     imagePreview: "",
  //     ingredients: "",
  //     dietaryRestrictions: "",
  //     isAvailable: true,
  //   });
  //   setIsSubmitting(false);
  //   onOpenChange(false);
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update New Menu Item</DialogTitle>
          <DialogDescription>
            Update a new item to your restaurant's menu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="required">
                Item Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Truffle Pasta"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="required">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAIN_COURSE">Main Course</SelectItem>
                  <SelectItem value="APPETIZER">Appetizer</SelectItem>
                  <SelectItem value="DESSERT">Dessert</SelectItem>
                  <SelectItem value="BEVERAGE">Beverage</SelectItem>
                  <SelectItem value="FAST_FOOD">Fast Food</SelectItem>
                  <SelectItem value="SIDE">Side</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="required">
                Price
              </Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="24.99"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isAvailable">Availability</Label>
              <RadioGroup
                id="isAvailable"
                value={formData.isAvailable ? "available" : "unavailable"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    isAvailable: value === "true",
                  }))
                }
                className="flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="available" id="available" />
                  <Label htmlFor="available">Available</Label>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <RadioGroupItem value="unavailable" id="unavailable" />
                  <Label htmlFor="unavailable">Unavailable</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Handmade pasta with black truffle cream sauce and parmesan"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients</Label>
            <Input
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              placeholder="lime, mint, water"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate ingredients with commas.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
            <Input
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleInputChange}
              placeholder="gluten, alcohol"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate restrictions with commas.
            </p>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="isAvailable">Availability</Label>
            <RadioGroup
              id="isAvailable"
              value={formData.isAvailable ? "true" : "false"}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  isAvailable: value === "true",
                }))
              }
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="available" />
                <Label htmlFor="available">Available</Label>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <RadioGroupItem value="false" id="unavailable" />
                <Label htmlFor="unavailable">Unavailable</Label>
              </div>
            </RadioGroup>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="imagePreview"
              value={formData.imagePreview}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Provide a URL for the item's image.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updateing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Item
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
