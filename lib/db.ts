import { hash, compare } from "bcrypt"

// In a real app, you would use a database like Prisma, Supabase, etc.
// This is a simple in-memory database for demonstration purposes

export type User = {
  id: string
  name: string
  email: string
  password?: string
}

// In-memory user store
const users: Record<string, User> = {}

export async function createUser({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}): Promise<User> {
  // Check if user already exists
  if (Object.values(users).some((user) => user.email === email)) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await hash(password, 10)

  // Create user
  const id = Math.random().toString(36).substring(2, 15)

  const user: User = {
    id,
    name,
    email,
    password: hashedPassword,
  }

  // Save user
  users[id] = user

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  // Find user by email
  const user = Object.values(users).find((user) => user.email === email)

  if (!user || !user.password) {
    return null
  }

  // Verify password
  const isValid = await compare(password, user.password)

  if (!isValid) {
    return null
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function getUserById(id: string): Promise<User | null> {
  const user = users[id]

  if (!user) {
    return null
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
