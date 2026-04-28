import { MARQUEE_ITEMS } from "../data";
import s from "./sections.module.css";

export function MarqueeSection() {
  return (
    <div className={s.marqueeSection}>
      <div className="animate-marquee">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <div key={`${item}-${i}`} className={s.marqueeItem}>
            <span className={s.marqueeText}>{item}</span>
            <div className={s.marqueeDot} />
          </div>
        ))}
      </div>
    </div>
  );
}
