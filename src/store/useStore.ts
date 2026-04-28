import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  fetchMe,
  loginRequest,
  patchProfile,
  registerRequest,
  fetchServicesList,
  fetchOrdersForUser,
  createOrderRequest,
  patchOrderStatus,
} from "../api";
import type { Order, OrderStatus, Service, User } from "../types/domain";

export type { Order, OrderStatus, Service, User } from "../types/domain";

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
          const me = await fetchMe(token);
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
          const result = await loginRequest(email, password);
          set({ token: result.token, currentUser: result.user });
          await get().refreshOrders();
          return { ok: true };
        } catch (e) {
          return { ok: false, message: (e as Error).message };
        }
      },

      register: async (name, email, phone, password) => {
        try {
          const result = await registerRequest(name, email, phone, password);
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
          const updatedUser = await patchProfile(token, data);
          set({ currentUser: updatedUser });
          return { ok: true };
        } catch (e) {
          return { ok: false, message: (e as Error).message };
        }
      },

      refreshServices: async () => {
        try {
          const services = await fetchServicesList();
          set({ services });
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
        const orders = await fetchOrdersForUser(token, currentUser.isAdmin);
        set({ orders });
      },

      createOrder: async (serviceId, _serviceName, _servicePrice, deviceDescription, bonusUsed) => {
        const token = get().token;
        if (!token) {
          return { ok: false, message: "Войдите в аккаунт" };
        }
        try {
          await createOrderRequest(token, { serviceId, deviceDescription, bonusUsed });
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
          await patchOrderStatus(token, orderId, status, comment);
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
