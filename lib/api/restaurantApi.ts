import { USER_ACCOUNT_STATUS } from "@/constants/userConstants";
import { restaurants } from "../data";
import axiosInstance from "../middleware/axioinstance";

export const createUpdateResaurant = async (userData: Record<string, any>, status: string) => {
  const { identifier, ...rest } = userData;
  const payload = {
    restaurant: rest,
    ...(USER_ACCOUNT_STATUS.CREATING === status ? { identifier: identifier || userData.email } : {}),
  };
  try {
    const method = status === USER_ACCOUNT_STATUS.CREATING ? axiosInstance.post : axiosInstance.put;
    const suffix = status === USER_ACCOUNT_STATUS.CREATING ? "" : `/${identifier}`;
    const response = await method(`/users/v1/restaurants${suffix}`, payload);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

export const addPayamentMethod = async (userData: Record<string, any>) => {
  try {
    const response = await axiosInstance.post(
      `/users/v1/restaurant/payment`,
      userData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error adding payment method:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

export const addMenuItem = async (menuData: Record<string, any>) => {
    try {
      const response = await axiosInstance.post(
        `/users/v1/restaurant/menu`,
        menuData
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error adding menu item:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  };

  export const updateMenuItem = async (menuData: Record<string, any>) => {
    try {
      const response = await axiosInstance.put(
        `/users/v1/restaurant/menu`,
        menuData
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error adding menu item:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  };


  export const deleteMenuItem = async (menuData: Record<string, any>) => {
    try {
      const response = await axiosInstance.delete(
        `/users/v1/restaurant/id/${menuData.id}/menu/${menuData.menuId}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error adding menu item:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  }
