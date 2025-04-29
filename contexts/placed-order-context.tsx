"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface DeliveryAddress {
  latitude: number;
  longitude: number;
  address: string;
}

type PaymentMethod = "CASH" | "CARD";

interface Order {
  userId: string;
  restaurantId: string;
  items: any[];
  deliveryAddress: DeliveryAddress;
  paymentId: string;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  deliveryFee: number;
  distance: string;
  duration: string;
  fare: string;
  specialInstructions: string;
}

interface OrderContextType {
  placedOder: Order | null;
  setPlacedOrder: (order: Order) => void;
  clearPlacedOrder: () => void;
  setPaymentId: (paymentId: string) => void;
}

const PlacedOrderContext = createContext<OrderContextType | undefined>(undefined);

export const PlacedOrderProvider = ({ children }: { children: ReactNode }) => {
  const [placedOrder, setPlacedOrderState] = useState<Order | null>(null);

  const setPlacedOrder = (newOrder: Order) => {
    setPlacedOrderState(newOrder);
  };

  const clearPlacedOrder = () => {
    setPlacedOrderState(null);
  };

    const setPaymentId = (paymentId: string) => {
        if (placedOrder) {
        setPlacedOrderState({ ...placedOrder, paymentId });
        }
    };

  return (
    <PlacedOrderContext.Provider value={{ placedOder: placedOrder, setPlacedOrder, clearPlacedOrder, setPaymentId }}>
      {children}
    </PlacedOrderContext.Provider>
  );
};

export const usePlacedOrder = (): OrderContextType => {
  const context = useContext(PlacedOrderContext);
  if (!context) {
    throw new Error("useOrder must be used within a PlacedOrderProvider");
  }
  return context;
};
