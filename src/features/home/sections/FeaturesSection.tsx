import { FEATURES } from "../data";
import { useInView } from "../hooks";
import s from "./sections.module.css";

function FeatureCard({ feature, index }: { feature: (typeof FEATURES)[number]; index: number }) {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={inView ? "animate-revealUp" : "opacity-0"}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className={s.featureCardInner}>
        <div className={s.featureIconWrap}>
          <feature.icon className={`w-5 h-5 ${s.featureIcon}`} />
        </div>
        <div>
          <h3 className={s.featureTitle}>{feature.title}</h3>
          <p className={s.featureDesc}>{feature.desc}</p>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className={s.featuresSection}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={s.featuresHeader}>
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
