/**
 * 前端 Analytics 客户端
 *
 * 使用方式：
 *   import { trackEvent } from "@/lib/analytics/client";
 *   trackEvent("start_reading", { scene: "love", readingId: "xxx" });
 *
 * 设计原则：
 * 1. 埋点失败不阻塞主流程
 * 2. 不上报完整 question
 * 3. 自动附加 anonymousId 和 page
 * 4. 优先本地 mock，后续可切换到 HTTP 上报
 */

import { getAnonymousId } from "../anonymous";
import { AnalyticsEvents } from "./types";
import type { AnalyticsEvent, AnalyticsEventName } from "./types";
import { createMockAnalyticsProvider } from "./mock";

/* ─── Provider 选择 ─── */

let provider = createMockAnalyticsProvider();

/**
 * 构建标准事件载荷。
 * 自动填充 anonymousId、timestamp、page。
 */
function buildEvent(
  event: AnalyticsEventName,
  payload?: Partial<AnalyticsEvent>,
): AnalyticsEvent {
  return {
    event,
    timestamp: new Date().toISOString(),
    anonymousId: getAnonymousId(),
    page: typeof window !== "undefined" ? window.location.pathname : "/",
    ...payload,
  };
}

/**
 * 前端埋点入口。
 * 调用永远不抛异常，失败时静默忽略。
 */
export async function trackEvent(
  event: AnalyticsEventName,
  payload?: Partial<AnalyticsEvent>,
): Promise<void> {
  try {
    const ev = buildEvent(event, payload);
    await provider.send(ev);
  } catch {
    // 埋点失败不影响主流程
  }
}

/**
 * 便捷方法：页面浏览
 */
export function trackPageView(page?: string): void {
  trackEvent(AnalyticsEvents.PAGE_VIEW, { page });
}

/**
 * 替换 provider（后续接真实平台时使用）
 */
export function setAnalyticsProvider(p: typeof provider): void {
  provider = p;
}
