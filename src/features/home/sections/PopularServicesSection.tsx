import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { POPULAR_SERVICES, type HomeService } from "../data";
import { useInView } from "../hooks";
import s from "./sections.module.css";

function ServiceCard({
  service,
  index,
  onOrder,
}: {
  service: HomeService;
  index: number;
  onOrder: (service: HomeService) => void;
}) {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`service-card ${inView ? "animate-revealUp" : "opacity-0"}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={s.serviceBody}>
        {service.tag ? (
          <div className="badge text-xs mb-4">
            <Zap className="w-3 h-3" />
            {service.tag}
          </div>
        ) : (
          <div className="mb-4 h-[28px]" />
        )}

        <div className={s.serviceIconWrap}>
          <service.icon className={`w-6 h-6 ${s.howIcon}`} />
        </div>
        <h3 className={s.serviceTitle}>{service.name}</h3>
        <p className={s.serviceDesc}>{service.desc}</p>
      </div>
      <div className={s.serviceCardFooter}>
        <div>
          <p className={s.servicePriceLabel}>от</p>
          <p className="font-bold text-white">{service.priceLabel}</p>
        </div>
        <button type="button" onClick={() => onOrder(service)} className="btn-primary text-sm py-2 px-4">
          Заказать
        </button>
      </div>
    </div>
  );
}

export function PopularServicesSection({
  onOrder,
}: {
  onOrder: (service: HomeService) => void;
}) {
  return (
    <section className={s.popularSection}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={s.popularHeadingRow}>
          <div>
            <div className="section-label">Услуги</div>
            <h2 className="text-3xl md:text-5xl font-black text-white">Популярные услуги</h2>
          </div>
          <Link to="/services" className={`hidden md:flex ${s.allServicesLink}`}>
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
