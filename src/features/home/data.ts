import type { ElementType } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Gift,
  HardDrive,
  MapPin,
  MessageCircle,
  Monitor,
  MousePointer,
  Phone,
  Shield,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

export interface HomeService {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  icon: ElementType;
  desc: string;
  tag: string | null;
}

export const POPULAR_SERVICES: HomeService[] = [
  {
    id: "laptop-repair",
    name: "Ремонт ноутбука",
    price: 1500,
    priceLabel: "1 500 ₽",
    icon: Monitor,
    desc: "Диагностика, замена деталей, чистка",
    tag: "Хит",
  },
  {
    id: "virus-removal",
    name: "Удаление вирусов",
    price: 1200,
    priceLabel: "1 200 ₽",
    icon: Shield,
    desc: "Полная очистка и установка антивируса",
    tag: null,
  },
  {
    id: "os-install",
    name: "Установка Windows",
    price: 1500,
    priceLabel: "1 500 ₽",
    icon: HardDrive,
    desc: "Установка и настройка ОС с нуля",
    tag: null,
  },
  {
    id: "speed-up",
    name: "Ускорение ПК",
    price: 900,
    priceLabel: "900 ₽",
    icon: Zap,
    desc: "Оптимизация и настройка системы",
    tag: "Быстро",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    icon: MousePointer,
    title: "Оставьте заявку",
    desc: "Выберите услугу на сайте или позвоните нам. Опишите проблему — это займёт 2 минуты.",
  },
  {
    step: "02",
    icon: Wrench,
    title: "Мастер принимает в работу",
    desc: "Проводим диагностику, согласовываем стоимость. Никаких скрытых платежей.",
  },
  {
    step: "03",
    icon: CheckCircle,
    title: "Забираете готовое устройство",
    desc: "Получаете гарантию 90 дней и бонусы на следующий заказ.",
  },
];

export const FEATURES = [
  {
    icon: Clock,
    title: "Ремонт за 1 день",
    desc: "Большинство задач решаем в день обращения",
  },
  {
    icon: Shield,
    title: "Гарантия 90 дней",
    desc: "На все виды работ и запчасти",
  },
  { icon: Award, title: "Опыт 8 лет", desc: "Более 5 000 успешных ремонтов" },
  { icon: Gift, title: "Кэшбэк 5%", desc: "Бонусы с каждого заказа" },
  {
    icon: TrendingUp,
    title: "Прозрачные цены",
    desc: "Фиксированная стоимость без доплат",
  },
  { icon: Users, title: "4 900+ клиентов", desc: "Доверяют нам свою технику" },
];

export const REVIEWS = [
  {
    name: "Михаил С.",
    rating: 5,
    text: "Починили ноутбук за один день, цены адекватные. Буду обращаться снова!",
    avatar: "М",
    service: "Ремонт ноутбука",
  },
  {
    name: "Анна К.",
    rating: 5,
    text: "Отличный сервис! Мастер всё объяснил, никаких скрытых платежей.",
    avatar: "А",
    service: "Установка Windows",
  },
  {
    name: "Дмитрий Р.",
    rating: 5,
    text: "Быстро удалили вирусы, восстановили данные. Спасибо огромное!",
    avatar: "Д",
    service: "Удаление вирусов",
  },
  {
    name: "Елена М.",
    rating: 5,
    text: "Профессиональный подход, всё чётко и по делу. Рекомендую!",
    avatar: "Е",
    service: "Чистка от пыли",
  },
  {
    name: "Сергей В.",
    rating: 5,
    text: "Заменили экран MacBook за день. Качество отличное!",
    avatar: "С",
    service: "Замена экрана",
  },
  {
    name: "Ольга Т.",
    rating: 5,
    text: "Восстановили все данные с убитого жёсткого диска. Чудо!",
    avatar: "О",
    service: "Восстановление данных",
  },
];

export const FAQ = [
  {
    q: "Сколько времени занимает ремонт?",
    a: "Большинство ремонтов выполняется в течение 1 рабочего дня. Сложные случаи (замена экрана MacBook, восстановление данных) могут занять 2–5 дней. Мы всегда называем точные сроки перед началом работы.",
  },
  {
    q: "Нужно ли платить за диагностику?",
    a: "Диагностика бесплатна при заказе ремонта. Если вы решите не делать ремонт, диагностика стоит 500 ₽. Мы честно сообщим о неисправности до начала любых работ.",
  },
  {
    q: "Какая гарантия на ремонт?",
    a: "Мы даём гарантию 90 дней на все виды работ и установленные запчасти. Если в течение этого срока возникнет та же проблема — устраним бесплатно.",
  },
  {
    q: "Можно ли вызвать мастера на дом?",
    a: "Да! Выезд мастера на дом доступен в пределах города. Стоимость выезда — от 500 ₽. Мы приедем в удобное для вас время.",
  },
  {
    q: "Как работает бонусная программа?",
    a: "С каждого заказа вы получаете 5% кэшбэк бонусами. Бонусы можно списать при следующем заказе (до 30% от суммы). При регистрации начисляем 100 приветственных бонусов.",
  },
];

export const STATS = [
  { value: 5000, suffix: "+", label: "Ремонтов" },
  { value: 8, suffix: " лет", label: "На рынке" },
  { value: 90, suffix: " дн", label: "Гарантия" },
  { value: 4.9, suffix: "★", label: "Рейтинг" },
];

export const MARQUEE_ITEMS = [
  "Ремонт ноутбуков",
  "Установка Windows",
  "Удаление вирусов",
  "Замена экранов",
  "Чистка от пыли",
  "Восстановление данных",
  "Апгрейд ПК",
  "Настройка Wi-Fi",
  "Ремонт MacBook",
];

export const CONTACTS = [
  {
    icon: Phone,
    label: "Телефон",
    value: "+7 (999) 999-99-99",
    sub: "Пн–Вс, 9:00–21:00",
  },
  {
    icon: MapPin,
    label: "Адрес",
    value: "Улица 2П-2, 7",
    sub: "2 этаж",
  },
  {
    icon: MessageCircle,
    label: "Онлайн-поддержка",
    value: "Telegram / WhatsApp",
    sub: "Ответим за 5 минут",
  },
];

export const FOOTER_LINKS = [
  { to: "/", label: "Главная" },
  { to: "/services", label: "Услуги" },
  { to: "/cabinet", label: "Кабинет" },
];

export const SOCIAL_PROOF_LETTERS = ["М", "А", "Д", "Е", "С"];
export const FIVE_STARS = [1, 2, 3, 4, 5];
export const STEPS_PROGRESS = ["Принят", "Диагн.", "В работе", "Готов"];
export const MOCKUP_STATS = [
  { l: "Стоимость", v: "4 700 ₽" },
  { l: "Срок", v: "1–2 дня" },
  { l: "Бонусов", v: "+235" },
  { l: "Гарантия", v: "90 дней" },
];

export const HERO_PRIMARY_CTA = {
  to: "/services",
  label: "Выбрать услугу",
  icon: ArrowRight,
};
