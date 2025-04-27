// driver login page
"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/driver/theme-provider"
import { OrdersProvider } from "@/contexts/orders-context"
import { AuthProvider } from "@/contexts/auth-context"
import Dashboard from "@/pages/driver/Dashboard"
import Login from "@/pages/driver/Login"
import { useAuth } from "@/hooks/use-auth"


export default function page() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <OrdersProvider>
                    <AppContent />
                </OrdersProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

function AppContent() {
    const { isAuthenticated, isLoading } = useAuth()
    const [currentPage, setCurrentPage] = useState<"login" | "dashboard">("login")

    // Check authentication status when component mounts
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            setCurrentPage("dashboard")
        } else if (!isLoading) {
            setCurrentPage("login")
        }
    }, [isAuthenticated, isLoading])

    // Show loading indicator while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (currentPage === "login") {
        return <Login onLoginSuccess={() => setCurrentPage("dashboard")} />
    }

    return <Dashboard onLogout={() => setCurrentPage("login")} />
}

