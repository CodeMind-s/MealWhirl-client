"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Mock driver and restaurant data for demonstration
const MOCK_DRIVERS = [
  {
    id: "driver1",
    email: "driver@example.com",
    password: "password123",
    name: "John Driver",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "(555) 123-4567",
  },
  {
    id: "driver2",
    email: "test@example.com",
    password: "test123",
    name: "Test Driver",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "(555) 987-6543",
  },
]

const MOCK_RESTAURANTS = [
  {
    id: "restaurant1",
    email: "qwe@mail.com",
    password: "qwe123",
    name: "Gourmet Kitchen",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "(555) 111-2222",
  },
  {
    id: "restaurant2",
    email: "bistro@example.com",
    password: "bistro123",
    name: "Cozy Bistro",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "(555) 333-4444",
  },
]

type User = {
  id: string
  email: string
  name: string
  avatar: string
  phone: string
}

interface AuthContextType {
  driver: User | null
  restaurant: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string, userType: "driver" | "restaurant") => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [driver, setDriver] = useState<User | null>(null)
  const [restaurant, setRestaurant] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const storedDriver = localStorage.getItem("driver")
        const storedRestaurant = localStorage.getItem("restaurant")

        if (storedDriver) {
          setDriver(JSON.parse(storedDriver))
        } else if (storedRestaurant) {
          setRestaurant(JSON.parse(storedRestaurant))
        }
      } catch (e) {
        console.error("Error checking authentication:", e)
        localStorage.clear()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string, userType: "driver" | "restaurant"): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (userType === "driver") {
        const foundDriver = MOCK_DRIVERS.find((d) => d.email === email && d.password === password)
        if (!foundDriver) throw new Error("Invalid email or password")
        const { password: _, ...driverData } = foundDriver
        setDriver(driverData)
        localStorage.setItem("driver", JSON.stringify(driverData))
      } else if (userType === "restaurant") {
        const foundRestaurant = MOCK_RESTAURANTS.find((r) => r.email === email && r.password === password)
        if (!foundRestaurant) throw new Error("Invalid email or password")
        const { password: _, ...restaurantData } = foundRestaurant
        setRestaurant(restaurantData)
        localStorage.setItem("restaurant", JSON.stringify(restaurantData))
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setDriver(null)
    setRestaurant(null)
    localStorage.clear()
  }

  return (
    <AuthContext.Provider
      value={{
        driver,
        restaurant,
        isAuthenticated: !!driver || !!restaurant,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
