import type { Order, OrderApiRow, OrderStatus } from "../types/domain";
import { apiFetch } from "./http";

export function mapOrderFromApi(raw: OrderApiRow): Order {
  return {
    id: raw.id,
    serviceId: raw.serviceId,
    serviceName: raw.serviceName,
    servicePrice: raw.serviceBasePrice,
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    deviceDescription: raw.deviceDescription,
    bonusUsed: raw.bonusUsed,
    bonusEarned: raw.bonusEarned,
    masterComment: raw.masterComment ?? undefined,
  };
}

export async function fetchOrdersForUser(
  token: string,
  isAdmin: boolean
): Promise<Order[]> {
  const path = isAdmin ? "/admin/orders" : "/orders/my";
  const result = (await apiFetch(path, {}, token)) as OrderApiRow[];
  return result.map(mapOrderFromApi);
}

export async function patchOrderStatus(
  token: string,
  orderId: string,
  status: OrderStatus,
  comment?: string
): Promise<void> {
  await apiFetch(
    `/admin/orders/${orderId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status, comment }),
    },
    token
  );
}

export async function createOrderRequest(
  token: string,
  body: { serviceId: string; deviceDescription: string; bonusUsed: number }
): Promise<void> {
  await apiFetch(
    "/orders",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    token
  );
}
