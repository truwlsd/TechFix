import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import CabinetPage from "./pages/CabinetPage";
import { useStore } from "./store/useStore";
import styles from "./App.module.css";

export default function App() {
  const bootstrapSession = useStore((s) => s.bootstrapSession);
  const refreshServices = useStore((s) => s.refreshServices);

  useEffect(() => {
    void refreshServices();
    void bootstrapSession();
  }, [bootstrapSession, refreshServices]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className={styles.shell}>
        <Navbar />
        <AuthModal />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="/admin" element={<CabinetPage initialTab="admin" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}
