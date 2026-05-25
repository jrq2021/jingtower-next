/**
 * Mock Analytics Provider
 *
 * 将事件输出到 console 并存入内存缓冲区。
 * 后续可替换为 Plausible / PostHog / GA 等。
 */

import type { AnalyticsEvent, AnalyticsProvider } from "./types";

/* ─── 内存存储（开发调试用） ─── */

const eventBuffer: AnalyticsEvent[] = [];
const MAX_BUFFER = 500;

export function getMockEventBuffer(): readonly AnalyticsEvent[] {
  return eventBuffer;
}

export function clearMockEventBuffer(): void {
  eventBuffer.length = 0;
}

/* ─── Mock Provider ─── */

export function createMockAnalyticsProvider(): AnalyticsProvider {
  return {
    async send(event: AnalyticsEvent): Promise<void> {
      const enriched = {
        ...event,
        timestamp: event.timestamp || new Date().toISOString(),
      };

      // 开发模式输出到 console
      if (typeof console !== "undefined") {
        console.log(
          `[analytics] ${enriched.event}`,
          JSON.stringify({
            anonymousId: enriched.anonymousId?.slice(0, 12),
            readingId: enriched.readingId?.slice(0, 8),
            scene: enriched.scene,
            page: enriched.page,
            source: enriched.source,
            metadata: enriched.metadata,
          }),
        );
      }

      // 存入内存缓冲区
      eventBuffer.push(enriched);
      if (eventBuffer.length > MAX_BUFFER) {
        eventBuffer.shift();
      }
    },

    async sendBatch(events: AnalyticsEvent[]): Promise<void> {
      for (const event of events) {
        await this.send(event);
      }
    },

    async flush(): Promise<void> {
      // mock: no-op
    },
  };
}
