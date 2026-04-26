import type { BonusLevel } from "@prisma/client";

export const BONUS_RATE = 0.05;
export const MAX_BONUS_SHARE = 0.3;
export const WELCOME_BONUS = 100;

export function getBonusLevel(totalSpent: number): BonusLevel {
  if (totalSpent >= 50000) {
    return "platinum";
  }
  if (totalSpent >= 15000) {
    return "gold";
  }
  return "silver";
}

export function calculateMaxBonusAllowed(price: number): number {
  return Math.floor(price * MAX_BONUS_SHARE);
}
