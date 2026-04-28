import { useRef, useState } from "react";
import { X, Eye, EyeOff, Monitor, Gift, Zap } from "lucide-react";
import { useStore } from "../../store/useStore";
import styles from "./AuthModal.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  const normalized = digits.startsWith("8")
    ? `7${digits.slice(1)}`
    : digits.startsWith("7")
      ? digits
      : digits;

  const trimmed = normalized.slice(0, 11);
  if (trimmed.length <= 1) return `+${trimmed}`;
  return `+${trimmed[0]} ${trimmed.slice(1)}`;
}

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
  const shouldCloseOnClick = useRef(false);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === "login";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name === "phone"
          ? normalizePhone(value)
          : name === "email"
            ? value.trim()
            : value,
    }));
    setError("");
  };

  const validate = () => {
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!email || !password) {
      return "Заполните email и пароль";
    }
    if (!EMAIL_RE.test(email)) {
      return "Введите корректный email";
    }
    if (password.length < 6) {
      return "Пароль минимум 6 символов";
    }

    if (!isLogin) {
      const name = form.name.trim().replace(/\s+/g, " ");
      const phoneDigits = form.phone.replace(/\D/g, "");
      if (name.length < 2) {
        return "Введите корректное имя";
      }
      if (phoneDigits.length < 11 || !phoneDigits.startsWith("7")) {
        return "Введите телефон в формате +7XXXXXXXXXX";
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const payload = {
      name: form.name.trim().replace(/\s+/g, " "),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.replace(/\s+/g, ""),
      password: form.password.trim(),
    };

    if (isLogin) {
      const result = await login(payload.email, payload.password);
      if (!result.ok) setError(result.message || "Неверный email или пароль");
      else closeAuthModal();
    } else {
      const result = await register(payload.name, payload.email, payload.phone, payload.password);
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
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        shouldCloseOnClick.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (shouldCloseOnClick.current && e.target === e.currentTarget) {
          closeAuthModal();
        }
      }}
    >
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeAuthModal}
          className={styles.closeBtn}
        >
          <X className="w-4 h-4" />
        </button>

        <div className={styles.header}>
          <div className="flex items-center gap-2 mb-4">
            <div className={styles.brandIcon}>
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

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div>
              <label className={styles.fieldLabel}>
                Имя и фамилия
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Алексей Иванов"
                maxLength={80}
                className="input-dark"
              />
            </div>
          )}

          <div>
            <label className={styles.fieldLabel}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={120}
              className="input-dark"
            />
          </div>

          {!isLogin && (
            <div>
              <label className={styles.fieldLabel}>Телефон</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+7 (900) 000-00-00"
                inputMode="tel"
                autoComplete="tel"
                maxLength={16}
                className="input-dark"
              />
            </div>
          )}

          <div>
            <label className={styles.fieldLabel}>Пароль</label>
            <div className={styles.passWrap}>
              <input
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={6}
                maxLength={128}
                className="input-dark pr-11"
              />
              <button
                type="button"
                className={styles.togglePass}
                onClick={() => setShowPass(!showPass)}
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
            <div className={styles.errBanner}>{error}</div>
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

          <p className={styles.footerSwitch}>
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              type="button"
              className={styles.switchBtn}
              onClick={() => openAuthModal(isLogin ? "register" : "login")}
            >
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
