"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/types/User";
import axiosInstance from "@/lib/middleware/axiosinstance";
import {
  getUserSession,
  removeUserSession,
  setUserSession,
} from "@/lib/middleware/auth";
import { USER_ACCOUNT_STATUS, USER_CATEGORIES } from "@/constants/userConstants";
import { getUserByCategoryAndId } from "@/lib/api/userApi";

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  register: (
    identifier: string,
    password: string,
    role?: string,
    type?: string
  ) => Promise<{ success: boolean; error?: string }>;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to map category to UserRole
const mapCategoryToRole = (category: string): UserRole => {
  const roleMap: Record<string, UserRole> = {
    customers: "customer",
    drivers: "driver",
    restaurants: "restaurant",
    super_admins: "admin",
    admins: "admin",
  };
  return roleMap[category] || "customer";
};

// Handle the authentication response
const handleAuthResponse = (response: any): User => {
  const { data = {} } = response.data;
  const { identifier, type, category, token = null, accountStatus } = data;

  return {
    identifier,
    type,
    role: mapCategoryToRole(category),
    token,
    accountStatus,
    basic: {
      name: null
    }
  };
};

// Get the route based on user role and status
export const getRouteForRole = (role: UserRole, status: string): string => {
  let userPath = "/login";
  switch (role) {
    case "customer":
      userPath = "/profile";
      break;
    case "driver":
      userPath = "/driver";
      break;
    case "restaurant":
      userPath = "/restaurant";
      break;
    case "admin":
      userPath = "/admin";
      break;
    default:
      return userPath;
  }

  const profileRoutes = ["restaurant"];

  if (profileRoutes.includes(role) && status === USER_ACCOUNT_STATUS.CREATING) {
    return `${userPath}/settings`;
  }
  return userPath;
};

// AuthProvider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user session on mount
  useEffect(() => {
    const initializeUserSession = async () => {
      try {
        const storedUser = await getUserSession();
        if (storedUser?.token) {
          setUser(storedUser);
        } else {
          console.log("No user session found, redirecting to login.");
          setUser(null);
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUserSession();
  }, [router]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/v1/login", {
        identifier: email,
        password: btoa(password),
      });

      const user = handleAuthResponse(response);
      if(user.accountStatus !== USER_ACCOUNT_STATUS.CREATING) {
        const data = await getUserByCategoryAndId(`${user.role}s`, user.identifier, user.token);
        user.basic = {
          name: data?.name || user.identifier
        }
      }
      setUser(user);
      setUserSession(user);
      router.push(getRouteForRole(user.role, user.accountStatus));

      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (
    identifier: string,
    password: string,
    role?: string,
    type?: string
  ) => {
    try {
      const response = await axiosInstance.post("/auth/v1/register", {
        [`${type}`]: identifier,
        password: btoa(password),
        type,
        category: role,
      });

      const user = handleAuthResponse(response);
      setUser(user);
      setUserSession(user);
      router.push("/login");

      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    removeUserSession();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
