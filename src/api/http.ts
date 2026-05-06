export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const API_TIMEOUT_MS = 15000;

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

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as { message?: string } | null;
    if (!res.ok) {
      throw new Error(data?.message || "Ошибка API");
    }
    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Сервер не отвечает. Проверьте адрес API и повторите попытку.");
    }
    throw error instanceof Error ? error : new Error("Ошибка сети");
  } finally {
    window.clearTimeout(timeoutId);
  }
}
