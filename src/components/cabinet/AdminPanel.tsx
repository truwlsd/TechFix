import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useStore } from "../../store/useStore";
import type { OrderStatus } from "../../types/domain";
import { STATUS_MAP } from "./constants";

export function AdminPanel() {
  const { orders, updateOrderStatus } = useStore();
  const [selectedId, setSelectedId] = useState("");
  const [selStatus, setSelStatus] = useState<OrderStatus>("pending");
  const [comment, setComment] = useState("");
  const [adminError, setAdminError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    const currentOrder = orders.find((o) => o.id === selectedId);
    if (!currentOrder) return;
    setSelStatus(currentOrder.status);
  }, [selectedId, orders]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const query = search.toLowerCase().trim();
    return (
      order.id.toLowerCase().includes(query) ||
      order.serviceName.toLowerCase().includes(query) ||
      order.deviceDescription.toLowerCase().includes(query)
    );
  });

  const selectedOrder = orders.find((o) => o.id === selectedId);

  const statusesForStats: OrderStatus[] = ["pending", "diagnostics", "in_progress", "ready", "completed", "cancelled"];
  const quickStats = statusesForStats.map((status) => ({
    status,
    label: STATUS_MAP[status].label,
    count: orders.filter((o) => o.status === status).length,
  }));

  return (
    <div
      className="rounded-2xl p-6 border border-white/[0.08]"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <p className="text-sm text-green-400 font-medium">
          Панель администратора — управление заказами
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {quickStats.map((item) => (
          <div
            key={item.status}
            className="rounded-xl px-3 py-2 border border-white/[0.08] bg-white/[0.02]"
          >
            <p className="text-[10px] text-white/35">{item.label}</p>
            <p className="text-sm font-semibold text-white">{item.count}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | OrderStatus)}
          className="input-dark"
        >
          <option value="all">Все статусы</option>
          {(Object.keys(STATUS_MAP) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_MAP[s].label}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск: ID, услуга, устройство"
          className="input-dark"
        />
      </div>

      <div className="space-y-3">
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setAdminError("");
          }}
          className="input-dark"
        >
          <option value="">Выберите заказ</option>
          {filteredOrders.map((o) => (
            <option key={o.id} value={o.id}>
              {o.id} — {o.serviceName} ({STATUS_MAP[o.status].label})
            </option>
          ))}
        </select>

        {filteredOrders.length === 0 && (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-white/40">
            По текущим фильтрам заказы не найдены.
          </div>
        )}

        {selectedOrder && (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
            <p className="text-xs text-white/30 mb-1">Выбранный заказ</p>
            <p className="text-sm font-medium text-white">{selectedOrder.serviceName}</p>
            <p className="text-xs text-white/40 mt-0.5">{selectedOrder.deviceDescription}</p>
            <p className="text-xs text-white/30 mt-1">
              Текущий статус: {STATUS_MAP[selectedOrder.status].label}
            </p>
          </div>
        )}

        <select
          value={selStatus}
          onChange={(e) => {
            setSelStatus(e.target.value as OrderStatus);
            setAdminError("");
          }}
          className="input-dark"
        >
          {(Object.keys(STATUS_MAP) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_MAP[s].label}
            </option>
          ))}
        </select>

        <input
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setAdminError("");
          }}
          placeholder="Комментарий мастера (опционально)"
          maxLength={250}
          className="input-dark"
        />

        {adminError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-400">
            {adminError}
          </div>
        )}
        {toast && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              toast.type === "success"
                ? "border border-emerald-500/25 bg-emerald-500/[0.10] text-emerald-300"
                : "border border-red-500/20 bg-red-500/[0.08] text-red-400"
            }`}
          >
            {toast.message}
          </div>
        )}

        <button
          type="button"
          onClick={async () => {
            if (!selectedId) {
              setAdminError("Выберите заказ для обновления");
              return;
            }
            if (comment.trim().length > 250) {
              setAdminError("Комментарий слишком длинный (максимум 250 символов)");
              return;
            }

            setIsSubmitting(true);
            const result = await updateOrderStatus(selectedId, selStatus, comment.trim() || undefined);
            setIsSubmitting(false);

            if (!result.ok) {
              const message = result.message || "Не удалось обновить статус";
              setAdminError(message);
              setToast({ type: "error", message });
              return;
            }

            setComment("");
            setAdminError("");
            setToast({ type: "success", message: "Статус заказа успешно обновлен" });
          }}
          disabled={!selectedId || isSubmitting}
          className="btn-primary w-full justify-center py-3 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Сохраняем..." : "Обновить статус"}{" "}
          <ArrowRight className={`w-4 h-4 ${isSubmitting ? "animate-pulse" : ""}`} />
        </button>
      </div>
    </div>
  );
}
