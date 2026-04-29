import { Link } from "react-router-dom";
import {
  CheckCircle,
  ChevronDown,
  Gift,
  Monitor,
  Star,
  Users,
} from "lucide-react";
import {
  HERO_PRIMARY_CTA,
  FIVE_STARS,
  MOCKUP_STATS,
  SOCIAL_PROOF_LETTERS,
  STEPS_PROGRESS,
} from "../data";
import type { HomeSectionsUserProp } from "./types";
import s from "./sections.module.css";

export function HeroSection({
  currentUser,
  mousePos,
  onRegisterClick,
}: HomeSectionsUserProp & {
  mousePos: { x: number; y: number };
  onRegisterClick: () => void;
}) {
  return (
    <section className={s.hero}>
      <div className="cursor-glow hidden lg:block" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="blob w-[700px] h-[700px]" style={{ top: "-10%", right: "-5%", background: "rgba(255,255,255,0.7)" }} />
      <div className="blob w-[400px] h-[400px]" style={{ bottom: "10%", left: "-5%", background: "rgba(255,255,255,0.4)", animationDelay: "4s" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 badge mb-8 animate-revealUp">
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} className="animate-pulse" />
              Рейтинг 4.9 · более 5 000 ремонтов
            </div>
            <div className="mb-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight animate-revealUp" style={{ animationDelay: "0.1s" }}>
                <span style={{ color: "#ffffff" }}>Ремонт</span>
              </h1>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight animate-revealUp" style={{ color: "rgba(255,255,255,0.2)", animationDelay: "0.15s" }}>
                компьютеров
              </h1>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight animate-revealUp" style={{ animationDelay: "0.2s" }}>
                <span style={{ color: "#ffffff" }}>быстро</span>
              </h1>
            </div>

            <p className="text-lg leading-relaxed mb-10 animate-revealUp max-w-md" style={{ color: "rgba(255,255,255,0.4)", animationDelay: "0.25s" }}>
              Профессиональный ремонт ноутбуков и ПК с гарантией 90 дней. Кэшбэк 5% бонусами с каждого заказа.
            </p>

            <div className="flex flex-wrap gap-3 mb-12 animate-revealUp" style={{ animationDelay: "0.3s" }}>
              <Link to={HERO_PRIMARY_CTA.to} className="btn-primary text-base px-8 py-4">
                {HERO_PRIMARY_CTA.label} <HERO_PRIMARY_CTA.icon className="w-4 h-4" />
              </Link>
              {!currentUser && (
                <button type="button" onClick={onRegisterClick} className="btn-ghost text-base px-8 py-4">
                  <Gift className="w-4 h-4" /> +100 бонусов
                </button>
              )}
            </div>

            <div className="flex items-center gap-5 animate-revealUp" style={{ animationDelay: "0.4s" }}>
              <div style={{ display: "flex" }}>
                {SOCIAL_PROOF_LETTERS.map((letter, i) => (
                  <div key={letter} style={{ width: 32, height: 32, borderRadius: "50%", background: `rgba(255,255,255,${0.08 + i * 0.02})`, border: "2px solid #0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginLeft: i > 0 ? -10 : 0 }}>
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                  {FIVE_STARS.map((i) => (
                    <Star key={i} className="w-3 h-3" style={{ color: "rgba(255,255,255,0.5)", fill: "rgba(255,255,255,0.5)" }} />
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>4 900+ довольных клиентов</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block animate-revealRight" style={{ animationDelay: "0.2s" }}>
            <div className="hero-frame animate-pulse-glow">
              <div style={{ background: "#080810", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                  ))}
                  <div style={{ flex: 1, marginLeft: 8, height: 22, background: "rgba(255,255,255,0.04)", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 12px" }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>techfix.ru</span>
                  </div>
                </div>
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div className="glass" style={{ borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Monitor className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Замена экрана MacBook</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>В работе · Мастер Алексей</p>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} className="animate-pulse" />
                  </div>
                  <div className="glass" style={{ borderRadius: 14, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                      <span>Прогресс ремонта</span>
                      <span>75%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "75%" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                      {STEPS_PROGRESS.map((step, i) => (
                        <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: i < 3 ? "#fff" : "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {i < 3 && <CheckCircle className="w-2.5 h-2.5" style={{ color: "#0a0a0f" }} />}
                          </div>
                          <span style={{ fontSize: 9, color: i < 3 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {MOCKUP_STATS.map((r) => (
                      <div key={r.l} className="glass" style={{ borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{r.l}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 glass-card animate-float px-4 py-3" style={{ borderRadius: 14, animationDelay: "0s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle className="w-4 h-4" style={{ color: "#4ade80" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Заказ #042 готов!</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 glass-card animate-float px-4 py-3" style={{ borderRadius: 14, animationDelay: "2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Users className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>+12 заказов сегодня</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${s.scrollChevronWrap} scroll-indicator`}>
        <ChevronDown className="w-5 h-5" style={{ color: "rgba(255,255,255,0.2)" }} />
      </div>
    </section>
  );
}
