"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/types/User";
import axiosInstance from "@/lib/middleware/axioinstance";
import { getUserSession, setUserSession } from "@/lib/middleware/auth";

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  register: (
    identifier: string,
    password: string,
    role: string | undefined,
    type: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const handleAuthResponse = (response: any) => {
  const { data = {} } = response.data;
  const { identifier, type, category, token = null } = data;

  const roleMap: Record<string, UserRole> = {
    customers: "customer",
    drivers: "driver",
    restaurants: "restaurant",
    super_admins: "admin",
    admins: "admin",
  };

  const role = roleMap[category];

  const user = {
    identifier,
    type,
    role,
    token,
  };

  return user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserSession = async () => {
      console.log("Fetching user session...");
      const storedUser = await getUserSession();
      const token = storedUser?.token || null;
      if (token) {
        setUser(storedUser);
        router.push(getRouteForRole(storedUser.role));
      } else {
        console.log("No user session found, redirecting to login.");
        setUser(null);
        router.push("/login");
      }
      setIsLoading(true);
    };

    fetchUserSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post<{
        data: {
          token: string;
          identifier: string;
          type: string;
          category: string;
        };
      }>("/auth/v1/login", {
        identifier: email,
        password: btoa(password), // Encode password in Base64
      });

      const user = handleAuthResponse(response);
      setUser(user);
      await setUserSession(user);

      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      return { success: false, error: errorMessage };
    }
  };

  // Register function (if needed)
  const register = async (
    identifier: string,
    password: string,
    role: string | undefined,
    type: string | undefined,
  ) => {
    try {
      const response = await axiosInstance.post<{
        data: {
          identifier: string;
          type: string;
          category: string;
        };
      }>("/auth/v1/register", {
        [`${type}`]: identifier,
        password: btoa(password), // Encode password in Base64
        type,
        category: role,
      });

      const user = handleAuthResponse(response);

      setUser(user);
      await setUserSession(user);

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
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function getRouteForRole(role: UserRole): string {
  switch (role) {
    case "customer":
      return "/profile";
    case "driver":
      return "/driver";
    case "restaurant":
      return "/restaurant";
    case "admin":
      return "/super";
    default:
      return "/login";
  }
}
