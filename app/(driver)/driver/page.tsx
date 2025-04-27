// driver login page
"use client"

import { ThemeProvider } from "@/components/driver/theme-provider"
import { OrdersProvider } from "@/contexts/orders-context"
import { AuthProvider } from "@/contexts/auth-context"
import Dashboard from "@/pages/driver/Dashboard"



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
    return <Dashboard />
}

