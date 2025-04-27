import axios from "axios";
import { getUserSession } from "./auth";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001", // Define a configurable base URL
});

axiosInstance.interceptors.request.use(
  async (config: any) => {
    try {
      const session = await getUserSession();
      const { token } = session || {};

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      if (config.originalUrl) {
        config.url = `${config.baseURL}${config.originalUrl}`;
      }
    } catch (error) {
      console.error("Error retrieving user session:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;