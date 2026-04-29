import { Star } from "lucide-react";
import { REVIEWS } from "../data";
import s from "./sections.module.css";

export function ReviewsSection() {
  return (
    <section className={s.reviewsSection}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center">
        <div className="section-label" style={{ justifyContent: "center" }}>Отзывы</div>
        <h2 className="text-3xl md:text-5xl font-black text-white">Клиенты о нас</h2>
      </div>
      <div className="overflow-hidden">
        <div className="animate-marquee">
          {[...REVIEWS, ...REVIEWS].map((review, i) => (
            <div key={`${review.name}-${i}`} className={s.reviewCard}>
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)", fill: "rgba(255,255,255,0.4)" }} />
                ))}
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, flex: 1, marginBottom: 18 }}>
                "{review.text}"
              </p>
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
