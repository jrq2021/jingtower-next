/**
 * 支付抽象层类型定义
 */

import type { ProductType } from "./products";

/* ─── 支付结果 ─── */

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export interface CreatePaymentInput {
  /** 关联的 reading ID */
  readingId: string;
  /** 产品类型 */
  productType: ProductType;
  /** 匿名用户标识（可选） */
  anonymousId?: string | null;
}

export interface CreatePaymentResult {
  /** 订单 ID */
  orderId: string;
  /** 金额（单位：分） */
  amount: number;
  /** 货币 */
  currency: string;
  /** 订单状态 */
  status: PaymentStatus;
  /** Mock 模式下返回一个确认 URL 或 token */
  paymentToken?: string;
  /** 创建时间 */
  createdAt: string;
}

export interface QueryPaymentResult {
  orderId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  productType: ProductType;
  readingId: string;
  createdAt: string;
  paidAt?: string | null;
}

export interface ConfirmMockPaymentInput {
  orderId: string;
  result: "success" | "failed";
}

export interface ConfirmMockPaymentResult {
  orderId: string;
  status: PaymentStatus;
  readingId: string;
  unlocked: boolean;
  message: string;
}

/* ─── Payment Provider 接口 ─── */

export interface PaymentProvider {
  /** 创建支付订单 */
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;

  /** 查询支付状态 */
  queryPayment(orderId: string): Promise<QueryPaymentResult | null>;

  /** 确认 mock 支付结果（仅 mock provider 使用） */
  confirmMockPayment?(
    input: ConfirmMockPaymentInput,
  ): Promise<ConfirmMockPaymentResult>;
}
