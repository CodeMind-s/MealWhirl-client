"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Order } from "@/types/Order"
import { mockOrders } from "@/data/mock-orders"

interface OrdersContextType {
  orders: Order[]
  updateOrderStatus: (orderId: string, status: string) => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: status as Order["status"] } : order)))
  }

  return <OrdersContext.Provider value={{ orders, updateOrderStatus }}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
