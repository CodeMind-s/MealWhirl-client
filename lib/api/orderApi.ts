import axiosInstance from "../middleware/axioinstance";

export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get(`/orders`);
    return response;
  } catch (error) {
    console.log("Error while fetchin orders:", error);
    throw error;
  }
};
