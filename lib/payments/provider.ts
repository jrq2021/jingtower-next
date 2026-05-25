/**
 * 支付 Provider 工厂
 * 根据环境变量或默认选择支付 provider。
 * 当前阶段只使用 mock provider。
 */

import type { PaymentProvider } from "./types";
import { createMockPaymentProvider } from "./mock-provider";

let cachedProvider: PaymentProvider | null = null;

/**
 * 获取当前支付 provider。
 * 当前阶段固定返回 mock provider。
 * 后续可扩展为根据环境变量选择 wechat / alipay / stripe 等。
 */
export function getPaymentProvider(): PaymentProvider {
  if (!cachedProvider) {
    // 当前阶段固定使用 mock provider
    // 后续可根据 process.env.PAYMENT_PROVIDER 切换
    cachedProvider = createMockPaymentProvider();
  }
  return cachedProvider;
}

/**
 * 重置 provider 缓存（主要用于测试）
 */
export function resetPaymentProvider(): void {
  cachedProvider = null;
}
