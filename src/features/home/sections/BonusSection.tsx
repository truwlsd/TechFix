import { ArrowRight, Gift } from "lucide-react";
import type { HomeSectionsUserProp } from "./types";
import s from "./sections.module.css";

export function BonusSection({
  currentUser,
  onRegisterClick,
}: HomeSectionsUserProp & { onRegisterClick: () => void }) {
  if (currentUser) {
    return null;
  }

  return (
    <section className={s.bonusSection}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={s.bonusBanner}>
          <div className={`blob ${s.bonusBlob}`} />
          <div className="relative">
            <div className={s.bonusIconWrap}>
              <Gift className="w-8 h-8" style={{ color: "rgba(255,255,255,0.5)" }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Начните копить бонусы</h2>
            <p className={s.bonusText}>100 приветственных бонусов + 5% кэшбэк с каждого заказа</p>
            <button type="button" onClick={onRegisterClick} className="btn-primary text-base px-10 py-4">
              Получить бонусы <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
