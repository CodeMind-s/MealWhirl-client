export interface Restaurant {
  id: string;
  name: string;
  image?: string;
  description: string;
  cuisineType: string;
  rating: number;
  reviewCount: number;
  deliveryTime: number;
  deliveryFee: number;
  minOrder?: number;
  distance: number;
  isOpen: boolean;
  isNew?: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isPopular?: boolean;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
}

export interface CartItem {
  id: string; 
  restaurantId: string;
  restaurantName: string; 
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  totalItemPrice: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  restaurant: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  estimatedDelivery?: string;
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
  };
  phone: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryInstructions?: string;
}
