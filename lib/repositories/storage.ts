/**
 * 内存存储引擎
 * 当前阶段：Map 内存存储 + localStorage 辅助持久化
 * 后续可替换为 Supabase / Postgres adapter
 */

import type { ReadingModel, OrderModel, UnlockModel } from "../models";

/* ─── 内存存储 ─── */

const readingsStore = new Map<string, ReadingModel>();
const ordersStore = new Map<string, OrderModel>();
const unlocksStore = new Map<string, UnlockModel>();

/* ─── Reading ─── */

export function getReading(id: string): ReadingModel | undefined {
  return readingsStore.get(id);
}

export function saveReading(reading: ReadingModel): void {
  readingsStore.set(reading.id, { ...reading });
}

export function updateReadingPaymentStatus(
  id: string,
  status: ReadingModel["paymentStatus"],
): ReadingModel | undefined {
  const r = readingsStore.get(id);
  if (!r) return undefined;
  r.paymentStatus = status;
  r.updatedAt = new Date().toISOString();
  readingsStore.set(id, r);
  return r;
}

export function updateReadingDeepResult(
  id: string,
  deepResult: ReadingModel["deepResult"],
): ReadingModel | undefined {
  const r = readingsStore.get(id);
  if (!r) return undefined;
  r.deepResult = deepResult ?? undefined;
  r.updatedAt = new Date().toISOString();
  readingsStore.set(id, r);
  return r;
}

/* ─── Order ─── */

export function getOrder(id: string): OrderModel | undefined {
  return ordersStore.get(id);
}

export function saveOrder(order: OrderModel): void {
  ordersStore.set(order.id, { ...order });
}

export function updateOrderStatus(
  id: string,
  status: OrderModel["status"],
  paidAt?: string | null,
): OrderModel | undefined {
  const o = ordersStore.get(id);
  if (!o) return undefined;
  o.status = status;
  if (paidAt !== undefined) o.paidAt = paidAt;
  ordersStore.set(id, o);
  return o;
}

export function getOrdersByReadingId(readingId: string): OrderModel[] {
  const results: OrderModel[] = [];
  for (const o of ordersStore.values()) {
    if (o.readingId === readingId) results.push(o);
  }
  return results;
}

/* ─── Unlock ─── */

export function getUnlock(id: string): UnlockModel | undefined {
  return unlocksStore.get(id);
}

export function saveUnlock(unlock: UnlockModel): void {
  unlocksStore.set(unlock.id, { ...unlock });
}

export function getUnlockByReadingId(
  readingId: string,
): UnlockModel | undefined {
  for (const u of unlocksStore.values()) {
    if (u.readingId === readingId && u.status === "active") return u;
  }
  return undefined;
}

/* ─── 辅助：生成 ID ─── */

export function generateId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
