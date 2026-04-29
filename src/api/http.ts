export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  token?: string | null
): Promise<unknown> {
  const headers = new Headers(init.headers ?? {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const data = (await res.json().catch(() => null)) as { message?: string } | null;
  if (!res.ok) {
    throw new Error(data?.message || "Ошибка API");
  }
  return data;
}
