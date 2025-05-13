import axiosInstance from "../middleware/axiosinstance";

type PaymentMethod = "CASH" | "CARD";

type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

interface Transaction {
  userId: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentGatewayTransactionId: string;
  description: string;
}

interface TransactionStatusDto {
  paymentStatus: PaymentStatus;
}


export const createNewTransaction = async (data: Transaction) => {
  try {
    const response = await axiosInstance.post(`/payments`, data);
    return response;
  } catch (error) {
    console.log("Error while creating payment:", error);
    throw error;
  }
};

export const getAllTransaction = async () => {
  try {
    const response = await axiosInstance.get(`/payments`);
    return response;
  } catch (error) {
    console.log("Error while fetchin payments:", error);
    throw error;
  }
};

export const getTransactionsByUserId = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/payments/user/${userId}`);
    return response;
  } catch (error) {
    console.log("Error while fetchin user payments:", error);
    throw error;
  }
};

export const getTransactionById = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(`/payments/${orderId}`);
    return response;
  } catch (error) {
    console.log("Error while fetchin restaurant payments:", error);
    throw error;
  }
};

export const updateTransactionStatus = async (
  orderId: string,
  data: TransactionStatusDto
) => {
  try {
    const response = await axiosInstance.patch(`/payments/${orderId}`, data);
    return response;
  } catch (error) {
    console.log("Error while updating payment status:", error);
    throw error;
  }
};

export const deleteTransaction = async (orderId: string) => {
  try {
    const response = await axiosInstance.delete(`/payments/${orderId}`);
    return response;
  } catch (error) {
    console.log("Error while deleting payment:", error);
    throw error;
  }
};
