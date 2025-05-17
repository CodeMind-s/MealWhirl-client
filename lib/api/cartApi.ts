import axiosInstance from "../middleware/axiosinstance";

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface AddToCartDto {
  userId: string;
  restaurantId: string;
  item: CartItem;
}

interface UpdateCartItemDto {
  cartId: string;
  updates: {
    restaurantId: string;
    menuItemId: string;
    quantity: number;
  };
}

interface RemoveItemFromCartDto {
  cartId: string;
  updates: {
    type: "item" | "clear";
    restaurantId?: string;
    menuItemId?: string;
  };
}

interface SetActiveRestaurantDto {
  userId: string;
  restaurantId: string;
}

export const getAllCarts = async () => {
  try {
    const response = await axiosInstance.get(`/carts`);
    return response;
  } catch (error) {
    console.log("Error while fetching carts:", error);
    throw error;
  }
};

export const getCartById = async (cartId: string) => {
  try {
    const response = await axiosInstance.get(`/carts/${cartId}`);
    return response;
  } catch (error) {
    console.log("Error while fetching cart:", error);
    throw error;
  }
};

export const getCartByUserId = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/carts/user/${userId}`);
    return response;
  } catch (error) {
    console.log("Error while fetching user cart:", error);
    throw error;
  }
};

export const addToCart = async (data: AddToCartDto) => {
  try {
    const response = await axiosInstance.post(`/carts`, data);
    return response;
  } catch (error) {
    console.log("Error while adding item to cart:", error);
    throw error;
  }
};

export const updateCartItem = async (data: UpdateCartItemDto) => {
  try {
    const response = await axiosInstance.patch(
      `/carts/${data.cartId}`,
      data.updates
    );
    return response;
  } catch (error) {
    console.log("Error while updating cart item:", error);
    throw error;
  }
};

export const removeItemFromCart = async (data: RemoveItemFromCartDto) => {
  try {
    const response = await axiosInstance.patch(
      `/carts/items/${data.cartId}`,
      data.updates
    );
    return response;
  } catch (error) {
    console.log("Error while removing item from cart:", error);
    throw error;
  }
};

export const deleteCart = async (cartId: string) => {
  try {
    const response = await axiosInstance.delete(`/carts/${cartId}`);
    return response;
  } catch (error) {
    console.log("Error while deleting cart:", error);
    throw error;
  }
};

export const setActiveRestaurant = async (data: SetActiveRestaurantDto) => {
  try {
    const response = await axiosInstance.patch(
      `/carts/active-restaurant`,
      data
    );
    return response;
  } catch (error) {
    console.log("Error while setting active restaurant:", error);
    throw error;
  }
};
