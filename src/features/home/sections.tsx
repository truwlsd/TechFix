import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Gift,
  Minus,
  Monitor,
  Plus,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  CONTACTS,
  FAQ,
  FEATURES,
  FIVE_STARS,
  FOOTER_LINKS,
  HERO_PRIMARY_CTA,
  HOW_IT_WORKS,
  MARQUEE_ITEMS,
  MOCKUP_STATS,
  POPULAR_SERVICES,
  REVIEWS,
  SOCIAL_PROOF_LETTERS,
  STATS,
  STEPS_PROGRESS,
  type HomeService,
} from "./data";
import { useCountUp, useInView } from "./hooks";

interface SharedProps {
  currentUser: { name: string } | null;
}

export function HeroSection({
  currentUser,
  mousePos,
  onRegisterClick,
}: SharedProps & {
  mousePos: { x: number; y: number };
  onRegisterClick: () => void;
}) {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "#0a0a0f",
      }}
    >
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
                <button onClick={onRegisterClick} className="btn-ghost text-base px-8 py-4">
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

      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }} className="scroll-indicator">
        <ChevronDown className="w-5 h-5" style={{ color: "rgba(255,255,255,0.2)" }} />
      </div>
    </section>
  );
}

export function MarqueeSection() {
  return (
    <div style={{ padding: "18px 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#080810", overflow: "hidden" }}>
      <div className="animate-marquee">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <div key={`${item}-${i}`} style={{ display: "flex", alignItems: "center", gap: 20, margin: "0 24px" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>{item}</span>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 1200, inView);

  return (
    <div ref={ref} className="stat-card text-center">
      <p className="text-3xl md:text-4xl font-black text-white">
        {count}
        {suffix}
      </p>
      <p className="text-xs text-white/30 mt-1">{label}</p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section style={{ padding: "80px 0", background: "#0a0a0f" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
          {STATS.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowStepCard({ step, index }: { step: (typeof HOW_IT_WORKS)[number]; index: number }) {
  const { ref, inView } = useInView(0.1);

  return (
    <div ref={ref} className={inView ? "animate-revealUp" : "opacity-0"} style={{ animationDelay: `${index * 0.15}s` }}>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 32, position: "relative", height: "100%", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: "rgba(255,255,255,0.05)", lineHeight: 1, marginBottom: 20, fontFamily: "monospace" }}>{step.step}</div>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <step.icon className="w-6 h-6" style={{ color: "rgba(255,255,255,0.6)" }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{step.title}</h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>{step.desc}</p>
        {index < 2 && (
          <div style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", display: "none" }} className="hidden lg:block">
            <ArrowRight className="w-5 h-5" style={{ color: "rgba(255,255,255,0.15)" }} />
          </div>
        )}
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section style={{ padding: "100px 0", background: "#080810" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Как это работает</div>
          <h2 className="text-3xl md:text-5xl font-black text-white">Три простых шага</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", marginTop: 16, maxWidth: 500, margin: "16px auto 0" }}>От заявки до готового устройства — без лишних шагов</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="grid-cols-1 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => (
            <HowStepCard key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index, onOrder }: { service: HomeService; index: number; onOrder: (service: HomeService) => void }) {
  const { ref, inView } = useInView(0.1);
  return (
    <div ref={ref} className={`service-card ${inView ? "animate-revealUp" : "opacity-0"}`} style={{ animationDelay: `${index * 0.1}s` }}>
      <div style={{ padding: 20 }}>
        {service.tag ? (
          <div className="badge text-xs" style={{ marginBottom: 16 }}>
            <Zap className="w-3 h-3" />
            {service.tag}
          </div>
        ) : (
          <div style={{ height: 28, marginBottom: 16 }} />
        )}

        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <service.icon className="w-6 h-6" style={{ color: "rgba(255,255,255,0.6)" }} />
        </div>
        <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 6 }}>{service.name}</h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{service.desc}</p>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginBottom: 2 }}>от</p>
          <p style={{ fontWeight: 700, color: "#fff" }}>{service.priceLabel}</p>
        </div>
        <button onClick={() => onOrder(service)} className="btn-primary text-sm py-2 px-4">
          Заказать
        </button>
      </div>
    </div>
  );
}

export function PopularServicesSection({ onOrder }: { onOrder: (service: HomeService) => void }) {
  return (
    <section style={{ padding: "100px 0", background: "#0a0a0f" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <div className="section-label">Услуги</div>
            <h2 className="text-3xl md:text-5xl font-black text-white">Популярные услуги</h2>
          </div>
          <Link to="/services" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }} className="hidden md:flex" onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
            Все услуги <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} onOrder={onOrder} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: (typeof FEATURES)[number]; index: number }) {
  const { ref, inView } = useInView(0.1);
  return (
    <div ref={ref} className={inView ? "animate-revealUp" : "opacity-0"} style={{ animationDelay: `${index * 0.08}s` }}>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 28px", display: "flex", alignItems: "flex-start", gap: 16, transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <feature.icon className="w-5 h-5" style={{ color: "rgba(255,255,255,0.6)" }} />
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{feature.title}</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{feature.desc}</p>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section style={{ padding: "100px 0", background: "#080810" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Преимущества</div>
          <h2 className="text-3xl md:text-5xl font-black text-white">Почему выбирают нас</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section style={{ padding: "100px 0", background: "#080810", overflow: "hidden" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center">
        <div className="section-label" style={{ justifyContent: "center" }}>Отзывы</div>
        <h2 className="text-3xl md:text-5xl font-black text-white">Клиенты о нас</h2>
      </div>
      <div style={{ overflow: "hidden" }}>
        <div className="animate-marquee">
          {[...REVIEWS, ...REVIEWS].map((review, i) => (
            <div key={`${review.name}-${i}`} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 24, margin: "0 10px", width: 300, flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)", fill: "rgba(255,255,255,0.4)" }} />
                ))}
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, flex: 1, marginBottom: 18 }}>"{review.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                  {review.avatar}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{review.name}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{review.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const { ref, inView } = useInView(0.1);

  return (
    <div ref={ref} className={inView ? "animate-revealUp" : "opacity-0"} style={{ animationDelay: `${index * 0.07}s` }}>
      <div style={{ background: open ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.3s ease", marginBottom: 8 }}>
        <button onClick={() => setOpen((prev) => !prev)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 24px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>{q}</span>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: open ? "#fff" : "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s ease" }}>
            {open ? <Minus className="w-3.5 h-3.5" style={{ color: "#0a0a0f" }} /> : <Plus className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />}
          </div>
        </button>
        {open && <div style={{ padding: "0 24px 20px", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, animation: "fadeIn 0.3s ease" }}>{a}</div>}
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <section style={{ padding: "100px 0", background: "#0a0a0f" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>FAQ</div>
          <h2 className="text-3xl md:text-5xl font-black text-white">Частые вопросы</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", marginTop: 16 }}>Не нашли ответ? Напишите нам — ответим за 5 минут.</p>
        </div>
        <div>{FAQ.map((item, i) => <FaqItem key={item.q} q={item.q} a={item.a} index={i} />)}</div>
      </div>
    </section>
  );
}

export function BonusSection({ currentUser, onRegisterClick }: SharedProps & { onRegisterClick: () => void }) {
  if (currentUser) {
    return null;
  }

  return (
    <section style={{ padding: "80px 0", background: "#080810" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 28, padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div className="blob" style={{ width: 400, height: 400, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(255,255,255,0.6)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Gift className="w-8 h-8" style={{ color: "rgba(255,255,255,0.5)" }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Начните копить бонусы</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>100 приветственных бонусов + 5% кэшбэк с каждого заказа</p>
            <button onClick={onRegisterClick} className="btn-primary text-base px-10 py-4">
              Получить бонусы <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactsSection() {
  return (
    <section style={{ padding: "80px 0", background: "#0c0c14" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Контакты</div>
          <h2 className="text-3xl md:text-5xl font-black text-white">Свяжитесь с нами</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CONTACTS.map((contact) => (
            <div key={contact.label} className="glass-card" style={{ padding: 28, textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <contact.icon className="w-5 h-5" style={{ color: "rgba(255,255,255,0.5)" }} />
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{contact.label}</p>
              <p style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>{contact.value}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{contact.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer style={{ background: "#0a0a0f", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 0" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Monitor className="w-4 h-4" style={{ color: "#0a0a0f" }} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Tech<span style={{ color: "rgba(255,255,255,0.2)" }}>Fix</span></span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {FOOTER_LINKS.map((l) => (
                <Link key={l.to} to={l.to} style={{ padding: "6px 14px", borderRadius: 50, fontSize: 13, color: "rgba(255,255,255,0.3)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.07)", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.15)" }}>© 2026 TechFix.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Принимаем заказы сейчас</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
