import { Router } from "express";
import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

const sendMessageSchema = z.object({
  text: z.string().trim().min(1).max(1000),
  clientId: z.string().trim().min(8).max(64).optional(),
});

function sendError(
  res: Response,
  status: number,
  code: string,
  message: string
) {
  return res.status(status).json({ code, message });
}

const sendWindowMs = 60_000;
const sendMinGapMs = 700;
const sendLimitPerWindow = 15;
const sendTracker = new Map<string, { lastAt: number; sentAt: number[] }>();

function checkSendRateLimit(key: string) {
  const now = Date.now();
  const state = sendTracker.get(key) ?? { lastAt: 0, sentAt: [] };
  state.sentAt = state.sentAt.filter((ts) => now - ts <= sendWindowMs);

  if (now - state.lastAt < sendMinGapMs) {
    sendTracker.set(key, state);
    return { ok: false, retryAfterMs: sendMinGapMs - (now - state.lastAt) };
  }
  if (state.sentAt.length >= sendLimitPerWindow) {
    sendTracker.set(key, state);
    return { ok: false, retryAfterMs: sendWindowMs };
  }

  state.lastAt = now;
  state.sentAt.push(now);
  sendTracker.set(key, state);
  return { ok: true, retryAfterMs: 0 };
}

router.get("/my", requireAuth, async (req, res) => {
  const userId = req.auth!.userId;
  await prisma.chatMessage.updateMany({
    where: {
      userId,
      senderRole: "admin",
      readByUser: false,
    },
    data: { readByUser: true },
  });

  const messages = await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return res.json(messages);
});

router.post("/my", requireAuth, async (req, res) => {
  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      code: "INVALID_PAYLOAD",
      message: "Некорректные данные",
      errors: parsed.error.issues,
    });
  }

  const userId = req.auth!.userId;
  const limitCheck = checkSendRateLimit(`user:${userId}`);
  if (!limitCheck.ok) {
    res.setHeader("Retry-After", String(Math.ceil(limitCheck.retryAfterMs / 1000)));
    return sendError(res, 429, "RATE_LIMITED", "Слишком часто отправляете сообщения");
  }

  if (parsed.data.clientId) {
    const existing = await prisma.chatMessage.findFirst({
      where: { userId, clientId: parsed.data.clientId },
    });
    if (existing) {
      return res.status(200).json(existing);
    }
  }

  const message = await prisma.chatMessage.create({
    data: {
      userId,
      clientId: parsed.data.clientId,
      senderRole: "user",
      text: parsed.data.text,
      readByUser: true,
      readByAdmin: false,
    },
  });

  return res.status(201).json(message);
});

router.get("/admin/threads", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      chatMessages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { text: true, createdAt: true },
      },
      _count: {
        select: {
          chatMessages: {
            where: {
              senderRole: "user",
              readByAdmin: false,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const threads = rows
    .filter((row) => row.chatMessages.length > 0)
    .map((row) => ({
      userId: row.id,
      userName: row.name,
      userEmail: row.email,
      lastMessage: row.chatMessages[0]?.text ?? "",
      lastMessageAt: row.chatMessages[0]?.createdAt ?? null,
      unreadForAdmin: row._count.chatMessages,
    }))
    .sort((a, b) => {
      const at = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bt = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bt - at;
    });

  return res.json(threads);
});

router.get("/admin/:userId", requireAuth, requireAdmin, async (req, res) => {
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  await prisma.chatMessage.updateMany({
    where: {
      userId,
      senderRole: "user",
      readByAdmin: false,
    },
    data: { readByAdmin: true },
  });

  const messages = await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return res.json(messages);
});

router.post("/admin/:userId", requireAuth, requireAdmin, async (req, res) => {
  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      code: "INVALID_PAYLOAD",
      message: "Некорректные данные",
      errors: parsed.error.issues,
    });
  }

  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const limitCheck = checkSendRateLimit(`admin:${req.auth!.userId}:${userId}`);
  if (!limitCheck.ok) {
    res.setHeader("Retry-After", String(Math.ceil(limitCheck.retryAfterMs / 1000)));
    return sendError(res, 429, "RATE_LIMITED", "Слишком часто отправляете сообщения");
  }

  const userExists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!userExists) {
    return sendError(res, 404, "USER_NOT_FOUND", "Пользователь не найден");
  }

  if (parsed.data.clientId) {
    const existing = await prisma.chatMessage.findFirst({
      where: { userId, clientId: parsed.data.clientId },
    });
    if (existing) {
      return res.status(200).json(existing);
    }
  }

  const message = await prisma.chatMessage.create({
    data: {
      userId,
      clientId: parsed.data.clientId,
      senderRole: "admin",
      text: parsed.data.text,
      readByUser: false,
      readByAdmin: true,
    },
  });

  return res.status(201).json(message);
});

export default router;
