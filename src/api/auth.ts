import type { User } from "../types/domain";
import { apiFetch } from "./http";

export async function loginRequest(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }) as Promise<{ token: string; user: User }>;
}

export async function registerRequest(
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<{ token: string; user: User }> {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, phone, password }),
  }) as Promise<{ token: string; user: User }>;
}

export async function fetchMe(token: string): Promise<User> {
  return apiFetch("/auth/me", {}, token) as Promise<User>;
}

export async function patchProfile(
  token: string,
  data: Pick<User, "name" | "phone">
): Promise<User> {
  return apiFetch(
    "/auth/me",
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    token
  ) as Promise<User>;
}
