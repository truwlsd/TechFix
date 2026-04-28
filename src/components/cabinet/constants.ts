import type { ElementType } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
  XCircle,
} from "lucide-react";
import type { OrderStatus } from "../../types/domain";

export const STATUS_MAP: Record<OrderStatus, { label: string; icon: ElementType }> = {
  pending: { label: "Принят", icon: Clock },
  diagnostics: { label: "Диагностика", icon: AlertCircle },
  in_progress: { label: "В работе", icon: Wrench },
  ready: { label: "Готов к выдаче", icon: CheckCircle },
  completed: { label: "Выдан", icon: CheckCircle },
  cancelled: { label: "Отменён", icon: XCircle },
};

export const LEVEL_CONFIG = {
  silver: {
    label: "Серебряный",
    icon: "🥈",
    threshold: 15000,
    nextLabel: "Золото",
  },
  gold: {
    label: "Золотой",
    icon: "🥇",
    threshold: 50000,
    nextLabel: "Платина",
  },
  platinum: {
    label: "Платиновый",
    icon: "💎",
    threshold: null as number | null,
    nextLabel: null as string | null,
  },
};
