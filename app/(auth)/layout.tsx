import type React from "react"
// import { Inter } from "next/font/google"
// import { ThemeProvider } from "@/components/theme-provider"
// import { Toaster } from "@/components/ui/toaster"
// import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "MealWhirl - Auth",
//   description: "A Next.js application with multi-user authentication",
//   generator: 'v0.dev'
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <html lang="en" suppressHydrationWarning>
    //   <body className={inter.className}>
    //     <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
    //       <AuthProvider>
    //         {children}
    //         <Toaster />
    //       </AuthProvider>
    //     </ThemeProvider>
    //   </body>
    // </html>
    // <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {children}
      </div>
    // {/* </div> */}
  )
}
