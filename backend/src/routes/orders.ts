import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { calculateMaxBonusAllowed, BONUS_RATE } from "../lib/bonus.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const createOrderSchema = z.object({
  serviceId: z.string().min(1),
  deviceDescription: z.string().min(5),
  bonusUsed: z.number().int().min(0).default(0),
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Некорректные данные", errors: parsed.error.issues });
  }

  const { serviceId, deviceDescription, bonusUsed } = parsed.data;

  const [user, service] = await Promise.all([
    prisma.user.findUnique({ where: { id: req.auth!.userId } }),
    prisma.service.findUnique({ where: { id: serviceId } }),
  ]);

  if (!user) {
    return res.status(404).json({ message: "Пользователь не найден" });
  }
  if (!service || !service.isActive) {
    return res.status(404).json({ message: "Услуга не найдена" });
  }

  const maxAllowed = Math.min(calculateMaxBonusAllowed(service.price), user.bonusBalance);
  if (bonusUsed > maxAllowed) {
    return res.status(400).json({ message: `Можно списать максимум ${maxAllowed} бонусов` });
  }

  const finalPrice = service.price - bonusUsed;
  const bonusEarned = Math.floor(finalPrice * BONUS_RATE);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId: user.id,
        serviceId: service.id,
        serviceName: service.name,
        serviceBasePrice: service.price,
        finalPrice,
        deviceDescription,
        bonusUsed,
        bonusEarned,
        statusHistory: {
          create: {
            status: "pending",
            comment: "Заявка создана",
          },
        },
      },
    });

    if (bonusUsed > 0) {
      await tx.bonusTransaction.create({
        data: {
          userId: user.id,
          orderId: createdOrder.id,
          amount: -bonusUsed,
          type: "spend",
          description: `Списание бонусов при заказе ${createdOrder.id}`,
        },
      });
    }

    await tx.user.update({
      where: { id: user.id },
      data: {
        bonusBalance: {
          decrement: bonusUsed,
        },
      },
    });

    return createdOrder;
  });

  return res.status(201).json(order);
});

router.get("/my", requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.auth!.userId },
    orderBy: { createdAt: "desc" },
    include: {
      statusHistory: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return res.json(orders);
});

router.get("/:id", requireAuth, async (req, res) => {
  const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: req.auth!.userId },
    include: {
      statusHistory: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!order) {
    return res.status(404).json({ message: "Заказ не найден" });
  }
  return res.json(order);
});

export default router;
