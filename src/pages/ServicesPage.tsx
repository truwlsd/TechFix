import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle, Clock, Shield } from "lucide-react";
import OrderModal from "../components/OrderModal";
import { FooterSection } from "../features/home/sections";
import { useStore, type Service } from "../store/useStore";

interface ServiceView extends Service {
  priceLabel: string;
  desc: string;
}

const CATEGORY_BY_ID: Array<{ category: string; test: (id: string) => boolean }> = [
  { category: "Ремонт ноутбуков", test: (id) => id.includes("laptop") || id.includes("screen") || id.includes("keyboard") || id.includes("battery") },
  { category: "Ремонт ПК", test: (id) => id.includes("pc-") },
  { category: "Программное обеспечение", test: (id) => id.includes("os-") || id.includes("virus") || id.includes("speed") },
];

function getCategory(serviceId: string): string {
  const found = CATEGORY_BY_ID.find((item) => item.test(serviceId));
  return found?.category ?? "Дополнительные услуги";
}

function buildDescription(name: string): string {
  return `Профессиональная услуга: ${name}. Точная стоимость и срок после диагностики.`;
}

export default function ServicesPage() {
  const services = useStore((s) => s.services);
  const [selectedService, setSelectedService] = useState<ServiceView | null>(null);

  const grouped = useMemo(() => {
    const rows = services.map((service) => ({
      ...service,
      category: getCategory(service.id),
      priceLabel: `${service.price.toLocaleString("ru-RU")} ₽`,
      desc: buildDescription(service.name),
    }));

    return rows.reduce<Record<string, ServiceView[]>>((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    }, {});
  }, [services]);

  return (
    <div className="min-h-screen">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-gradient" />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-label mb-4">Прайс-лист</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Все услуги</h1>
          <p className="text-white/40 max-w-xl leading-relaxed">
            Актуальные цены берутся из базы данных. Стоимость запчастей рассчитывается отдельно после диагностики.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { icon: CheckCircle, text: "Бесплатная диагностика при заказе" },
              { icon: Clock, text: "Срочный ремонт за 2 часа" },
              { icon: Shield, text: "Гарантия на все работы" },
            ].map((item) => (
              <div key={item.text} className="badge">
                <item.icon className="w-3.5 h-3.5" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="absolute inset-0 bg-[#080810]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {Object.keys(grouped).length === 0 && (
            <div className="glass-card p-8 text-center text-white/40">Услуги загружаются...</div>
          )}

          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((service) => (
                  <div key={service.id} className="service-card">
                    <div className="p-5">
                      <h3 className="font-bold text-white mb-2">{service.name}</h3>
                      <p className="text-sm text-white/35 leading-relaxed">{service.desc}</p>
                    </div>
                    <div className="border-t border-white/[0.06] px-5 py-4 flex items-center justify-between">
                      <p className="font-bold text-white">{service.priceLabel}</p>
                      <button onClick={() => setSelectedService(service)} className="btn-primary text-sm py-2 px-4">
                        Заказать <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <FooterSection />
      <OrderModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  );
}
