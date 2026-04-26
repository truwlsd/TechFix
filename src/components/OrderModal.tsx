import { useState } from "react";
import { X, Wrench, Gift, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useStore } from "../store/useStore";

interface Service {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
}

interface Props {
  service: Service | null;
  onClose: () => void;
}

export default function OrderModal({ service, onClose }: Props) {
  const { currentUser, createOrder, openAuthModal } = useStore();
  const [deviceDescription, setDeviceDescription] = useState("");
  const [bonusUsed, setBonusUsed] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!service) return null;

  const maxBonus = Math.min(
    currentUser?.bonusBalance ?? 0,
    Math.floor(service.price * 0.3)
  );
  const finalPrice = service.price - bonusUsed;
  const bonusEarned = Math.floor(finalPrice * 0.05);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onClose();
      openAuthModal("login");
      return;
    }
    if (!deviceDescription.trim()) {
      setError("Опишите вашу проблему или устройство");
      return;
    }
    const result = await createOrder(
      service.id,
      service.name,
      service.price,
      deviceDescription,
      bonusUsed
    );
    if (!result.ok) {
      setError(result.message || "Не удалось оформить заказ");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/50 hover:text-white transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Success State ── */}
        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white/70" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Заказ принят!
            </h3>
            <p className="text-white/40 mb-6 leading-relaxed">
              Мы свяжемся с вами в течение 30 минут для уточнения деталей.
            </p>

            <div className="glass rounded-2xl px-5 py-4 mb-8 flex items-center gap-3">
              <Gift className="w-5 h-5 text-white/40 flex-shrink-0" />
              <p className="text-sm text-white/50">
                <span className="text-white font-semibold">
                  +{bonusEarned} бонусов
                </span>{" "}
                будет начислено после выполнения заказа
              </p>
            </div>

            <button onClick={onClose} className="btn-primary w-full justify-center py-3.5">
              Отлично!
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center">
                  <Wrench className="w-3.5 h-3.5 text-white/60" />
                </div>
                <span className="text-xs text-white/30 uppercase tracking-wider font-medium">
                  Оформление заказа
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{service.name}</h3>
              <p className="text-sm text-white/30 mt-1">от {service.priceLabel}</p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
              {/* Device description */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                  Описание проблемы / устройство *
                </label>
                <textarea
                  value={deviceDescription}
                  onChange={(e) => {
                    setDeviceDescription(e.target.value);
                    setError("");
                  }}
                  placeholder="Например: MacBook Pro 2020 — не заряжается, вылетает из розетки"
                  rows={3}
                  className="input-dark resize-none"
                />
              </div>

              {/* Bonus slider */}
              {currentUser && currentUser.bonusBalance > 0 && (
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white/60 font-medium">
                        Бонусы
                      </span>
                    </div>
                    <span className="text-xs text-white/30">
                      Доступно: {currentUser.bonusBalance}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={maxBonus}
                    value={bonusUsed}
                    onChange={(e) => setBonusUsed(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.6) ${
                        maxBonus > 0 ? (bonusUsed / maxBonus) * 100 : 0
                      }%, rgba(255,255,255,0.08) ${
                        maxBonus > 0 ? (bonusUsed / maxBonus) * 100 : 0
                      }%, rgba(255,255,255,0.08) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-white/25">0</span>
                    {bonusUsed > 0 && (
                      <span className="text-white/60 font-medium">
                        −{bonusUsed} баллов
                      </span>
                    )}
                    <span className="text-white/25">
                      {maxBonus} (макс. 30%)
                    </span>
                  </div>
                </div>
              )}

              {/* Price summary */}
              <div className="glass rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Стоимость услуги</span>
                  <span className="text-white/60">от {service.priceLabel}</span>
                </div>
                {bonusUsed > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Скидка бонусами</span>
                    <span className="text-white/60">−{bonusUsed} ₽</span>
                  </div>
                )}
                <div className="h-px bg-white/[0.06]" />
                <div className="flex justify-between">
                  <span className="font-semibold text-white">Итого от</span>
                  <span className="font-bold text-white">
                    {finalPrice.toLocaleString()} ₽
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Начислим бонусов</span>
                  <span className="text-green-400/70">+{bonusEarned} баллов</span>
                </div>
              </div>

              {/* Auth hint */}
              {!currentUser && (
                <div className="flex items-start gap-3 glass rounded-xl p-3.5">
                  <AlertCircle className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-white/40">
                    Войдите в аккаунт чтобы копить бонусы и отслеживать заказ
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary w-full justify-center py-3.5"
              >
                {currentUser ? (
                  <>
                    Оформить заказ
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Войти и оформить
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}