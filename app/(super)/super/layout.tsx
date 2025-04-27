import type React from "react"
import ClientLayout from "./client-layout"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClientLayout>{children}</ClientLayout>
      <Toaster />
    </>
  )
}


import './globals.css'

export const metadata = {
  title: "MealWhirl - Super",
};
