import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight } from "lucide-react";

export function AdminAccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0a0a0f" }}>
      <div
        className="relative rounded-3xl p-10 text-center w-full max-w-md animate-scaleIn"
        style={{
          background: "rgba(15,15,25,0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(40px)",
        }}
      >
        <AlertCircle className="w-10 h-10 text-yellow-400/80 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Доступ запрещен</h2>
        <p className="text-white/35 text-sm mb-8 leading-relaxed">
          Эта страница доступна только администраторам.
        </p>
        <Link to="/cabinet" className="btn-primary w-full justify-center py-3.5">
          В личный кабинет <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
