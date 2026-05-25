/**
 * POST /api/analytics/track
 *
 * 接收前端埋点事件。
 * 当前 mock 实现，只做基础校验。
 */

import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { AnalyticsEvents } from "@/lib/analytics/types";
import type { AnalyticsEventName } from "@/lib/analytics/types";

const VALID_EVENTS: Set<string> = new Set(Object.values(AnalyticsEvents));

export async function POST(request: Request) {
  /* 1. 解析 body */
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON" },
      { status: 400 },
    );
  }

  /* 2. 校验 event */
  const event = body.event;
  if (typeof event !== "string" || !VALID_EVENTS.has(event)) {
    return NextResponse.json(
      { ok: false, error: "INVALID_EVENT" },
      { status: 400 },
    );
  }

  /* 3. 安全过滤：不接受 question 原文 */
  const safePayload: Record<string, unknown> = {};
  const allowedKeys = [
    "anonymousId",
    "readingId",
    "scene",
    "source",
    "spreadType",
    "paymentStatus",
    "productType",
    "orderId",
    "page",
    "questionLength",
    "safetyCategory",
    "metadata",
  ];

  for (const key of allowedKeys) {
    if (key in body) {
      safePayload[key] = body[key];
    }
  }

  /* 4. 上报 */
  await trackServerEvent(event as AnalyticsEventName, safePayload as Partial<import("@/lib/analytics/types").AnalyticsEvent>);

  return NextResponse.json({ ok: true });
}
