import { STATS } from "../data";
import { useCountUp, useInView } from "../hooks";
import s from "./sections.module.css";

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
    <section className={s.statsSection}>
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
