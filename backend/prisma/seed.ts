import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { WELCOME_BONUS } from "../src/lib/bonus.js";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

const services = [
  { id: "laptop-repair", name: "Ремонт ноутбука", price: 1500, description: "Диагностика, замена деталей, чистка" },
  { id: "screen-replacement", name: "Замена экрана", price: 3500, description: "Замена матрицы и калибровка" },
  { id: "keyboard-replace", name: "Замена клавиатуры", price: 1800, description: "Замена клавиатуры или отдельных клавиш" },
  { id: "battery-replace", name: "Замена аккумулятора", price: 2200, description: "Установка нового аккумулятора" },
  { id: "pc-diagnostics", name: "Диагностика ПК", price: 500, description: "Тест компонентов и выявление неисправностей" },
  { id: "pc-clean", name: "Чистка от пыли", price: 900, description: "Профилактика, термопаста и чистка кулеров" },
  { id: "pc-upgrade", name: "Апгрейд компьютера", price: 1000, description: "Подбор и установка комплектующих" },
  { id: "os-install", name: "Установка Windows", price: 1500, description: "Установка и базовая настройка ОС" },
  { id: "virus-removal", name: "Удаление вирусов", price: 1200, description: "Очистка системы от вредоносного ПО" },
  { id: "speed-up", name: "Ускорение ПК", price: 900, description: "Оптимизация системы и автозагрузки" },
  { id: "wifi-setup", name: "Настройка Wi-Fi", price: 700, description: "Настройка роутера и стабильной сети" },
  { id: "data-recovery", name: "Восстановление данных", price: 2500, description: "Восстановление файлов с дисков и флешек" },
  { id: "camera-repair", name: "Ремонт веб-камеры", price: 1200, description: "Ремонт и замена камеры" },
];

async function main() {
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const demoPasswordHash = await bcrypt.hash("demo123", 10);

  await prisma.user.upsert({
    where: { email: "admin@techfix.ru" },
    update: {},
    create: {
      name: "Администратор",
      email: "admin@techfix.ru",
      phone: "+7 (900) 000-00-00",
      passwordHash: adminPasswordHash,
      isAdmin: true,
      bonusBalance: 0,
    },
  });

  await prisma.user.upsert({
    where: { email: "demo@techfix.ru" },
    update: {},
    create: {
      name: "Алексей Иванов",
      email: "demo@techfix.ru",
      phone: "+7 (900) 123-45-67",
      passwordHash: demoPasswordHash,
      bonusBalance: WELCOME_BONUS,
      bonusLedger: {
        create: {
          amount: WELCOME_BONUS,
          type: "welcome",
          description: "Приветственные бонусы за регистрацию",
        },
      },
    },
  });

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: service,
      create: service,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
