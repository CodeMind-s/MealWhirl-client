"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await login(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            disabled={isLoading}
            className="rounded-xl border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <Link href="/forgot-password" className="text-sm text-brand-blue hover:text-brand-purple transition-colors">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={isLoading}
            className="rounded-xl border-gray-300 focus:border-brand-blue focus:ring-brand-blue"
          />
        </div>
        <Button
          type="submit"
          className="w-full py-6 rounded-xl bg-brand-blue hover:bg-brand-purple transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Sign in"}
        </Button>
        <div className="mt-4">
          <details className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
            <summary className="cursor-pointer font-medium">Available test accounts</summary>
            <div className="mt-2 space-y-2 pl-4">
              <p>
                <strong>Customer:</strong> cust.test@mail.com / cust123
              </p>
              <p>
                <strong>Driver:</strong> driver.test@mail.com / driver123
              </p>
              <p>
                <strong>Restaurant:</strong> rest.test@mail.com / rest123
              </p>
              <p>
                <strong>Admin:</strong> admin.test@mail.com / admin123
              </p>
            </div>
          </details>
        </div>
      </form>
    </>
  )
}
