import { CheckCircle, ChevronRight } from "lucide-react";
import type { Order } from "../../types/domain";
import { STATUS_MAP } from "./constants";

export function OrderCard({
  order,
  expanded,
  onToggle,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
}) {
  const status = STATUS_MAP[order.status];
  const StatusIcon = status.icon;

  const steps: Array<typeof order.status> = [
    "pending",
    "diagnostics",
    "in_progress",
    "ready",
    "completed",
  ];
  const currentStep = steps.indexOf(order.status);

  const dotColor: Record<typeof order.status, string> = {
    pending: "bg-white/30",
    diagnostics: "bg-white/60",
    in_progress: "bg-yellow-400",
    ready: "bg-green-400",
    completed: "bg-white/40",
    cancelled: "bg-red-400",
  };

  return (
    <div
      className="rounded-2xl border border-white/[0.08] overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <StatusIcon className="w-5 h-5 text-white/50" />
            </div>
            <div>
              <p className="font-semibold text-white">{order.serviceName}</p>
              <p className="text-sm text-white/35 mt-0.5">{order.deviceDescription}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-1.5 h-1.5 rounded-full ${dotColor[order.status]}`} />
                <span className="text-xs text-white/40">{status.label}</span>
                <span className="text-white/15">·</span>
                <span className="text-xs text-white/25">
                  {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-white">{order.servicePrice.toLocaleString()} ₽</p>
            {order.bonusEarned > 0 && (
              <p className="text-xs text-green-400/70 mt-0.5">+{order.bonusEarned} бонусов</p>
            )}
            <ChevronRight
              className={`w-4 h-4 text-white/20 mt-1 ml-auto transition-transform duration-300
                ${expanded ? "rotate-90" : ""}`}
            />
          </div>
        </div>
      </button>

      {expanded && (
        <div
          className="border-t border-white/[0.05] px-5 pb-5 pt-4 space-y-4"
          style={{ background: "rgba(0,0,0,0.15)" }}
        >
          {order.status !== "cancelled" && (
            <div>
              <p className="text-xs text-white/25 uppercase tracking-wider font-medium mb-4">
                Прогресс
              </p>
              <div className="flex items-center gap-1">
                {steps.map((step, i) => {
                  const isCompleted = i < currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex-1 flex flex-col items-center gap-1.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center
                            text-xs font-bold transition-all ${
                              isCurrent
                                ? "bg-white text-[#0a0a0f] shadow-[0_0_12px_rgba(255,255,255,0.25)]"
                                : isCompleted
                                  ? "bg-white/20 text-white/70"
                                  : "text-white/20"
                            }`}
                          style={
                            !isCurrent && !isCompleted
                              ? {
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                }
                              : {}
                          }
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-3.5 h-3.5" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span
                          className={`text-[9px] text-center leading-tight ${
                            isCurrent
                              ? "text-white font-semibold"
                              : isCompleted
                                ? "text-white/40"
                                : "text-white/20"
                          }`}
                        >
                          {STATUS_MAP[step].label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className={`h-px flex-1 mx-1 rounded ${
                            i < currentStep ? "bg-white/30" : "bg-white/[0.05]"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Номер заказа", value: order.id, mono: true },
              {
                label: "Обновлён",
                value: new Date(order.updatedAt).toLocaleDateString("ru-RU"),
                mono: false,
              },
            ].map((d) => (
              <div
                key={d.label}
                className="rounded-xl p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-[10px] text-white/25 mb-1">{d.label}</p>
                <p className={`text-xs text-white/50 ${d.mono ? "font-mono truncate" : ""}`}>
                  {d.value}
                </p>
              </div>
            ))}
            {order.bonusUsed > 0 && (
              <div
                className="rounded-xl p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-[10px] text-white/25 mb-1">Бонусов списано</p>
                <p className="text-sm font-semibold text-white/50">−{order.bonusUsed}</p>
              </div>
            )}
            {order.bonusEarned > 0 && (
              <div
                className="rounded-xl p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-[10px] text-white/25 mb-1">Бонусов начислено</p>
                <p className="text-sm font-semibold text-green-400/70">+{order.bonusEarned}</p>
              </div>
            )}
          </div>

          {order.masterComment && (
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium mb-2">
                💬 Комментарий мастера
              </p>
              <p className="text-sm text-white/50 leading-relaxed">{order.masterComment}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
