import { parse, serialize } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_please_change_in_production"
);

export async function createSession(user: User, res: NextApiResponse) {
  // Remove sensitive data
  const sessionData = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const session = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  res.setHeader(
    "Set-Cookie",
    serialize("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })
  );

  return session;
}

export async function getUserFromCookie(req: NextApiRequest) {
  const cookies = parse(req.headers.cookie || "");
  const session = cookies["session"];

  if (!session) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(session, secretKey);
    return payload as User;
  } catch (error) {
    return null;
  }
}
