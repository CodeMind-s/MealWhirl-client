'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Login } from "@/lib/api/authentication"; // adjust this path to your file structure
import Cookies from "js-cookie";
import { api } from "../lib/middleware/api";
import { useRouter } from "next/navigation";

type UserType = {
  _id: string;
  email: string;
  phone: string;
  type: string;
  isAdmin: boolean;
  refID: {
    address: {
      street: string;
      latitude: number;
      longitude: number;
    };
    _id: string;
    name: string;
  };
  createdAt: string;
};

type AuthContextType = {
  user: UserType | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Optional: Load user from cookies/localStorage
    // const storedUser = Cookies.get("user");
    // if (storedUser) {
    //   setUser(JSON.parse(storedUser));
    // }
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          // Optionally verify token with backend here
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const response: any = await Login(data);
    if (response) {
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      Cookies.set("user", JSON.stringify(response));
      const token = response.token;
      localStorage.setItem("accessToken", token);

      if (response.user.isAdmin) {
        router.push("/super");
      } else{
        if (response.user.type === "Customer") {
          router.push("/");
        } else if (response.user.type === "Driver") {
          router.push("/driver");
        } else if (response.user.type === "Restaurant") {
          router.push("/restaurant");
        } else {
          router.push("/login");
        }
      }

    }
  };

  const register = async (data: any) => {
    const response: any = await api.post(`/auth/register`, data);
    setUser(response.data);
    Cookies.set("user", JSON.stringify(response.data));
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
