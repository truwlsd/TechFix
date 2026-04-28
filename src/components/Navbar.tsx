import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Monitor, Menu, X, User, LogOut, Gift, ChevronDown, Search,
  Zap, Monitor as LaptopIcon, Cpu, Shield, Wifi, HardDrive,
  Wrench, Battery, Camera, Keyboard, Settings, ArrowRight,
} from "lucide-react";
import { useStore } from "../store/useStore";

const MEGA_MENU = [
  {
    category: "Ремонт ноутбуков",
    icon: LaptopIcon,
    items: [
      { icon: Settings,  label: "Диагностика",        id: "laptop-repair",      price: 500  },
      { icon: Monitor,   label: "Замена экрана",       id: "screen-replacement", price: 3500 },
      { icon: Keyboard,  label: "Замена клавиатуры",   id: "keyboard-replace",   price: 1800 },
      { icon: Battery,   label: "Замена аккумулятора", id: "battery-replace",    price: 2200 },
    ],
  },
  {
    category: "Ремонт ПК",
    icon: Cpu,
    items: [
      { icon: Settings, label: "Диагностика ПК",   id: "pc-diagnostics", price: 500  },
      { icon: Wrench,   label: "Чистка от пыли",   id: "pc-clean",       price: 900  },
      { icon: Cpu,      label: "Апгрейд",           id: "pc-upgrade",     price: 1000 },
    ],
  },
  {
    category: "Программы и ПО",
    icon: Shield,
    items: [
      { icon: HardDrive, label: "Установка Windows", id: "os-install",    price: 1500 },
      { icon: Shield,    label: "Удаление вирусов",  id: "virus-removal", price: 1200 },
      { icon: Zap,       label: "Ускорение ПК",      id: "speed-up",      price: 900  },
    ],
  },
  {
    category: "Доп. услуги",
    icon: Wifi,
    items: [
      { icon: Wifi,      label: "Настройка Wi-Fi",       id: "wifi-setup",    price: 700  },
      { icon: HardDrive, label: "Восстановление данных",  id: "data-recovery", price: 2500 },
      { icon: Camera,    label: "Ремонт веб-камеры",      id: "camera-repair", price: 1200 },
    ],
  },
];

export default function Navbar() {
  const { currentUser, logout, openAuthModal, openOrderModal, services } = useStore();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [megaOpen, setMegaOpen]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [scrolled, setScrolled]         = useState(false);

  const megaRef     = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLDivElement>(null);
  const location    = useLocation();
  const navigate    = useNavigate();

  const goToHomeTop = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const searchResults = (services.length ? services : [])
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    .slice(0, 6);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node))
        setMegaOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
    setDropdownOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        style={{
          position:         "fixed",
          top:              0,
          left:             0,
          right:            0,
          zIndex:           50,
          background:       scrolled ? "rgba(8,8,14,0.97)" : "rgba(8,8,14,0.85)",
          backdropFilter:   "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom:     scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(255,255,255,0.04)",
          transition:       "all 0.3s ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();
                goToHomeTop();
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#ffffff",
                boxShadow: "0 0 20px rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Monitor className="w-5 h-5" style={{ color: "#0a0a0f" }} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Tech<span style={{ color: "rgba(255,255,255,0.3)" }}>Fix</span>
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center gap-1">

              {/* Главная */}
              <Link
                to="/"
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive("/") ? "#fff" : "rgba(255,255,255,0.55)",
                  background: isActive("/") ? "rgba(255,255,255,0.08)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  if (!isActive("/")) e.currentTarget.style.color = "#fff";
                  if (!isActive("/")) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={e => {
                  if (!isActive("/")) e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                  if (!isActive("/")) e.currentTarget.style.background = "transparent";
                }}
                onClick={(e) => {
                  e.preventDefault();
                  goToHomeTop();
                }}
              >
                Главная
              </Link>

              {/* ── Мега-меню "Услуги" ── */}
              <div className="relative" ref={megaRef}>
                <button
                  onClick={() => setMegaOpen(v => !v)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 8,
                    fontSize: 14, fontWeight: 500,
                    color: isActive("/services") || megaOpen ? "#fff" : "rgba(255,255,255,0.55)",
                    background: isActive("/services") || megaOpen
                      ? "rgba(255,255,255,0.08)" : "transparent",
                    border: "none", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Услуги
                  <ChevronDown
                    className="w-3.5 h-3.5"
                    style={{
                      transition: "transform 0.3s",
                      transform: megaOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* Мега-дропдаун */}
                {megaOpen && (
                  <div
                    style={{
                      position: "fixed",
                      top: 76,
                      left: "50%",
                      marginLeft: -360,
                      width: 720,
                      background: "rgba(10,10,18,0.98)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 20,
                      overflow: "hidden",
                      boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
                      animation: "fadeIn 0.2s ease",
                    }}
                  >
                    {/* Шапка мега-меню */}
                    <div style={{
                      padding: "16px 20px 12px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)",
                        textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                        Все услуги
                      </span>
                      <Link
                        to="/services"
                        onClick={() => setMegaOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          fontSize: 12, color: "rgba(255,255,255,0.4)",
                          textDecoration: "none", transition: "color 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                      >
                        Смотреть всё <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Сетка категорий */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 0,
                    }}>
                      {MEGA_MENU.map((cat, ci) => (
                        <div
                          key={cat.category}
                          style={{
                            padding: "16px",
                            borderRight: ci < 3
                              ? "1px solid rgba(255,255,255,0.05)" : "none",
                          }}
                        >
                          {/* Категория */}
                          <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            marginBottom: 12,
                          }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: 8,
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <cat.icon className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />
                            </div>
                            <span style={{
                              fontSize: 11, fontWeight: 600,
                              color: "rgba(255,255,255,0.4)",
                              textTransform: "uppercase", letterSpacing: "0.05em",
                            }}>
                              {cat.category}
                            </span>
                          </div>

                          {/* Услуги */}
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {cat.items.map(item => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setMegaOpen(false);
                                  navigate("/services");
                                  setTimeout(() => openOrderModal({
                                    id: item.id,
                                    name: item.label,
                                    price: item.price,
                                  }), 100);
                                }}
                                style={{
                                  display: "flex", alignItems: "center", gap: 8,
                                  padding: "8px 10px", borderRadius: 10,
                                  background: "transparent", border: "none",
                                  cursor: "pointer", textAlign: "left",
                                  transition: "all 0.15s",
                                  width: "100%",
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.background = "transparent";
                                }}
                              >
                                <item.icon className="w-3.5 h-3.5 flex-shrink-0"
                                  style={{ color: "rgba(255,255,255,0.3)" }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{
                                    fontSize: 13, color: "rgba(255,255,255,0.65)",
                                    fontWeight: 500, lineHeight: 1.3,
                                  }}>
                                    {item.label}
                                  </p>
                                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                                    от {item.price.toLocaleString()} ₽
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Нижняя строка */}
                    <div style={{
                      padding: "12px 20px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "#4ade80",
                          boxShadow: "0 0 8px #4ade80",
                        }} />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                          Принимаем заказы · Пн–Вс 9:00–21:00
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
                        13 услуг
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Кабинет */}
              <Link
                to="/cabinet"
                style={{
                  padding: "8px 14px", borderRadius: 8,
                  fontSize: 14, fontWeight: 500,
                  color: isActive("/cabinet") ? "#fff" : "rgba(255,255,255,0.55)",
                  background: isActive("/cabinet") ? "rgba(255,255,255,0.08)" : "transparent",
                  textDecoration: "none", transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  if (!isActive("/cabinet")) e.currentTarget.style.color = "#fff";
                  if (!isActive("/cabinet")) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={e => {
                  if (!isActive("/cabinet")) e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                  if (!isActive("/cabinet")) e.currentTarget.style.background = "transparent";
                }}
              >
                Кабинет
              </Link>
            </div>

            {/* ── Right side ── */}
            <div className="flex items-center gap-2">

              {/* Поиск */}
              <div className="relative hidden md:block" ref={searchRef}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 14px", borderRadius: 50,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.35)" }} />
                  <input
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                    onFocus={() => setSearchOpen(true)}
                    style={{
                      background: "transparent", border: "none", outline: "none",
                      fontSize: 13, color: "rgba(255,255,255,0.7)",
                      width: searchOpen ? 160 : 80,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>

                {searchOpen && searchQuery.trim() && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: 280,
                    background: "rgba(10,10,18,0.98)",
                    backdropFilter: "blur(30px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
                  }}>
                    {searchResults.length > 0 ? searchResults.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          navigate("/services");
                          setTimeout(() => openOrderModal(s), 100);
                        }}
                        style={{
                          width: "100%", display: "flex",
                          alignItems: "center", justifyContent: "space-between",
                          padding: "12px 16px", background: "transparent",
                          border: "none", borderBottom: "1px solid rgba(255,255,255,0.04)",
                          cursor: "pointer", transition: "background 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{s.name}</span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{s.price} ₽</span>
                      </button>
                    )) : (
                      <div style={{ padding: "16px", textAlign: "center",
                        fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                        Ничего не найдено
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Юзер / Auth */}
              {currentUser ? (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "6px 10px 6px 6px", borderRadius: 50,
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "#fff", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#0a0a0f",
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {currentUser.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5"
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                      }}
                    />
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: "absolute", right: 0,
                      top: "calc(100% + 8px)", width: 220,
                      background: "rgba(10,10,18,0.98)",
                      backdropFilter: "blur(40px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 16, overflow: "hidden",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
                      animation: "scaleIn 0.2s ease",
                    }}>
                      <div style={{ padding: "14px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                          {currentUser.name}
                        </p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                          {currentUser.email}
                        </p>
                        <div style={{
                          marginTop: 10, padding: "8px 10px",
                          borderRadius: 10, background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between",
                        }}>
                          <div style={{ display: "flex", alignItems: "center",
                            gap: 6, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                            <Gift className="w-3.5 h-3.5" /> Бонусы
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                            {currentUser.bonusBalance}
                          </span>
                        </div>
                      </div>

                      <div style={{ padding: "4px 0" }}>
                        <Link to="/cabinet" onClick={() => setDropdownOpen(false)}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 16px", fontSize: 13,
                            color: "rgba(255,255,255,0.6)", textDecoration: "none",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <User className="w-4 h-4" /> Личный кабинет
                        </Link>
                        {currentUser.isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            style={{
                              display: "flex", alignItems: "center", gap: 10,
                              padding: "10px 16px", fontSize: 13,
                              color: "rgba(255,255,255,0.6)", textDecoration: "none",
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <Settings className="w-4 h-4" /> Админ панель
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setDropdownOpen(false); }}
                          style={{
                            width: "100%", display: "flex", alignItems: "center",
                            gap: 10, padding: "10px 16px", fontSize: 13,
                            color: "rgba(239,68,68,0.8)", background: "transparent",
                            border: "none", cursor: "pointer", textAlign: "left",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <LogOut className="w-4 h-4" /> Выйти
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal("login")}
                    style={{
                      padding: "8px 16px", borderRadius: 50,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.12)",
                      fontSize: 13, fontWeight: 500,
                      color: "rgba(255,255,255,0.7)",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    }}
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => openAuthModal("register")}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 50,
                      background: "#ffffff", color: "#0a0a0f",
                      border: "none", fontSize: 13, fontWeight: 600,
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 8px 30px rgba(255,255,255,0.2)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Zap className="w-3.5 h-3.5" /> Начать
                  </button>
                </div>
              )}

              {/* Mobile burger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "rgba(255,255,255,0.6)",
                }}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="md:hidden" style={{
            background: "rgba(8,8,14,0.99)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 16px 20px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}>
            {/* Поиск мобильный */}
            <div style={{ marginBottom: 12 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 14px", borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <Search className="w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  placeholder="Поиск услуг..."
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    fontSize: 14, color: "#fff", flex: 1,
                  }}
                />
              </div>
            </div>

            {/* Ссылки */}
            {[
              { to: "/", label: "Главная" },
              { to: "/services", label: "Услуги" },
              { to: "/cabinet", label: "Личный кабинет" },
            ].map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  display: "block", padding: "11px 14px",
                  borderRadius: 10, fontSize: 14, fontWeight: 500,
                  color: isActive(l.to) ? "#fff" : "rgba(255,255,255,0.5)",
                  background: isActive(l.to) ? "rgba(255,255,255,0.08)" : "transparent",
                  marginBottom: 2,
                }}
                onClick={(e) => {
                  if (l.to === "/") {
                    e.preventDefault();
                    setMenuOpen(false);
                    goToHomeTop();
                    return;
                  }

                  setMenuOpen(false);
                }}
              >
                {l.label}
              </Link>
            ))}

            {/* Мобильный auth */}
            {!currentUser && (
              <div style={{
                marginTop: 12, paddingTop: 12,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex", flexDirection: "column", gap: 8,
              }}>
                <button
                  onClick={() => { openAuthModal("login"); setMenuOpen(false); }}
                  className="btn-ghost w-full justify-center py-3"
                >
                  Войти
                </button>
                <button
                  onClick={() => { openAuthModal("register"); setMenuOpen(false); }}
                  className="btn-primary w-full justify-center py-3"
                >
                  <Zap className="w-4 h-4" /> Зарегистрироваться
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      <div style={{ height: 64 }} />
    </>
  );
}