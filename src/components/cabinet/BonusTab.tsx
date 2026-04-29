import { TrendingUp } from "lucide-react";
import type { Order, User } from "../../types/domain";
import { LEVEL_CONFIG } from "./constants";
import { formatDate } from "./formatDate";

interface BonusTabProps {
  currentUser: User;
  userOrders: Order[];
}

export function BonusTab({ currentUser, userOrders }: BonusTabProps) {
  const levelCfg = LEVEL_CONFIG[currentUser.bonusLevel];
  const progressPct =
    currentUser.bonusLevel === "platinum"
      ? 100
      : Math.min((currentUser.totalSpent / levelCfg.threshold!) * 100, 100);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div
        className="rounded-2xl p-7 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="text-5xl mb-3">{levelCfg.icon}</div>
        <p className="text-xs text-white/25 uppercase tracking-wider mb-1">Ваш уровень</p>
        <p className="text-2xl font-extrabold text-white mb-5">{levelCfg.label}</p>
        <div
          className="inline-block rounded-2xl p-5 min-w-[180px]"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-xs text-white/25 mb-1">Баланс бонусов</p>
          <p className="text-4xl font-black text-white">{currentUser.bonusBalance}</p>
          <p className="text-xs text-white/20 mt-1">1 балл = 1 рубль скидки</p>
        </div>
      </div>

      {levelCfg.threshold && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
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

      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <h3 className="font-semibold text-white mb-5">Как работает программа</h3>
        <div className="space-y-4">
          {[
            { n: "1", t: "Оформите заказ", d: "Закажите любую услугу через сайт" },
            { n: "2", t: "Получайте бонусы", d: "5% от суммы зачисляется автоматически" },
            { n: "3", t: "Тратьте бонусы", d: "Списывайте до 30% от суммы бонусами" },
            { n: "4", t: "Растите по уровням", d: "🥈 Серебро → 🥇 Золото → 💎 Платина" },
          ].map((item) => (
            <div key={item.n} className="flex gap-4">
              <div
                className="w-7 h-7 rounded-full text-white text-xs font-bold
                  flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
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

      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
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
  );
}
