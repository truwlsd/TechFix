import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { X, Wrench, Gift, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useStore } from "../../store/useStore";
import styles from "./OrderModal.module.css";

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
  const shouldCloseOnClick = useRef(false);

  if (!service) return null;

  const maxBonus = Math.min(
    currentUser?.bonusBalance ?? 0,
    Math.floor(service.price * 0.3)
  );
  const finalPrice = service.price - bonusUsed;
  const bonusEarned = Math.floor(finalPrice * 0.05);
  const pct = maxBonus > 0 ? (bonusUsed / maxBonus) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onClose();
      openAuthModal("login");
      return;
    }
    const normalizedDescription = deviceDescription.trim();
    if (!normalizedDescription) {
      setError("Опишите вашу проблему или устройство");
      return;
    }
    if (normalizedDescription.length < 10) {
      setError("Описание должно быть не короче 10 символов");
      return;
    }
    if (normalizedDescription.length > 500) {
      setError("Описание слишком длинное (максимум 500 символов)");
      return;
    }
    const result = await createOrder(
      service.id,
      service.name,
      service.price,
      normalizedDescription,
      Math.min(Math.max(Math.trunc(bonusUsed), 0), maxBonus)
    );
    if (!result.ok) {
      setError(result.message || "Не удалось оформить заказ");
      return;
    }
    setSubmitted(true);
  };

  const bonusStyle =
    ({
      "--bonus-pct": `${pct}%`,
    }) as CSSProperties;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        shouldCloseOnClick.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (shouldCloseOnClick.current && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className={styles.successWrap}>
            <div className={styles.successIconCircle}>
              <CheckCircle className="w-10 h-10 text-white/70" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Заказ принят!
            </h3>
            <p className="text-white/40 mb-6 leading-relaxed">
              Мы свяжемся с вами в течение 30 минут для уточнения деталей.
            </p>

            <div className={`glass ${styles.bonusHint} mb-8`}>
              <Gift className="w-5 h-5 text-white/40 flex-shrink-0" />
              <p className="text-sm text-white/50">
                <span className="text-white font-semibold">
                  +{bonusEarned} бонусов
                </span>{" "}
                будет начислено после выполнения заказа
              </p>
            </div>

            <button type="button" onClick={onClose} className="btn-primary w-full justify-center py-3.5">
              Отлично!
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <div className={styles.headerRow}>
                <div className={styles.headerIconWrap}>
                  <Wrench className="w-3.5 h-3.5 text-white/60" />
                </div>
                <span className="text-xs text-white/30 uppercase tracking-wider font-medium">
                  Оформление заказа
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{service.name}</h3>
              <p className="text-sm text-white/30 mt-1">от {service.priceLabel}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <label className={styles.label}>
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
                  minLength={10}
                  maxLength={500}
                  className="input-dark resize-none"
                />
              </div>

              {currentUser && currentUser.bonusBalance > 0 && (
                <div className={`glass ${styles.bonusBlock}`}>
                  <div className={styles.bonusMeta}>
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
                    className={styles.range}
                    style={bonusStyle}
                  />
                  <div className={styles.rangeMeta}>
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

              <div className={`glass ${styles.summary}`}>
                <div className={styles.rowBetween}>
                  <span className="text-white/40">Стоимость услуги</span>
                  <span className="text-white/60">от {service.priceLabel}</span>
                </div>
                {bonusUsed > 0 && (
                  <div className={styles.rowBetween}>
                    <span className="text-white/40">Скидка бонусами</span>
                    <span className="text-white/60">−{bonusUsed} ₽</span>
                  </div>
                )}
                <div className={styles.rule} />
                <div className={`${styles.rowBetween} font-semibold`}>
                  <span className="text-white">Итого от</span>
                  <span className="font-bold text-white">
                    {finalPrice.toLocaleString()} ₽
                  </span>
                </div>
                <div className={`${styles.rowBetween} text-xs`}>
                  <span className="text-white/30">Начислим бонусов</span>
                  <span className="text-green-400/70">+{bonusEarned} баллов</span>
                </div>
              </div>

              {!currentUser && (
                <div className={`flex items-start gap-3 glass ${styles.authHint}`}>
                  <AlertCircle className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-white/40">
                    Войдите в аккаунт чтобы копить бонусы и отслеживать заказ
                  </p>
                </div>
              )}

              {error && (
                <div className={styles.errBox}>
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              )}

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
