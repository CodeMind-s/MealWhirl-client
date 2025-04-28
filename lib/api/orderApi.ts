import axiosInstance from "../middleware/axioinstance";
import { AxiosResponse } from "axios";

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

type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELLED";

interface OrderStatusDto {
  orderStatus: OrderStatus;
}

interface AssignDeliveryPersonDto {
  deliveryPersonId: string;
}

export const createNewOrder = async (data: Order): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.post(`/orders`, data);
    return response;
  } catch (error) {
    console.log("Error while creating order:", error);
    throw error;
  }
};

export const getAllOrders = async (): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.get(`/orders`);
    return response;
  } catch (error) {
    console.log("Error while fetchin orders:", error);
    throw error;
  }
};

export const getOrdersByDeliveryPersonId = async (
  driverId: string
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.get(`/orders/delivery/${driverId}`);
    return response;
  } catch (error) {
    console.log("Error while fetchin driver orders:", error);
    throw error;
  }
};

export const getOrdersByUserId = async (
  userId: string
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.get(`/orders/user/${userId}`);
    return response;
  } catch (error) {
    console.log("Error while fetchin user orders:", error);
    throw error;
  }
};

export const getOrdersByRestaurantId = async (
  restaurantId: string
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.get(
      `/orders/restaurant/${restaurantId}`
    );
    return response;
  } catch (error) {
    console.log("Error while fetchin restaurant orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response;
  } catch (error) {
    console.log("Error while fetchin restaurant orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  data: OrderStatusDto
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.patch(`/orders/${orderId}`, data);
    return response;
  } catch (error) {
    console.log("Error while updating order status:", error);
    throw error;
  }
};

export const assignDeliveryPerson = async (
  orderId: string,
  data: AssignDeliveryPersonDto
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.patch(`/orders/${orderId}`, data);
    return response;
  } catch (error) {
    console.log("Error while updating order status:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.delete(`/orders/${orderId}`);
    return response;
  } catch (error) {
    console.log("Error while deleting order:", error);
    throw error;
  }
};
