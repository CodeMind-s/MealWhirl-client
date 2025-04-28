import { AxiosResponse } from "axios";
import axiosInstance from "../middleware/axioinstance";

interface Notification {
  userId: string;
  title: string;
  message: string;
  type: string;
}

interface SMSNotification {
  to: string;
  message: string;
}

interface EmailNotification {
  email: string;
  order: {
    _id: string;
    items: {
      name: string;
      quantity: string;
      price: string;
    }[];
    subtotal: string;
    deliveryFee: string;
    totalAmount: string;
    deliveryAddress: string;
    estimatedDelivery: string;
    status: string;
  };
}

export const createNewNotification = async (
  data: Notification
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.post(`/notifications`, data);
    return response;
  } catch (error) {
    console.log("Error while creating notification:", error);
    throw error;
  }
};

export const sendSMSNotification = async (
  data: SMSNotification
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.post(`/notifications/sms`, data);
    return response;
  } catch (error) {
    console.log("Error while sending SMS notification:", error);
    throw error;
  }
};

export const sendEmailNotification = async (
  data: EmailNotification
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.post(`/notifications/email`, data);
    return response;
  } catch (error) {
    console.log("Error while sending Email notification:", error);
    throw error;
  }
};
