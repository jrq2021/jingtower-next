/**
 * 服务端 Analytics 客户端
 *
 * 用于 API Route 中上报事件。
 *
 * 使用方式：
 *   import { trackServerEvent } from "@/lib/analytics/server";
 *   trackServerEvent("safety_blocked", { scene: "love", anonymousId: "xxx" });
 */

import { createMockAnalyticsProvider } from "./mock";
import type { AnalyticsEvent, AnalyticsEventName } from "./types";

let provider = createMockAnalyticsProvider();

/**
 * 服务端埋点入口。
 * 调用永远不抛异常。
 */
export async function trackServerEvent(
  event: AnalyticsEventName,
  payload?: Partial<AnalyticsEvent>,
): Promise<void> {
  try {
    const ev: AnalyticsEvent = {
      event,
      timestamp: new Date().toISOString(),
      anonymousId: payload?.anonymousId || "server",
      ...payload,
    };
    await provider.send(ev);
  } catch {
    // 埋点失败不影响主流程
  }
}

/**
 * 替换 provider
 */
export function setServerAnalyticsProvider(p: typeof provider): void {
  provider = p;
}
