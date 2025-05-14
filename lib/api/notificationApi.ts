import axiosInstance from "../middleware/axiosinstance";

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

export const createNotification = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/notifications`, data);
    return response;
  } catch (error) {
    console.log("Error while creating notification:", error);
    throw error;
  }
};

export const sendSMSNotification = async (data: SMSNotification) => {
  try {
    const response = await axiosInstance.post(`/notifications/sms`, data);
    return response;
  } catch (error) {
    console.log("Error while sending SMS notification:", error);
    throw error;
  }
};

export const sendEmailNotification = async (data: EmailNotification) => {
  try {
    const response = await axiosInstance.post(`/notifications/email`, data);
    return response;
  } catch (error) {
    console.log("Error while sending Email notification:", error);
    throw error;
  }
};

export const getNotificationsByUser = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/notifications/user/${userId}`);
    return response;
  } catch (error) {
    console.log("Error while fetching notifications:", error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/notifications/${notificationId}`
    );
    return response;
  } catch (error) {
    console.log("Error while deleting notification:", error);
    throw error;
  }
};

export const markNotificationsAsRead = async (
  notificationId: string,
  data: { isRead: boolean }
) => {
  try {
    const response = await axiosInstance.patch(
      `/notifications/${notificationId}`,
      data
    );
    return response;
  } catch (error) {
    console.log("Error while marking all notifications as read:", error);
    throw error;
  }
};
