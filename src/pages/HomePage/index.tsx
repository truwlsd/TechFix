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
    const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className={styles.page}>
      <HeroSection
        currentUser={currentUser}
        mousePos={mousePos}
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
