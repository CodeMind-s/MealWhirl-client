"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

// Define user types
export type UserRole = "customer" | "driver" | "restaurant" | "admin"

export interface User {
  email: string
  name: string
  role: UserRole
}

// Define auth context type
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (
    name: string,
    email: string,
    password: string,
    role: "customer" | "restaurant",
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded user credentials for frontend development
const USERS = [
  {
    email: "cust.test@mail.com",
    password: "cust123",
    name: "Test Customer",
    role: "customer" as UserRole,
  },
  {
    email: "driver.test@mail.com",
    password: "driver123",
    name: "Test Driver",
    role: "driver" as UserRole,
  },
  {
    email: "rest.test@mail.com",
    password: "rest123",
    name: "Test Restaurant",
    role: "restaurant" as UserRole,
  },
  {
    email: "admin.test@mail.com",
    password: "admin123",
    name: "System Admin",
    role: "admin" as UserRole,
  },
]

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState(USERS)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = Cookies.get("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)

      // Store in cookies for middleware access
      Cookies.set("user", JSON.stringify(userWithoutPassword), { expires: 7 })

      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }

  // Register function
  const register = async (name: string, email: string, password: string, role: "customer" | "restaurant") => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email already exists" }
    }

    // Create new user
    const newUser = {
      email,
      password,
      name,
      role,
    }

    // Add to users array
    setUsers((prev) => [...prev, newUser])

    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)

    // Store in cookies for middleware access
    Cookies.set("user", JSON.stringify(userWithoutPassword), { expires: 7 })

    return { success: true }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    Cookies.remove("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper function to get route based on user role
export function getRouteForRole(role: UserRole): string {
  switch (role) {
    case "customer":
      return "/profile"
    case "driver":
      return "/driver"
    case "restaurant":
      return "/restaurant"
    case "admin":
      return "/super"
    default:
      return "/login"
  }
}
