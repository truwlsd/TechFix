import type { Service } from "../types/domain";
import { apiFetch } from "./http";

export async function fetchServicesList(): Promise<Service[]> {
  const result = (await apiFetch("/services")) as Array<{
    id: string;
    name: string;
    price: number;
  }>;
  return result.map((s) => ({ id: s.id, name: s.name, price: s.price }));
}
