import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Monitor, Menu, X, User, LogOut, Gift, ChevronDown, Search,
  Zap, Monitor as LaptopIcon, Cpu, Shield, Wifi, HardDrive,
  Wrench, Battery, Camera, Keyboard, Settings, ArrowRight,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useStore } from "../../store/useStore";
import styles from "./Navbar.module.css";

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
  const [scrolled, setScrolled]       = useState(false);

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
        className={styles.root}
        data-scrolled={scrolled ? "true" : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link
              to="/"
              className={styles.logoLink}
              onClick={(e) => {
                e.preventDefault();
                goToHomeTop();
              }}
            >
              <div className={styles.logoMark}>
                <Monitor className={cn("w-5 h-5", styles.logoIcon)} />
              </div>
              <span className={styles.logoTitle}>
                Tech<span className={styles.logoTitleDim}>Fix</span>
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center gap-1">

              <Link
                to="/"
                className={cn(styles.deskNavLink, isActive("/") && styles.deskNavLinkActive)}
                onClick={(e) => {
                  e.preventDefault();
                  goToHomeTop();
                }}
              >
                Главная
              </Link>

              <div className="relative" ref={megaRef}>
                <button
                  type="button"
                  onClick={() => setMegaOpen(v => !v)}
                  className={cn(
                    styles.megaTrigger,
                    (isActive("/services") || megaOpen) && styles.megaTriggerOn
                  )}
                >
                  Услуги
                  <ChevronDown
                    className={cn(styles.chevron, megaOpen && styles.chevronOpen)}
                  />
                </button>

                {megaOpen && (
                  <div className={styles.megaDropdown}>
                    <div className={styles.megaHead}>
                      <span className={styles.megaHeadLabel}>
                        Все услуги
                      </span>
                      <Link
                        to="/services"
                        className={styles.megaHeadLink}
                        onClick={() => setMegaOpen(false)}
                      >
                        Смотреть всё <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className={styles.megaGrid}>
                      {MEGA_MENU.map((cat, ci) => (
                        <div
                          key={cat.category}
                          className={cn(styles.megaCol, ci < 3 && styles.megaColBorder)}
                        >
                          <div className={styles.megaCatRow}>
                            <div className={styles.megaCatIconWrap}>
                              <cat.icon className={cn("w-3.5 h-3.5", styles.megaCatIcon)} />
                            </div>
                            <span className={styles.megaCatTitle}>
                              {cat.category}
                            </span>
                          </div>

                          <div className={styles.megaItemList}>
                            {cat.items.map(item => (
                              <button
                                key={item.id}
                                type="button"
                                className={styles.megaServiceBtn}
                                onClick={() => {
                                  setMegaOpen(false);
                                  navigate("/services");
                                  setTimeout(() => openOrderModal({
                                    id: item.id,
                                    name: item.label,
                                    price: item.price,
                                  }), 100);
                                }}
                              >
                                <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${styles.megaServiceIcon}`} />
                                <div className={styles.megaItemBody}>
                                  <p className={styles.megaItemTitle}>
                                    {item.label}
                                  </p>
                                  <p className={styles.megaItemPrice}>
                                    от {item.price.toLocaleString()} ₽
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.megaFoot}>
                      <div className={styles.megaFootLeft}>
                        <div className={styles.statusDot} />
                        <span className={styles.megaFootHint}>
                          Принимаем заказы · Пн–Вс 9:00–21:00
                        </span>
                      </div>
                      <span className={styles.megaFootMeta}>
                        13 услуг
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/cabinet"
                className={cn(styles.deskNavLink, isActive("/cabinet") && styles.deskNavLinkActive)}
              >
                Кабинет
              </Link>
            </div>

            <div className="flex items-center gap-2">

              <div className="relative hidden md:block" ref={searchRef}>
                <div
                  className={styles.searchShell}
                  data-open={searchOpen ? "true" : undefined}
                  role="presentation"
                  onClick={() => setSearchOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSearchOpen(true);
                  }}
                >
                  <Search className={`w-3.5 h-3.5 ${styles.searchIcon}`} />
                  <input
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                    onFocus={() => setSearchOpen(true)}
                    className={styles.searchInput}
                  />
                </div>

                {searchOpen && searchQuery.trim() && (
                  <div className={styles.searchResults}>
                    {searchResults.length > 0 ? searchResults.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        className={styles.searchResultBtn}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          navigate("/services");
                          setTimeout(() => openOrderModal(s), 100);
                        }}
                      >
                        <span className={styles.searchResultName}>{s.name}</span>
                        <span className={styles.searchResultPrice}>{s.price} ₽</span>
                      </button>
                    )) : (
                      <div className={styles.searchEmpty}>
                        Ничего не найдено
                      </div>
                    )}
                  </div>
                )}
              </div>

              {currentUser ? (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    type="button"
                    className={styles.userMenuBtn}
                    onClick={() => setDropdownOpen(v => !v)}
                  >
                    <div className={styles.avatarCircle}>
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className={styles.userMenuName}>
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      className={cn("w-3.5 h-3.5", styles.userMenuChevron, dropdownOpen && styles.userMenuChevronOpen)}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className={styles.userDropdown}>
                      <div className={styles.userDropdownHead}>
                        <p className={styles.userDropdownName}>
                          {currentUser.name}
                        </p>
                        <p className={styles.userDropdownEmail}>
                          {currentUser.email}
                        </p>
                        <div className={styles.bonusRow}>
                          <div className={styles.bonusLabel}>
                            <Gift className="w-3.5 h-3.5" /> Бонусы
                          </div>
                          <span className={styles.bonusValue}>
                            {currentUser.bonusBalance}
                          </span>
                        </div>
                      </div>

                      <div className={styles.userDropdownNav}>
                        <Link
                          to="/cabinet"
                          className={styles.dropdownLink}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User className="w-4 h-4" /> Личный кабинет
                        </Link>
                        {currentUser.isAdmin && (
                          <Link
                            to="/admin"
                            className={styles.dropdownLink}
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Settings className="w-4 h-4" /> Админ панель
                          </Link>
                        )}
                        <button
                          type="button"
                          className={styles.logoutBtn}
                          onClick={() => { logout(); setDropdownOpen(false); }}
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
                    type="button"
                    className={styles.authGhost}
                    onClick={() => openAuthModal("login")}
                  >
                    Войти
                  </button>
                  <button
                    type="button"
                    className={styles.authPrimary}
                    onClick={() => openAuthModal("register")}
                  >
                    <Zap className="w-3.5 h-3.5" /> Начать
                  </button>
                </div>
              )}

              <button
                type="button"
                aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
                className={styles.mobileBurgerBtn}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className={styles.mobilePanel}>
            <div className={styles.mobileSearchWrap}>
              <div className={styles.mobileSearchInner}>
                <Search className={`w-4 h-4 ${styles.mobileSearchIcon}`} />
                <input
                  placeholder="Поиск услуг..."
                  className={styles.mobileSearchInput}
                />
              </div>
            </div>

            {[
              { to: "/", label: "Главная" },
              { to: "/services", label: "Услуги" },
              { to: "/cabinet", label: "Личный кабинет" },
            ].map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(styles.mobileNavLink, isActive(l.to) && styles.mobileNavLinkActive)}
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

            {!currentUser && (
              <div className={styles.mobileAuthWrap}>
                <button
                  type="button"
                  className="btn-ghost w-full justify-center py-3"
                  onClick={() => { openAuthModal("login"); setMenuOpen(false); }}
                >
                  Войти
                </button>
                <button
                  type="button"
                  className="btn-primary w-full justify-center py-3"
                  onClick={() => { openAuthModal("register"); setMenuOpen(false); }}
                >
                  <Zap className="w-4 h-4" /> Зарегистрироваться
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      <div className={styles.spacer} />
    </>
  );
}
