import { useState } from "react";
import {
  User, Gift, Package, Settings,
  AlertCircle,
} from "lucide-react";
import { FooterSection } from "../../features/home/sections";
import { useStore } from "../../store/useStore";
import styles from "./CabinetPage.module.css";
import {
  AdminAccessDenied,
  AdminPanel,
  BonusTab,
  CabinetGuestScreen,
  OrdersTab,
  ProfileTab,
  LEVEL_CONFIG,
} from "../../components/cabinet";

interface CabinetPageProps {
  initialTab?: "orders" | "bonus" | "profile" | "admin";
}

type TabId = "orders" | "bonus" | "profile" | "admin";

export default function CabinetPage({ initialTab = "orders" }: CabinetPageProps) {
  const { currentUser, orders } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!currentUser) {
    return <CabinetGuestScreen />;
  }

  if (initialTab === "admin" && !currentUser.isAdmin) {
    return <AdminAccessDenied />;
  }

  const userOrders = orders;
  const activeOrdersCount = userOrders.filter((o) =>
    !["completed", "cancelled"].includes(o.status)
  ).length;

  const levelCfg = LEVEL_CONFIG[currentUser.bonusLevel];

  const tabs: Array<{ id: TabId; label: string; icon: typeof Package; badge?: number }> = [
    { id: "orders", label: "Заказы", icon: Package, badge: activeOrdersCount || undefined },
    { id: "bonus", label: "Бонусы", icon: Gift },
    { id: "profile", label: "Профиль", icon: User },
  ];
  if (currentUser.isAdmin) {
    tabs.push({ id: "admin", label: "Админ", icon: Settings });
  }

  return (
    <div className={styles.pageRoot}>
      <div className={styles.profileHead}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-7">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center
                  text-[#0a0a0f] text-2xl font-black ${styles.avatarGlow}`}
              >
                {currentUser.name.charAt(0)}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 ${styles.statusRingBorder}`}
              />
            </div>
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

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Бонусный баланс", value: currentUser.bonusBalance, suffix: "баллов" },
              { label: "Всего заказов", value: userOrders.length, suffix: "заказов" },
              {
                label: "Потрачено",
                value: currentUser.totalSpent.toLocaleString(),
                suffix: "₽",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-2xl font-extrabold text-white mb-0.5">{s.value}</p>
                <p className="text-xs text-white/25">{s.suffix}</p>
                <p className="text-[10px] text-white/15 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
        style={{ background: "#0a0a0f" }}
      >
        <div
          className="flex gap-1 rounded-2xl p-1 mt-5 mb-6 overflow-x-auto"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
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

        {activeTab === "orders" && (
          <OrdersTab
            userOrders={userOrders}
            expandedOrderId={expandedOrder}
            onToggleOrder={setExpandedOrder}
          />
        )}

        {activeTab === "bonus" && (
          <BonusTab currentUser={currentUser} userOrders={userOrders} />
        )}

        {activeTab === "profile" && <ProfileTab currentUser={currentUser} />}

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

      <FooterSection />
    </div>
  );
}
