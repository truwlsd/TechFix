import { useState } from "react";
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
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              {o.id} — {o.serviceName} ({STATUS_MAP[o.status].label})
            </option>
          ))}
        </select>

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

            const result = await updateOrderStatus(
              selectedId,
              selStatus,
              comment.trim() || undefined
            );
            if (result.ok) {
              setComment("");
              setAdminError("");
            } else {
              setAdminError(result.message || "Не удалось обновить статус");
            }
          }}
          disabled={!selectedId}
          className="btn-primary w-full justify-center py-3 disabled:opacity-30"
        >
          Обновить статус <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
