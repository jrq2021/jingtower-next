/**
 * Order Repository
 */

import {
  getOrder,
  saveOrder,
  getOrdersByReadingId,
  updateOrderStatus,
  generateId,
} from "./storage";
import type { OrderModel } from "../models";
import { getProduct, type ProductType } from "../payments/products";

/**
 * 创建订单（pending 状态）
 * 金额由服务端根据 productType 从 products.ts 决定。
 */
export function createOrder(
  readingId: string,
  productType: ProductType,
  anonymousId?: string | null,
): OrderModel {
  const product = getProduct(productType);
  const now = new Date().toISOString();
  const order: OrderModel = {
    id: generateId(),
    readingId,
    anonymousId: anonymousId ?? null,
    amount: product.amount,
    currency: product.currency,
    productType,
    provider: "mock",
    status: "pending",
    createdAt: now,
    paidAt: null,
  };
  saveOrder(order);
  return order;
}

/**
 * 创建 mock 已支付订单（用于 demo / mock_paid 流程）
 * @deprecated 新流程请使用 createOrder + confirmMockPayment
 */
export function createMockOrder(
  readingId: string,
  productType: ProductType,
  anonymousId?: string | null,
): OrderModel {
  const order = createOrder(readingId, productType, anonymousId);
  updateOrderStatus(order.id, "paid", new Date().toISOString());
  order.status = "paid";
  order.paidAt = new Date().toISOString();
  return order;
}

export function findOrderById(id: string): OrderModel | undefined {
  return getOrder(id);
}

export function findOrdersByReadingId(readingId: string): OrderModel[] {
  return getOrdersByReadingId(readingId);
}

export function setOrderStatus(
  id: string,
  status: OrderModel["status"],
  paidAt?: string | null,
): OrderModel | undefined {
  return updateOrderStatus(id, status, paidAt);
}
