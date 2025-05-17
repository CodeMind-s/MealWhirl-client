import { api } from "../middleware/api";

export async function createUser(data: any) {
  try {
    const response = await api.post(`/users`, data);
    return response.data;
  } catch (error) {
    console.log("Error creating user:", error);
    throw error;
  }
}

export async function getUserById(userId: string) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching user by ID:", error);
    throw error;
  }
}

export async function getAllCustomers() {
  try {
    const response = await api.get(`/users/customers`);
    return response.data;
  } catch (error) {
    console.log("Error fetching all users:", error);
    throw error;
  }
}

export async function getAllDrivers() {
  try {
    const response = await api.get(`/users/drivers`);
    return response.data;
  } catch (error) {
    console.log("Error fetching all users:", error);
    throw error;
  }
}

export async function getAllRestaurants() {
  try {
    const response = await api.get(`/users/restaurants`);
    return response.data;
  } catch (error) {
    console.log("Error fetching all users:", error);
    throw error;
  }
}

export async function deleteUserById(userId: string) {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.log("Error deleting user by ID:", error);
    throw error;
  }
}

export async function updateUserById(userId: string, data: any) {
  try {
    const response = await api.patch(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.log("Error updating user by ID:", error);
    throw error;
  }
}
