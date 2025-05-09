import type {
  Restaurant,
  MenuItem,
  MenuCategory,
  Order,
} from "@/types/Restaurant";

export const restaurants: Restaurant[] = [
  {
    id: "rest1",
    name: "Burger Palace",
    image: "/placeholder.svg?height=200&width=300",
    description: "Gourmet burgers made with premium ingredients",
    cuisineType: "American",
    rating: 4.7,
    reviewCount: 243,
    deliveryTime: 25,
    deliveryFee: 2.99,
    minOrder: 15,
    distance: 1.2,
    isOpen: true,
    isNew: false,
  },
  {
    id: "rest2",
    name: "Pizza Heaven",
    image: "/placeholder.svg?height=200&width=300",
    description: "Authentic Italian pizzas baked in wood-fired ovens",
    cuisineType: "Italian",
    rating: 4.5,
    reviewCount: 187,
    deliveryTime: 30,
    deliveryFee: 1.99,
    minOrder: 20,
    distance: 2.5,
    isOpen: true,
    isNew: false,
  },
  {
    id: "rest3",
    name: "Sushi Express",
    image: "/placeholder.svg?height=200&width=300",
    description: "Fresh and delicious sushi delivered to your door",
    cuisineType: "Japanese",
    rating: 4.8,
    reviewCount: 156,
    deliveryTime: 35,
    deliveryFee: 3.99,
    minOrder: 25,
    distance: 3.1,
    isOpen: true,
    isNew: true,
  },
  {
    id: "rest4",
    name: "Taco Fiesta",
    image: "/placeholder.svg?height=200&width=300",
    description: "Authentic Mexican tacos and burritos",
    cuisineType: "Mexican",
    rating: 4.3,
    reviewCount: 112,
    deliveryTime: 20,
    deliveryFee: 1.49,
    minOrder: 10,
    distance: 0.8,
    isOpen: true,
    isNew: false,
  },
  {
    id: "rest5",
    name: "Noodle House",
    image: "/placeholder.svg?height=200&width=300",
    description: "Asian noodles and soups from various cuisines",
    cuisineType: "Asian",
    rating: 4.6,
    reviewCount: 98,
    deliveryTime: 25,
    deliveryFee: 2.49,
    minOrder: 15,
    distance: 1.7,
    isOpen: true,
    isNew: true,
  },
  {
    id: "rest6",
    name: "Healthy Greens",
    image: "/placeholder.svg?height=200&width=300",
    description: "Fresh salads and healthy bowls for the health-conscious",
    cuisineType: "Healthy",
    rating: 4.4,
    reviewCount: 76,
    deliveryTime: 20,
    deliveryFee: 2.99,
    minOrder: 12,
    distance: 1.5,
    isOpen: true,
    isNew: false,
  },
  {
    id: "rest7",
    name: "Curry House",
    image: "/placeholder.svg?height=200&width=300",
    description: "Authentic Indian curries and tandoori dishes",
    cuisineType: "Indian",
    rating: 4.7,
    reviewCount: 132,
    deliveryTime: 35,
    deliveryFee: 2.99,
    minOrder: 20,
    distance: 2.8,
    isOpen: true,
    isNew: false,
  },
  {
    id: "rest8",
    name: "Mediterranean Delight",
    image: "/placeholder.svg?height=200&width=300",
    description: "Fresh Mediterranean dishes with a modern twist",
    cuisineType: "Mediterranean",
    rating: 4.5,
    reviewCount: 89,
    deliveryTime: 30,
    deliveryFee: 2.49,
    minOrder: 15,
    distance: 2.2,
    isOpen: true,
    isNew: true,
  },
];

export const menuCategories: MenuCategory[] = [
  { id: "cat1", restaurantId: "rest1", name: "Burgers" },
  { id: "cat2", restaurantId: "rest1", name: "Sides" },
  { id: "cat3", restaurantId: "rest1", name: "Drinks" },
  { id: "cat4", restaurantId: "rest1", name: "Desserts" },
  { id: "cat5", restaurantId: "rest2", name: "Pizzas" },
  { id: "cat6", restaurantId: "rest2", name: "Pastas" },
  { id: "cat7", restaurantId: "rest2", name: "Salads" },
  { id: "cat8", restaurantId: "rest2", name: "Drinks" },
];

export const menuItems: MenuItem[] = [
  {
    id: "item1",
    restaurantId: "rest1",
    categoryId: "cat1",
    name: "Classic Burger",
    description:
      "Beef patty with lettuce, tomato, onion, and our special sauce",
    price: 8.99,
    image: "/placeholder.svg?height=200&width=300",
    isPopular: true,
  },
  {
    id: "item2",
    restaurantId: "rest1",
    categoryId: "cat1",
    name: "Cheese Burger",
    description: "Beef patty with cheddar cheese, lettuce, tomato, and mayo",
    price: 9.99,
    image: "/placeholder.svg?height=200&width=300",
    isPopular: false,
  },
  {
    id: "item3",
    restaurantId: "rest1",
    categoryId: "cat1",
    name: "Bacon Burger",
    description: "Beef patty with crispy bacon, cheese, lettuce, and BBQ sauce",
    price: 11.99,
    image: "/placeholder.svg?height=200&width=300",
    isPopular: true,
  },
  {
    id: "item4",
    restaurantId: "rest1",
    categoryId: "cat2",
    name: "French Fries",
    description: "Crispy golden fries with sea salt",
    price: 3.99,
    image: "/placeholder.svg?height=200&width=300",
    isPopular: false,
  },
  {
    id: "item5",
    restaurantId: "rest1",
    categoryId: "cat2",
    name: "Onion Rings",
    description: "Crispy battered onion rings with dipping sauce",
    price: 4.99,
    image: "/placeholder.svg?height=200&width=300",
    isPopular: false,
  },
  {
    id: "item6",
    restaurantId: "rest1",
    categoryId: "cat3",
    name: "Soda",
    description: "Choice of Coke, Sprite, or Fanta",
    price: 1.99,
    image: "/placeholder.svg?height=200&width=300",
    isPopular: false,
  },
  {
    id: "item7",
    restaurantId: "rest2",
    categoryId: "cat5",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=300",
    isPopular: true,
  },
  {
    id: "item8",
    restaurantId: "rest2",
    categoryId: "cat5",
    name: "Pepperoni Pizza",
    description: "Pizza with tomato sauce, mozzarella, and pepperoni",
    price: 14.99,
    image: "/placeholder.svg?height=200&width=300",
    isPopular: true,
  },
];

export const orders: Order[] = [
  {
    id: "order1",
    orderNumber: "ORD-001",
    date: "April 15, 2023",
    restaurant: "Burger Palace",
    items: [
      { name: "Classic Burger", quantity: 2, price: 8.99 },
      { name: "French Fries", quantity: 1, price: 3.99 },
      { name: "Soda", quantity: 2, price: 1.99 },
    ],
    status: "completed",
    total: 25.95,
    subtotal: 21.96,
    deliveryFee: 2.99,
    tax: 1.0,
    deliveryAddress: {
      street: "123 Main St",
      city: "Anytown",
      zipCode: "12345",
    },
    phone: "+1 (555) 123-4567",
    paymentMethod: "Credit Card (Visa ****4242)",
    paymentStatus: "Paid",
  },
  {
    id: "order2",
    orderNumber: "ORD-002",
    date: "April 20, 2023",
    restaurant: "Pizza Heaven",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { name: "Pepperoni Pizza", quantity: 1, price: 14.99 },
    ],
    status: "delivering",
    total: 31.97,
    subtotal: 27.98,
    deliveryFee: 1.99,
    tax: 2.0,
    estimatedDelivery: "Today, 7:15 PM",
    deliveryAddress: {
      street: "123 Main St",
      city: "Anytown",
      zipCode: "12345",
    },
    phone: "+1 (555) 123-4567",
    paymentMethod: "Credit Card (Visa ****4242)",
    paymentStatus: "Paid",
    deliveryInstructions: "Leave at the door",
  },
  {
    id: "order3",
    orderNumber: "ORD-003",
    date: "April 25, 2023",
    restaurant: "Sushi Express",
    items: [
      { name: "California Roll", quantity: 2, price: 7.99 },
      { name: "Salmon Nigiri", quantity: 1, price: 9.99 },
    ],
    status: "preparing",
    total: 28.96,
    subtotal: 23.97,
    deliveryFee: 3.99,
    tax: 1.0,
    estimatedDelivery: "Today, 8:00 PM",
    deliveryAddress: {
      street: "123 Main St",
      city: "Anytown",
      zipCode: "12345",
    },
    phone: "+1 (555) 123-4567",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
  },
];
