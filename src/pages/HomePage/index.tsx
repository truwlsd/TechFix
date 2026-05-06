import { useEffect, useState } from "react";
import OrderModal from "../../components/OrderModal";
import { useStore } from "../../store/useStore";
import {
  ContactsSection,
  FaqSection,
  FeaturesSection,
  FooterSection,
  HeroSection,
  HowItWorksSection,
  PopularServicesSection,
} from "../../features/home/sections";
import type { HomeService } from "../../features/home/data";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { openAuthModal, currentUser } = useStore();
  const [selectedService, setSelectedService] = useState<HomeService | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let rafId = 0;
    const move = (e: MouseEvent) => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
        rafId = 0;
      });
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={styles.page}>
      <HeroSection
        currentUser={currentUser}
        mousePos={mousePos}
        onLoginClick={() => openAuthModal("login")}
        onRegisterClick={() => openAuthModal("register")}
      />
      <PopularServicesSection onOrder={setSelectedService} />
      <HowItWorksSection />
      <FeaturesSection />
      <FaqSection />
      <ContactsSection />
      <FooterSection />

      <OrderModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  );
}
