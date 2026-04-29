import { ArrowRight } from "lucide-react";
import { HOW_IT_WORKS } from "../data";
import { useInView } from "../hooks";
import s from "./sections.module.css";

function HowStepCard({
  step,
  index,
}: {
  step: (typeof HOW_IT_WORKS)[number];
  index: number;
}) {
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={inView ? "animate-revealUp" : "opacity-0"}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className={s.howCard}>
        <div className={s.stepNum}>{step.step}</div>
        <div className={s.howCardIconWrap}>
          <step.icon className={`w-6 h-6 ${s.howIcon}`} />
        </div>
        <h3 className={s.howTitle}>{step.title}</h3>
        <p className={s.howDesc}>{step.desc}</p>
        {index < 2 && (
          <div className={`hidden lg:block ${s.howArrowHint}`}>
            <ArrowRight className="w-5 h-5" style={{ color: "rgba(255,255,255,0.15)" }} />
          </div>
        )}
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section className={s.howSection}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={s.howHeader}>
          <div className="section-label" style={{ justifyContent: "center" }}>Как это работает</div>
          <h2 className="text-3xl md:text-5xl font-black text-white">Три простых шага</h2>
          <p className={s.howSubtitle}>От заявки до готового устройства — без лишних шагов</p>
        </div>
        <div className={s.howStepsGrid}>
          {HOW_IT_WORKS.map((step, index) => (
            <HowStepCard key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
