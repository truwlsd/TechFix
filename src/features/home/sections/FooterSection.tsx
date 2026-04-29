import { Link, useLocation, useNavigate } from "react-router-dom";
import { Monitor } from "lucide-react";
import { FOOTER_LINKS } from "../data";
import s from "./sections.module.css";

export function FooterSection() {
  const location = useLocation();
  const navigate = useNavigate();

  const goToHomeTop = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={s.footerRoot}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={s.footerInner}>
          <div className={s.footerRow}>
            <div className={s.footerBrand}>
              <div className={s.footerLogoMark}>
                <Monitor className="w-4 h-4" style={{ color: "#0a0a0f" }} />
              </div>
              <span className={s.footerBrandText}>
                Tech<span className={s.footerBrandMuted}>Fix</span>
              </span>
            </div>
            <div className={s.footerLinks}>
              {FOOTER_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={s.footerChip}
                  onClick={(e) => {
                    if (l.to === "/") {
                      e.preventDefault();
                      goToHomeTop();
                    }
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className={s.footerDivider} />
          <div className={s.footerMeta}>
            <p className={s.copy}>© 2026 TechFix.</p>
            <div className={s.footerStatus}>
              <div className={s.liveDot} />
              <span className={s.statusHint}>Принимаем заказы сейчас</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
