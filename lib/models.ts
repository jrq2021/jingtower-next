/**
 * 数据模型定义
 * 为后续接数据库准备的规范化模型
 */

import type { DeepResult, SceneKey, TarotCard } from "./types";
import type { ProductType } from "./payments/products";

// 重新导出 ProductType 保持统一来源
export type { ProductType };

/* ─── Reading ─── */

export interface ReadingModel {
  id: string;
  userId?: string | null;
  anonymousId?: string | null;
  scene: SceneKey;
  question: string;
  rewrittenQuestion: string;
  spreadType: string;
  cards: TarotCard[];
  freeResult: {
    summary: string;
    insight: string;
    action: string;
    paywallTeaser: string;
  };
  deepResult?: DeepResult | null;
  source: "mock" | "ai" | "fallback";
  paymentStatus: "free" | "pending" | "paid" | "mock_paid" | "failed";
  createdAt: string;
  updatedAt: string;
}

/* ─── Order ─── */

export interface OrderModel {
  id: string;
  readingId: string;
  userId?: string | null;
  anonymousId?: string | null;
  amount: number;
  currency: "CNY";
  productType: ProductType;
  provider: "mock" | "wechat" | "alipay" | "stripe" | "other";
  status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
  createdAt: string;
  paidAt?: string | null;
}

/* ─── Unlock ─── */

export interface UnlockModel {
  id: string;
  readingId: string;
  orderId: string;
  unlockType: "deep_reading";
  status: "active" | "revoked";
  createdAt: string;
}
