import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User, Gift, Package, Clock, CheckCircle, XCircle,
  Wrench, AlertCircle, ChevronRight, Settings, Edit2, Save, X,
  TrendingUp, Zap, ArrowRight, Shield,
} from "lucide-react";
import { useStore, Order, OrderStatus } from "../store/useStore";

interface CabinetPageProps {
  initialTab?: "orders" | "bonus" | "profile" | "admin";
}

/* ─── статусы ─── */
const STATUS_MAP: Record<OrderStatus, { label: string; icon: React.ElementType }> = {
  pending:     { label: "Принят",         icon: Clock },
  diagnostics: { label: "Диагностика",    icon: AlertCircle },
  in_progress: { label: "В работе",       icon: Wrench },
  ready:       { label: "Готов к выдаче", icon: CheckCircle },
  completed:   { label: "Выдан",          icon: CheckCircle },
  cancelled:   { label: "Отменён",        icon: XCircle },
};

const LEVEL_CONFIG = {
  silver:   { label: "Серебряный", icon: "🥈", threshold: 15000, nextLabel: "Золото" },
  gold:     { label: "Золотой",    icon: "🥇", threshold: 50000, nextLabel: "Платина" },
  platinum: { label: "Платиновый", icon: "💎", threshold: null,  nextLabel: null },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* ════════════════════════════════════════
   ADMIN PANEL
════════════════════════════════════════ */
function AdminPanel() {
  const { orders, updateOrderStatus } = useStore();
  const [selectedId, setSelectedId] = useState("");
  const [selStatus, setSelStatus]   = useState<OrderStatus>("pending");
  const [comment, setComment]       = useState("");

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
          onChange={(e) => setSelectedId(e.target.value)}
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
          onChange={(e) => setSelStatus(e.target.value as OrderStatus)}
          className="input-dark"
        >
          {(Object.keys(STATUS_MAP) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_MAP[s].label}</option>
          ))}
        </select>

        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарий мастера (опционально)"
          className="input-dark"
        />

        <button
          onClick={async () => {
            if (selectedId) {
              const result = await updateOrderStatus(selectedId, selStatus, comment || undefined);
              if (result.ok) {
                setComment("");
              }
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

/* ════════════════════════════════════════
   ORDER CARD
════════════════════════════════════════ */
function OrderCard({
  order, expanded, onToggle,
}: {
  order: Order; expanded: boolean; onToggle: () => void;
}) {
  const status     = STATUS_MAP[order.status];
  const StatusIcon = status.icon;

  const steps: OrderStatus[] = [
    "pending", "diagnostics", "in_progress", "ready", "completed",
  ];
  const currentStep = steps.indexOf(order.status);

  const dotColor: Record<OrderStatus, string> = {
    pending:     "bg-white/30",
    diagnostics: "bg-white/60",
    in_progress: "bg-yellow-400",
    ready:       "bg-green-400",
    completed:   "bg-white/40",
    cancelled:   "bg-red-400",
  };

  return (
    <div
      className="rounded-2xl border border-white/[0.08] overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
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
            <p className="font-bold text-white">
              {order.servicePrice.toLocaleString()} ₽
            </p>
            {order.bonusEarned > 0 && (
              <p className="text-xs text-green-400/70 mt-0.5">
                +{order.bonusEarned} бонусов
              </p>
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
          {/* Timeline */}
          {order.status !== "cancelled" && (
            <div>
              <p className="text-xs text-white/25 uppercase tracking-wider font-medium mb-4">
                Прогресс
              </p>
              <div className="flex items-center gap-1">
                {steps.map((step, i) => {
                  const isCompleted = i < currentStep;
                  const isCurrent   = i === currentStep;
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
                              ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
                              : {}
                          }
                        >
                          {isCompleted
                            ? <CheckCircle className="w-3.5 h-3.5" />
                            : i + 1}
                        </div>
                        <span className={`text-[9px] text-center leading-tight ${
                          isCurrent   ? "text-white font-semibold"
                          : isCompleted ? "text-white/40"
                          : "text-white/20"
                        }`}>
                          {STATUS_MAP[step].label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`h-px flex-1 mx-1 rounded ${
                          i < currentStep ? "bg-white/30" : "bg-white/[0.05]"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Номер заказа", value: order.id,          mono: true },
              { label: "Обновлён",     value: new Date(order.updatedAt).toLocaleDateString("ru-RU"), mono: false },
            ].map((d) => (
              <div
                key={d.label}
                className="rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
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
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[10px] text-white/25 mb-1">Бонусов списано</p>
                <p className="text-sm font-semibold text-white/50">−{order.bonusUsed}</p>
              </div>
            )}
            {order.bonusEarned > 0 && (
              <div
                className="rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[10px] text-white/25 mb-1">Бонусов начислено</p>
                <p className="text-sm font-semibold text-green-400/70">+{order.bonusEarned}</p>
              </div>
            )}
          </div>

          {order.masterComment && (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
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

/* ════════════════════════════════════════
   CABINET PAGE — MAIN
════════════════════════════════════════ */
export default function CabinetPage({ initialTab = "orders" }: CabinetPageProps) {
  const { currentUser, orders, openAuthModal, updateUser } = useStore();
  type TabId = "orders" | "bonus" | "profile" | "admin";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [editMode, setEditMode]   = useState(false);
  const [editForm, setEditForm]   = useState({ name: "", phone: "" });
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  /* ── не авторизован ── */
  if (!currentUser) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "#0a0a0f" }}
      >
        <div className="absolute inset-0 bg-grid opacity-40" style={{ background: "#0a0a0f" }} />
        <div
          className="relative rounded-3xl p-10 text-center w-full max-w-sm animate-scaleIn"
          style={{
            background: "rgba(15,15,25,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(40px)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <User className="w-8 h-8 text-white/40" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Войдите в аккаунт</h2>
          <p className="text-white/35 text-sm mb-8 leading-relaxed">
            Для доступа к личному кабинету необходима авторизация
          </p>
          <button
            onClick={() => openAuthModal("login")}
            className="btn-primary w-full justify-center py-3.5 mb-3"
          >
            Войти <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => openAuthModal("register")}
            className="btn-ghost w-full justify-center py-3"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    );
  }

  if (initialTab === "admin" && !currentUser.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0a0a0f" }}>
        <div
          className="relative rounded-3xl p-10 text-center w-full max-w-md animate-scaleIn"
          style={{
            background: "rgba(15,15,25,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(40px)",
          }}
        >
          <AlertCircle className="w-10 h-10 text-yellow-400/80 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Доступ запрещен</h2>
          <p className="text-white/35 text-sm mb-8 leading-relaxed">
            Эта страница доступна только администраторам.
          </p>
          <Link to="/cabinet" className="btn-primary w-full justify-center py-3.5">
            В личный кабинет <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  /* ── данные ── */
  const userOrders    = orders;
  const activeOrders  = userOrders.filter((o) => !["completed","cancelled"].includes(o.status));
  const historyOrders = userOrders.filter((o) =>  ["completed","cancelled"].includes(o.status));
  const levelCfg      = LEVEL_CONFIG[currentUser.bonusLevel];
  const progressPct   = currentUser.bonusLevel === "platinum"
    ? 100
    : Math.min((currentUser.totalSpent / levelCfg.threshold!) * 100, 100);

  const tabs: Array<{ id: TabId; label: string; icon: React.ElementType; badge?: number }> = [
    { id: "orders",  label: "Заказы",  icon: Package,  badge: activeOrders.length || undefined },
    { id: "bonus",   label: "Бонусы",  icon: Gift },
    { id: "profile", label: "Профиль", icon: User },
  ];
  if (currentUser.isAdmin) {
    tabs.push({ id: "admin", label: "Админ", icon: Settings });
  }

  /* ── рендер ── */
  return (
    /* ВАЖНО: весь контейнер с явным тёмным фоном через style */
    <div style={{ background: "#0a0a0f", minHeight: "100vh" }}>

      {/* ── шапка профиля ── */}
      <div style={{ background: "#080810", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-7">
            {/* аватар */}
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center
                  text-[#0a0a0f] text-2xl font-black"
                style={{ background: "#ffffff", boxShadow: "0 0 30px rgba(255,255,255,0.12)" }}
              >
                {currentUser.name.charAt(0)}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400"
                style={{ border: "2px solid #080810" }}
              />
            </div>
            {/* инфо */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
                <span className="badge text-xs">
                  {levelCfg.icon} {levelCfg.label}
                </span>
              </div>
              <p className="text-sm text-white/30">{currentUser.email}</p>
            </div>
          </div>

          {/* quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Бонусный баланс", value: currentUser.bonusBalance, suffix: "баллов" },
              { label: "Всего заказов",   value: userOrders.length,         suffix: "заказов" },
              { label: "Потрачено",       value: currentUser.totalSpent.toLocaleString(), suffix: "₽" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-2xl font-extrabold text-white mb-0.5">{s.value}</p>
                <p className="text-xs text-white/25">{s.suffix}</p>
                <p className="text-[10px] text-white/15 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── контент ── */}
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
        style={{ background: "#0a0a0f" }}
      >
        {/* табы */}
        <div
          className="flex gap-1 rounded-2xl p-1 mt-5 mb-6 overflow-x-auto"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5
                rounded-xl text-sm font-medium whitespace-nowrap transition-all relative"
              style={
                activeTab === tab.id
                  ? { background: "#ffffff", color: "#0a0a0f" }
                  : { color: "rgba(255,255,255,0.4)" }
              }
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {"badge" in tab && tab.badge ? (
                <span
                  className="absolute -top-1.5 -right-1 w-5 h-5 rounded-full text-[10px]
                    flex items-center justify-center font-bold"
                  style={
                    activeTab === tab.id
                      ? { background: "#0a0a0f", color: "#ffffff" }
                      : { background: "#ffffff", color: "#0a0a0f" }
                  }
                >
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ══ ЗАКАЗЫ ══ */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn">
            {activeOrders.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-white/40" />
                  <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Активные ({activeOrders.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {activeOrders.map((o) => (
                    <OrderCard
                      key={o.id} order={o}
                      expanded={expandedOrder === o.id}
                      onToggle={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {historyOrders.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-white/25" />
                  <h2 className="text-xs font-semibold text-white/25 uppercase tracking-wider">
                    История
                  </h2>
                </div>
                <div className="space-y-3">
                  {historyOrders.map((o) => (
                    <OrderCard
                      key={o.id} order={o}
                      expanded={expandedOrder === o.id}
                      onToggle={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {userOrders.length === 0 && (
              <div
                className="rounded-2xl py-20 text-center"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Package className="w-10 h-10 text-white/15 mx-auto mb-4" />
                <p className="text-white/30 font-medium mb-2">Пока нет заказов</p>
                <Link to="/services"
                  className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white transition-colors">
                  Перейти к услугам <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ══ БОНУСЫ ══ */}
        {activeTab === "bonus" && (
          <div className="space-y-4 animate-fadeIn">
            {/* уровень */}
            <div
              className="rounded-2xl p-7 text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="text-5xl mb-3">{levelCfg.icon}</div>
              <p className="text-xs text-white/25 uppercase tracking-wider mb-1">Ваш уровень</p>
              <p className="text-2xl font-extrabold text-white mb-5">{levelCfg.label}</p>
              <div
                className="inline-block rounded-2xl p-5 min-w-[180px]"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-xs text-white/25 mb-1">Баланс бонусов</p>
                <p className="text-4xl font-black text-white">{currentUser.bonusBalance}</p>
                <p className="text-xs text-white/20 mt-1">1 балл = 1 рубль скидки</p>
              </div>
            </div>

            {/* прогресс */}
            {levelCfg.threshold && (
              <div
                className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-white/40" />
                  <h3 className="font-semibold text-white">До уровня {levelCfg.nextLabel}</h3>
                </div>
                <div className="flex justify-between text-xs text-white/30 mb-2">
                  <span>{currentUser.totalSpent.toLocaleString()} ₽</span>
                  <span>Цель: {levelCfg.threshold.toLocaleString()} ₽</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
                <p className="text-xs text-white/20 mt-2">
                  Осталось {(levelCfg.threshold - currentUser.totalSpent).toLocaleString()} ₽
                </p>
              </div>
            )}

            {/* как работает */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h3 className="font-semibold text-white mb-5">Как работает программа</h3>
              <div className="space-y-4">
                {[
                  { n:"1", t:"Оформите заказ",    d:"Закажите любую услугу через сайт" },
                  { n:"2", t:"Получайте бонусы",   d:"5% от суммы зачисляется автоматически" },
                  { n:"3", t:"Тратьте бонусы",     d:"Списывайте до 30% от суммы бонусами" },
                  { n:"4", t:"Растите по уровням", d:"🥈 Серебро → 🥇 Золото → 💎 Платина" },
                ].map((item) => (
                  <div key={item.n} className="flex gap-4">
                    <div
                      className="w-7 h-7 rounded-full text-white text-xs font-bold
                        flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {item.n}
                    </div>
                    <div>
                      <p className="font-medium text-white/70 text-sm">{item.t}</p>
                      <p className="text-xs text-white/30 mt-0.5">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* история начислений */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h3 className="font-semibold text-white mb-5">История начислений</h3>
              <div className="space-y-1">
                {userOrders
                  .filter((o) => o.bonusEarned > 0 || o.bonusUsed > 0)
                  .map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between py-3"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <div>
                        <p className="text-sm text-white/60 font-medium">{o.serviceName}</p>
                        <p className="text-xs text-white/25">{formatDate(o.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        {o.bonusEarned > 0 && (
                          <p className="text-sm font-semibold text-green-400/70">+{o.bonusEarned}</p>
                        )}
                        {o.bonusUsed > 0 && (
                          <p className="text-sm font-semibold text-white/30">−{o.bonusUsed}</p>
                        )}
                      </div>
                    </div>
                  ))}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-white/60 font-medium">Приветственные бонусы</p>
                    <p className="text-xs text-white/25">При регистрации</p>
                  </div>
                  <p className="text-sm font-semibold text-green-400/70">+100</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ ПРОФИЛЬ ══ */}
        {activeTab === "profile" && (
          <div className="space-y-4 animate-fadeIn">
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white">Личные данные</h3>
                {!editMode ? (
                  <button
                    onClick={() => {
                      setEditForm({ name: currentUser.name, phone: currentUser.phone });
                      setEditMode(true);
                    }}
                    className="flex items-center gap-1.5 text-sm text-white/35 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Изменить
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        const result = await updateUser(editForm);
                        if (result.ok) {
                          setEditMode(false);
                        }
                      }}
                      className="flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Save className="w-4 h-4" /> Сохранить
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="text-white/25 hover:text-white/50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {[
                  { key:"name",         label:"Имя и фамилия",   editable:true,  val: editMode ? editForm.name  : currentUser.name  },
                  { key:"email",        label:"Email",           editable:false, val: currentUser.email },
                  { key:"phone",        label:"Телефон",         editable:true,  val: editMode ? editForm.phone : currentUser.phone },
                  { key:"registeredAt", label:"Дата регистрации",editable:false, val: formatDate(currentUser.registeredAt) },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs text-white/25 uppercase tracking-wider mb-1.5">
                      {f.label}
                    </label>
                    {editMode && f.editable ? (
                      <input
                        value={f.val}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        className="input-dark"
                      />
                    ) : (
                      <div
                        className="px-4 py-3 rounded-xl text-sm text-white/50"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        {f.val}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div
                className="mt-6 pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/25 uppercase tracking-wider mb-1">Уровень</p>
                    <p className="text-white font-semibold">
                      {levelCfg.icon} {levelCfg.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/25 mb-1">Бонусов</p>
                    <p className="text-white font-bold">{currentUser.bonusBalance}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-5 flex items-start gap-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <Shield className="w-5 h-5 text-white/25 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white/50 font-medium">Безопасность аккаунта</p>
                <p className="text-xs text-white/25 mt-0.5 leading-relaxed">
                  Ваши данные защищены. Никогда не передавайте пароль третьим лицам.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══ АДМИН ══ */}
        {activeTab === "admin" && currentUser.isAdmin && (
          <div className="space-y-4 animate-fadeIn">
            <div
              className="rounded-2xl p-4 flex items-start gap-3"
              style={{
                background: "rgba(234,179,8,0.06)",
                border: "1px solid rgba(234,179,8,0.15)",
              }}
            >
              <AlertCircle className="w-4 h-4 text-yellow-400/70 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-400/80 font-medium">Админ-панель</p>
                <p className="text-xs text-white/30 mt-0.5">
                  Обновление статусов заказов и контроль обработки заявок.
                </p>
              </div>
            </div>
            <AdminPanel />
          </div>
          
        )}
      </div>

      {/* ══ ФИКС БЕЛОГО НИЗА ══ */}
      <div style={{ background: "#0a0a0f", height: "120px" }} />
    </div>
  );
}