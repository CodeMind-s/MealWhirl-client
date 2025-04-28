import axiosInstance from "../middleware/axioinstance";

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

export const createNewOrder = async (data: Order) => {
  try {
    const response = await axiosInstance.post(`/api/v1/orders`, data);
    return response;
  } catch (error) {
    console.log("Error while creating order:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/orders`);
    return response;
  } catch (error) {
    console.log("Error while fetchin orders:", error);
    throw error;
  }
};

export const getOrdersByDeliveryPersonId = async (driverId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/orders/delivery/${driverId}`
    );
    return response;
  } catch (error) {
    console.log("Error while fetchin driver orders:", error);
    throw error;
  }
};

export const getOrdersByUserId = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/orders/user/${userId}`);
    return response;
  } catch (error) {
    console.log("Error while fetchin user orders:", error);
    throw error;
  }
};

export const getOrdersByRestaurantId = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/orders/restaurant/${restaurantId}`
    );
    return response;
  } catch (error) {
    console.log("Error while fetchin restaurant orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/orders/${orderId}`);
    return response;
  } catch (error) {
    console.log("Error while fetchin restaurant orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  data: OrderStatusDto
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/orders/${orderId}`,
      data
    );
    return response;
  } catch (error) {
    console.log("Error while updating order status:", error);
    throw error;
  }
};

export const assignDeliveryPerson = async (
  orderId: string,
  data: AssignDeliveryPersonDto
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/orders/${orderId}`,
      data
    );
    return response;
  } catch (error) {
    console.log("Error while updating order status:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/orders/${orderId}`);
    return response;
  } catch (error) {
    console.log("Error while deleting order:", error);
    throw error;
  }
};
