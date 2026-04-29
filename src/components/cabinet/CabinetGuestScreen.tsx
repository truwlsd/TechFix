import { User, ArrowRight } from "lucide-react";
import { useStore } from "../../store/useStore";

export function CabinetGuestScreen() {
  const { openAuthModal } = useStore();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#0a0a0f" }}
    >
      <div className="absolute inset-0 bg-grid opacity-40" style={{ background: "#0a0a0f" }} />
      <div
        className="relative rounded-3xl p-10 text-center w-full max-w-sm animate-scaleIn"
        style={{
          background: "rgba(15,15,25,0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(40px)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <User className="w-8 h-8 text-white/40" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Войдите в аккаунт</h2>
        <p className="text-white/35 text-sm mb-8 leading-relaxed">
          Для доступа к личному кабинету необходима авторизация
        </p>
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="btn-primary w-full justify-center py-3.5 mb-3"
        >
          Войти <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => openAuthModal("register")}
          className="btn-ghost w-full justify-center py-3"
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}
