import ProtectedRoute from '@/components/ProtectedRoute';
import './globals.css'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ProtectedRoute allowedRoles={["Driver"]}>
            {children}
        </ProtectedRoute>
        
    )
}

export const metadata = {
    title: "MealWhirl - Driver",
};
