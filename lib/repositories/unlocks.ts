/**
 * Unlock Repository
 */

import {
  saveUnlock,
  getUnlockByReadingId,
  generateId,
} from "./storage";
import type { UnlockModel } from "../models";

export function createUnlock(
  readingId: string,
  orderId: string,
): UnlockModel {
  const now = new Date().toISOString();
  const unlock: UnlockModel = {
    id: generateId(),
    readingId,
    orderId,
    unlockType: "deep_reading",
    status: "active",
    createdAt: now,
  };
  saveUnlock(unlock);
  return unlock;
}

export function isReadingUnlocked(readingId: string): boolean {
  return !!getUnlockByReadingId(readingId);
}

export function findUnlockByReadingId(
  readingId: string,
): UnlockModel | undefined {
  return getUnlockByReadingId(readingId);
}
