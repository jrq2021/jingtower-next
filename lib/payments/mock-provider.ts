/**
 * Mock 支付 Provider
 *
 * 模拟真实支付流程：
 * 1. createPayment → 创建 pending 订单
 * 2. confirmMockPayment → 模拟支付成功/失败
 *
 * 所有订单持久化到内存存储中。
 */

import { generateId, saveOrder, getOrder } from "../repositories/storage";
import type { OrderModel } from "../models";
import { getProduct, type ProductType } from "./products";
import type {
  PaymentProvider,
  CreatePaymentInput,
  CreatePaymentResult,
  QueryPaymentResult,
  ConfirmMockPaymentInput,
  ConfirmMockPaymentResult,
} from "./types";

/* ─── Mock Provider 实现 ─── */

function buildMockProvider(): PaymentProvider {
  return {
    async createPayment(
      input: CreatePaymentInput,
    ): Promise<CreatePaymentResult> {
      const product = getProduct(input.productType);
      const now = new Date().toISOString();

      const order: OrderModel = {
        id: generateId(),
        readingId: input.readingId,
        anonymousId: input.anonymousId ?? null,
        amount: product.amount,
        currency: product.currency,
        productType: input.productType,
        provider: "mock",
        status: "pending",
        createdAt: now,
        paidAt: null,
      };

      saveOrder(order);

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: "pending",
        paymentToken: `mock_token_${order.id}`,
        createdAt: now,
      };
    },

    async queryPayment(orderId: string): Promise<QueryPaymentResult | null> {
      const order = getOrder(orderId);
      if (!order) return null;

      return {
        orderId: order.id,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        productType: order.productType as ProductType,
        readingId: order.readingId,
        createdAt: order.createdAt,
        paidAt: order.paidAt ?? null,
      };
    },

    async confirmMockPayment(
      input: ConfirmMockPaymentInput,
    ): Promise<ConfirmMockPaymentResult> {
      const order = getOrder(input.orderId);

      if (!order) {
        return {
          orderId: input.orderId,
          status: "failed",
          readingId: "",
          unlocked: false,
          message: "订单不存在。",
        };
      }

      // 幂等：已 paid 的订单不再处理
      if (order.status === "paid") {
        return {
          orderId: order.id,
          status: "paid",
          readingId: order.readingId,
          unlocked: true,
          message: "订单已支付，无需重复确认。",
        };
      }

      // 幂等：已 failed 的订单，只有 success 可以覆盖
      if (order.status === "failed" && input.result === "failed") {
        return {
          orderId: order.id,
          status: "failed",
          readingId: order.readingId,
          unlocked: false,
          message: "订单已标记为失败。",
        };
      }

      const now = new Date().toISOString();

      if (input.result === "success") {
        order.status = "paid";
        order.paidAt = now;
        saveOrder(order);

        return {
          orderId: order.id,
          status: "paid",
          readingId: order.readingId,
          unlocked: true,
          message: "支付成功，已解锁完整仪式。",
        };
      } else {
        order.status = "failed";
        saveOrder(order);

        return {
          orderId: order.id,
          status: "failed",
          readingId: order.readingId,
          unlocked: false,
          message: "支付失败，请重试。",
        };
      }
    },
  };
}

/** 创建 mock 支付 provider */
export function createMockPaymentProvider(): PaymentProvider {
  return buildMockProvider();
}
