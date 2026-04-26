import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/auth.js";
import { getBonusLevel, WELCOME_BONUS } from "../lib/bonus.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().min(6),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const updateProfileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Некорректные данные", errors: parsed.error.issues });
  }

  const { name, email, phone, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Пользователь с таким email уже существует" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      bonusBalance: WELCOME_BONUS,
      bonusLevel: getBonusLevel(0),
      bonusLedger: {
        create: {
          amount: WELCOME_BONUS,
          type: "welcome",
          description: "Приветственные бонусы за регистрацию",
        },
      },
    },
  });

  const token = signToken({ userId: user.id, isAdmin: user.isAdmin });
  return res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bonusBalance: user.bonusBalance,
      bonusLevel: user.bonusLevel,
      totalSpent: user.totalSpent,
      isAdmin: user.isAdmin,
    },
  });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Некорректные данные", errors: parsed.error.issues });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Неверный email или пароль" });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Неверный email или пароль" });
  }

  const token = signToken({ userId: user.id, isAdmin: user.isAdmin });
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bonusBalance: user.bonusBalance,
      bonusLevel: user.bonusLevel,
      totalSpent: user.totalSpent,
      isAdmin: user.isAdmin,
    },
  });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.auth!.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bonusBalance: true,
      bonusLevel: true,
      totalSpent: true,
      isAdmin: true,
      registeredAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "Пользователь не найден" });
  }

  return res.json(user);
});

router.patch("/me", requireAuth, async (req, res) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Некорректные данные", errors: parsed.error.issues });
  }

  const user = await prisma.user.update({
    where: { id: req.auth!.userId },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bonusBalance: true,
      bonusLevel: true,
      totalSpent: true,
      isAdmin: true,
      registeredAt: true,
    },
  });

  return res.json(user);
});

export default router;
