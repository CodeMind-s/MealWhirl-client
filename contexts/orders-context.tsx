// "use client"

// import { createContext, useContext, useState, type ReactNode } from "react"
// import type { Order } from "@/types/Order"
// import { mockOrders } from "@/data/mock-orders"

// interface OrdersContextType {
//   orders: Order[]
//   updateOrderStatus: (orderId: string, status: string) => void
// }

// const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

// export function OrdersProvider({ children }: { children: ReactNode }) {
//   const [orders, setOrders] = useState<Order[]>(mockOrders)

//   const updateOrderStatus = (orderId: string, status: string) => {
//     setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: status as Order["status"] } : order)))
//   }

//   return <OrdersContext.Provider value={{ orders, updateOrderStatus }}>{children}</OrdersContext.Provider>
// }

// export function useOrders() {
//   const context = useContext(OrdersContext)
//   if (context === undefined) {
//     throw new Error("useOrders must be used within an OrdersProvider")
//   }
//   return context
// }

"use client";

import { add } from "date-fns";
import { createContext, useContext, useState, type ReactNode } from "react";
// import type { Order } from "@/types/Order"
// import { mockOrders } from "@/data/mock-orders"

export interface Order {
  userId: string;
  restaurantId: string;
  items: {
    itemName: string;
    quentity: string;
    total: string;
    imageUrl: string;
  }[];
  deliveryAddress: {
    address: string;
    latitude: number;
    longitude: number;
  };
  paymentId: string;
  paymentMethod: string;
  totalAmount: number;
  deliveryFee: number;
  subTotal: number;
  tax: number;
  distance: number;
  duration: number;
  fare: number;
  specialInstructions: string;
  status:
    | "PENDING"
    | "PLACED"
    | "ACCEPTED"
    | "PREPARING"
    | "REDY_FOR_PICKUP"
    | "PICKED_UP"
    | "ON_THE_WAY"
    | "DELIVERED"
    | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
}

interface OrdersContextType {
  order: Order;
  setOrderData: (orderData: Order) => void;
  setOrderPaymentMethod: (paymentMethod: string) => void;
  setAddressDetails: (address: string, instructions: string) => void;
  // updateOrderStatus: (orderId: string, status: string) => void
  // updatePaymentStatus: (orderId: string, paymentStatus: Order["paymentStatus"]) => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<Order | any>({});

  const setOrderData = (orderData: Order) => {
    setOrder(orderData);
    console.log("Order data set:", orderData);
  };

  const setOrderPaymentMethod = (paymentMethod: string) => {
    setOrder((prevOrder: Order) => ({ ...prevOrder, paymentMethod }));
  };

  const setAddressDetails = (address: string, instructions: string) => {
    setOrder((prevOrder: Order) => ({
      ...prevOrder,
      deliveryAddress: {
        ...prevOrder.deliveryAddress,
        address,
      },
      specialInstructions: instructions,
    }));
  };

  // const updateOrderStatus = (orderId: string, status: string) => {
  //   setOrders((prevOrders) =>
  //     prevOrders.map((order) =>
  //       order.id === orderId ? { ...order, status } : order
  //     )
  //   )
  // }

  // const updatePaymentStatus = (orderId: string, paymentStatus: Order["paymentStatus"]) => {
  //   setOrders((prevOrders) =>
  //     prevOrders.map((order) =>
  //       order.id === orderId ? { ...order, paymentStatus } : order
  //     )
  //   )
  // }

  return (
    <OrdersContext.Provider
      value={{ order, setOrderData, setOrderPaymentMethod, setAddressDetails }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
