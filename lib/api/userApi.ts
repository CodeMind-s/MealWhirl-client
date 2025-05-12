import axiosInstance from "../middleware/axiosinstance";

// Define the return type
interface ApiResponse<T> {
  data: T;
}

// Fetch user details by category and ID
export const getUserByCategoryAndId = async (
  category: string,
  userId: string | null,
  token: string | null
): Promise<any> => {
  try {
    interface UserResponse {
      data: any;
    }
    const response = await axiosInstance.get(`/users/v1/${category}/${userId}`, {
      headers: {
        ...(token ? { Authorization: token } : {}),
      }
    });
    const responseData = response.data as UserResponse; // Type assertion
    return responseData.data;
  } catch (error: any) {
    console.error(
      "Error fetching user details:",
      error.response?.data || error.message
    );
    return { data: null }; // Return null or handle the error as needed
  }
};

// Fetch user details by category and ID
export const getUsersByCategory = async (
    category: string,
  ): Promise<any> => {
    try {
      interface UserResponse {
        data: any;
      }
      const response = await axiosInstance.get(`/users/v1/${category}`);
      const responseData = response.data as UserResponse; // Type assertion
      return responseData.data;
    } catch (error: any) {
      console.error(
        "Error fetching user details:",
        error.response?.data || error.message
      );
      return { data: null }; // Return null or handle the error as needed
    }
  };

// Update user details
export const updateUser = async (
  category: string,
  userId: string,
  userData: Record<string, any>
) => {
  try {
    const response = await axiosInstance.put(
      `/users/v1/${category}/${userId}`,
      userData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// Delete a user by ID
export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error deleting user:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

const getUserPayamentMethod = async (userId: string) => {
  try {
    const response = await axiosInstance.get(
      `/users/v1/restaurant/payment/${userId}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching payment method:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
}