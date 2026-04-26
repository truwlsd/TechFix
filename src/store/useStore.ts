import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderStatus =
  | "pending"
  | "diagnostics"
  | "in_progress"
  | "ready"
  | "completed"
  | "cancelled";

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
  bonusLevel: "silver" | "gold" | "platinum";
  totalSpent: number;
  registeredAt: string;
  isAdmin: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

interface Store {
  currentUser: User | null;
  token: string | null;
  orders: Order[];
  services: Service[];
  isBootstrapping: boolean;

  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<{ ok: boolean; message?: string }>;
  bootstrapSession: () => Promise<void>;
  logout: () => void;
  updateUser: (data: Pick<User, "name" | "phone">) => Promise<{ ok: boolean; message?: string }>;

  createOrder: (
    serviceId: string,
    serviceName: string,
    servicePrice: number,
    deviceDescription: string,
    bonusUsed: number
  ) => Promise<{ ok: boolean; message?: string }>;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    comment?: string
  ) => Promise<{ ok: boolean; message?: string }>;
  refreshOrders: () => Promise<void>;
  refreshServices: () => Promise<void>;

  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;

  isOrderModalOpen: boolean;
  orderModalService: Service | null;
  openOrderModal: (service: Service) => void;
  closeOrderModal: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function toOrder(raw: {
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
}): Order {
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

async function apiFetch(path: string, init: RequestInit = {}, token?: string | null) {
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

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,
      orders: [],
      services: [],
      isBootstrapping: false,

      isAuthModalOpen: false,
      authModalMode: "login",
      isOrderModalOpen: false,
      orderModalService: null,

      bootstrapSession: async () => {
        const token = get().token;
        if (!token) return;

        set({ isBootstrapping: true });
        try {
          const me = (await apiFetch("/auth/me", {}, token)) as User;
          set({ currentUser: me });
          await get().refreshServices();
          await get().refreshOrders();
        } catch {
          set({ token: null, currentUser: null, orders: [] });
        } finally {
          set({ isBootstrapping: false });
        }
      },

      login: async (email, password) => {
        try {
          const result = (await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          })) as { token: string; user: User };
          set({ token: result.token, currentUser: result.user });
          await get().refreshOrders();
          return { ok: true };
        } catch (e) {
          return { ok: false, message: (e as Error).message };
        }
      },

      register: async (name, email, phone, password) => {
        try {
          const result = (await apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, phone, password }),
          })) as { token: string; user: User };
          set({ token: result.token, currentUser: result.user });
          await get().refreshOrders();
          return { ok: true };
        } catch (e) {
          return { ok: false, message: (e as Error).message };
        }
      },

      logout: () => set({ currentUser: null, token: null, orders: [] }),

      updateUser: async (data) => {
        const token = get().token;
        if (!token) {
          return { ok: false, message: "Не авторизован" };
        }
        try {
          const updatedUser = (await apiFetch(
            "/auth/me",
            {
              method: "PATCH",
              body: JSON.stringify(data),
            },
            token
          )) as User;
          set({ currentUser: updatedUser });
          return { ok: true };
        } catch (e) {
          return { ok: false, message: (e as Error).message };
        }
      },

      refreshServices: async () => {
        try {
          const result = (await apiFetch("/services")) as Array<{
            id: string;
            name: string;
            price: number;
          }>;
          set({ services: result.map((s) => ({ id: s.id, name: s.name, price: s.price })) });
        } catch {
          set({ services: ALL_SERVICES });
        }
      },

      refreshOrders: async () => {
        const token = get().token;
        const currentUser = get().currentUser;
        if (!token || !currentUser) {
          set({ orders: [] });
          return;
        }
        const path = currentUser.isAdmin ? "/admin/orders" : "/orders/my";
        const result = (await apiFetch(path, {}, token)) as Array<{
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
        }>;
        set({ orders: result.map(toOrder) });
      },

      createOrder: async (serviceId, _serviceName, _servicePrice, deviceDescription, bonusUsed) => {
        const token = get().token;
        if (!token) {
          return { ok: false, message: "Войдите в аккаунт" };
        }
        try {
          await apiFetch(
            "/orders",
            {
              method: "POST",
              body: JSON.stringify({ serviceId, deviceDescription, bonusUsed }),
            },
            token
          );
          await get().bootstrapSession();
          return { ok: true };
        } catch (e) {
          return { ok: false, message: (e as Error).message };
        }
      },

      updateOrderStatus: async (orderId, status, comment) => {
        const token = get().token;
        if (!token) {
          return { ok: false, message: "Не авторизован" };
        }
        try {
          await apiFetch(
            `/admin/orders/${orderId}/status`,
            {
              method: "PATCH",
              body: JSON.stringify({ status, comment }),
            },
            token
          );
          await get().bootstrapSession();
          return { ok: true };
        } catch (e) {
          return { ok: false, message: (e as Error).message };
        }
      },

      openAuthModal: (mode = "login") => set({ isAuthModalOpen: true, authModalMode: mode }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      openOrderModal: (service) => set({ isOrderModalOpen: true, orderModalService: service }),
      closeOrderModal: () => set({ isOrderModalOpen: false, orderModalService: null }),
    }),
    {
      name: "techfix-storage",
      partialize: (s) => ({
        token: s.token,
      }),
    }
  )
);

export const ALL_SERVICES: Service[] = [
  { id: "laptop-repair", name: "Ремонт ноутбука", price: 1500 },
  { id: "screen-replacement", name: "Замена экрана", price: 3500 },
  { id: "keyboard-replace", name: "Замена клавиатуры", price: 1800 },
  { id: "battery-replace", name: "Замена аккумулятора", price: 2200 },
  { id: "pc-diagnostics", name: "Диагностика ПК", price: 500 },
  { id: "pc-clean", name: "Чистка от пыли", price: 900 },
  { id: "pc-upgrade", name: "Апгрейд компьютера", price: 1000 },
  { id: "os-install", name: "Установка Windows", price: 1500 },
  { id: "virus-removal", name: "Удаление вирусов", price: 1200 },
  { id: "speed-up", name: "Ускорение ПК", price: 900 },
  { id: "wifi-setup", name: "Настройка Wi-Fi", price: 700 },
  { id: "data-recovery", name: "Восстановление данных", price: 2500 },
  { id: "camera-repair", name: "Ремонт веб-камеры", price: 1200 },
];