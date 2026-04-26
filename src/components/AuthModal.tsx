import { useState } from "react";
import { X, Eye, EyeOff, Monitor, Gift, Zap } from "lucide-react";
import { useStore } from "../store/useStore";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    login,
    register,
    openAuthModal,
  } = useStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === "login";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const result = await login(form.email, form.password);
      if (!result.ok) setError(result.message || "Неверный email или пароль");
      else closeAuthModal();
    } else {
      if (!form.name || !form.email || !form.phone || !form.password) {
        setError("Заполните все поля");
        setLoading(false);
        return;
      }
      if (form.password.length < 6) {
        setError("Пароль минимум 6 символов");
        setLoading(false);
        return;
      }
      const result = await register(form.name, form.email, form.phone, form.password);
      if (!result.ok) setError(result.message || "Ошибка регистрации");
      else closeAuthModal();
    }
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    const result = await login("demo@techfix.ru", "demo123");
    if (!result.ok) {
      setError(result.message || "Не удалось войти демо-пользователем");
      return;
    }
    closeAuthModal();
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div
        className="modal-content w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/50 hover:text-white transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Monitor className="w-4 h-4 text-[#0a0a0f]" />
            </div>
            <span className="text-sm font-bold text-white/60 tracking-wider uppercase">
              TechFix
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? "Добро пожаловать" : "Создать аккаунт"}
          </h2>
          <p className="text-sm text-white/40 mt-1">
            {isLogin
              ? "Войдите чтобы отслеживать заказы и копить бонусы"
              : "Регистрация даёт 100 приветственных бонусов 🎁"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                Имя и фамилия
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Алексей Иванов"
                className="input-dark"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="input-dark"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                Телефон
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+7 (900) 000-00-00"
                className="input-dark"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
              Пароль
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-dark pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />
                Загрузка...
              </span>
            ) : isLogin ? (
              <>
                <Zap className="w-4 h-4" />
                Войти
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Зарегистрироваться
              </>
            )}
          </button>

          {isLogin && (
            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn-ghost w-full justify-center py-3 rounded-xl text-sm"
            >
              <Gift className="w-4 h-4 text-white/40" />
              Демо-пользователь
            </button>
          )}

          <p className="text-center text-sm text-white/30">
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              type="button"
              onClick={() => openAuthModal(isLogin ? "register" : "login")}
              className="text-white hover:text-white/80 font-medium underline underline-offset-2 transition-colors"
            >
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}