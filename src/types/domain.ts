/** Модель данных, согласованная с API бэкенда */

export type OrderStatus =
  | "pending"
  | "diagnostics"
  | "in_progress"
  | "ready"
  | "completed"
  | "cancelled";

export type BonusLevel = "silver" | "gold" | "platinum";

export interface Order {
  id: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deviceDescription: string;
  bonusUsed: number;
  bonusEarned: number;
  masterComment?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bonusBalance: number;
  bonusLevel: BonusLevel;
  totalSpent: number;
  registeredAt: string;
  isAdmin: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

/** Ответ API заказа до нормализации `serviceBasePrice` → `servicePrice` */
export interface OrderApiRow {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceBasePrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deviceDescription: string;
  bonusUsed: number;
  bonusEarned: number;
  masterComment: string | null;
}
