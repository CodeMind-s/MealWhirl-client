import axiosInstance from "../middleware/axiosinstance";

type Category = "APPETIZER" | "MAIN_COURSE" | "DESSERT" | "BEVERAGE" | "FAST_FOOD" | "SIDE" | "OTHER";

interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  isAvailable: boolean;
  restaurantId: string;
}
interface UpdateMenuItemDto {
    name: string;
    description: string;
    price: number;
    category: Category;
    imageUrl: string;
    isAvailable: boolean;
  }

export const createNewMenuItem = async (data: MenuItem) => {
  try {
    const response = await axiosInstance.post(`/menu-items`, data);
    return response;
  } catch (error) {
    console.log("Error while creating menu item:", error);
    throw error;
  }
};

export const getAllMenuItems = async () => {
  try {
    const response = await axiosInstance.get(`/menu-items`);
    return response;
  } catch (error) {
    console.log("Error while fetchin menu items:", error);
    throw error;
  }
};


export const getMenuItemByRestaurantId = async (restaurantId: string) => {
  try {
    const response = await axiosInstance.get(
      `/menu-items/restaurant/${restaurantId}`
    );
    return response;
  } catch (error) {
    console.log("Error while fetchin restaurant menu items:", error);
    throw error;
  }
};

export const getMenuItemById = async (menuItemId: string) => {
  try {
    const response = await axiosInstance.get(`/menu-items/${menuItemId}`);
    return response;
  } catch (error) {
    console.log("Error while fetchin restaurant menu items:", error);
    throw error;
  }
};

export const updateMenuItems = async (
    menuItemId: string,
  data: UpdateMenuItemDto
) => {
  try {
    const response = await axiosInstance.patch(`/menu-items/${menuItemId}`, data);
    return response;
  } catch (error) {
    console.log("Error while updating menu item status:", error);
    throw error;
  }
};


export const deleteMenuItem = async (menuItemId: string) => {
  try {
    const response = await axiosInstance.delete(`/menu-items/${menuItemId}`);
    return response;
  } catch (error) {
    console.log("Error while deleting menu item:", error);
    throw error;
  }
};
