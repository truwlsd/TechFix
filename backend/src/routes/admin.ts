import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { getBonusLevel } from "../lib/bonus.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

const updateStatusSchema = z.object({
  status: z.enum([
    "pending",
    "diagnostics",
    "in_progress",
    "ready",
    "completed",
    "cancelled",
  ]),
  comment: z.string().max(500).optional(),
});

router.get("/orders", requireAuth, requireAdmin, async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });
  return res.json(orders);
});

router.patch("/orders/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Некорректные данные", errors: parsed.error.issues });
  }

  const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return res.status(404).json({ message: "Заказ не найден" });
  }

  const { status, comment } = parsed.data;
  const shouldAwardBonus = order.status !== "completed" && status === "completed";

  const updated = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status,
        masterComment: comment ?? order.masterComment,
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status,
        comment: comment ?? `Статус изменен на ${status}`,
      },
    });

    if (shouldAwardBonus && order.bonusEarned > 0) {
      const currentUser = await tx.user.findUnique({ where: { id: order.userId } });
      if (!currentUser) {
        throw new Error("User not found for bonus calculation");
      }
      const nextTotalSpent = currentUser.totalSpent + order.finalPrice;
      await tx.user.update({
        where: { id: order.userId },
        data: {
          bonusBalance: { increment: order.bonusEarned },
          totalSpent: nextTotalSpent,
          bonusLevel: getBonusLevel(nextTotalSpent),
        },
      });

      await tx.bonusTransaction.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          amount: order.bonusEarned,
          type: "earn",
          description: `Начисление бонусов за выполненный заказ ${order.id}`,
        },
      });
    }

    return updatedOrder;
  });

  return res.json(updated);
});

router.get("/users/:id/bonus-ledger", requireAuth, requireAdmin, async (req, res) => {
  const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const ledger = await prisma.bonusTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return res.json(ledger);
});

export default router;
