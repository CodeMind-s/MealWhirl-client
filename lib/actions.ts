"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUser, validateUser } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  try {
    const user = await createUser({ name, email, password });

    if (!user) {
      return { error: "Failed to create user" };
    }

    // Create session
    await createSession(user);

    return { success: true };
  } catch (error: any) {
    if (error.message === "User already exists") {
      return { error: "Email already in use" };
    }

    return { error: "Something went wrong" };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await validateUser(email, password);

    if (!user) {
      return { error: "Invalid email or password" };
    }

    // Create session
    await createSession(user);

    return { success: true };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}
