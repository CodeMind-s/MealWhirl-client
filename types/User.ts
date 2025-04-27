export type UserRole = "customer" | "driver" | "restaurant" | "admin";

export interface User {
  identifier: string;
  type: string;
  role: UserRole;
  token: string;
}