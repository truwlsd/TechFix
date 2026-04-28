import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { FAQ } from "../data";
import { useInView } from "../hooks";
import s from "./sections.module.css";

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={inView ? "animate-revealUp" : "opacity-0"}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div
        style={{
          background: open ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 16,
          overflow: "hidden",
          transition: "all 0.3s ease",
          marginBottom: 8,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "20px 24px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>{q}</span>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: open ? "#fff" : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.3s ease",
            }}
          >
            {open ? <Minus className="w-3.5 h-3.5" style={{ color: "#0a0a0f" }} /> : <Plus className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />}
          </div>
        </button>
        {open && (
          <div style={{ padding: "0 24px 20px", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, animation: "fadeIn 0.3s ease" }}>
            {a}
          </div>
        )}
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <section className={s.faqSection}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={s.faqHeader}>
          <div className="section-label" style={{ justifyContent: "center" }}>FAQ</div>
          <h2 className="text-3xl md:text-5xl font-black text-white">Частые вопросы</h2>
          <p className={s.faqSubtitle}>Не нашли ответ? Напишите нам — ответим за 5 минут.</p>
        </div>
        <div>{FAQ.map((item, i) => <FaqItem key={item.q} q={item.q} a={item.a} index={i} />)}</div>
      </div>
    </section>
  );
}
