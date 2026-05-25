import { NextResponse } from "next/server";
import { generateDeepReading } from "@/lib/ai/provider";
import { findReadingById, setDeepResult } from "@/lib/repositories/readings";
import { isReadingUnlocked } from "@/lib/repositories/unlocks";
import type { SceneKey } from "@/lib/types";

const VALID_SCENES: SceneKey[] = ["love", "yesno", "choice", "career"];

export async function POST(request: Request) {
  /* 1. 解析 body */
  let body: {
    readingId?: unknown;
    scene?: unknown;
    question?: unknown;
    previousCards?: unknown;
    anonymousId?: unknown;
  };
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON", message: "请求体必须是合法 JSON。" },
      { status: 400 },
    );
  }

  /* 2. 校验 readingId */
  const readingId =
    typeof body.readingId === "string" ? body.readingId : "unknown";

  /* 3. 服务端校验解锁状态 */
  // demo-reading 特殊放行（允许在开发阶段不付费查看）
  const isDemo = readingId === "demo-reading";
  const unlocked = isDemo || isReadingUnlocked(readingId);

  if (!unlocked) {
    // 再检查 reading 本身的 paymentStatus（兼容直接设置的情况）
    const reading = findReadingById(readingId);
    const readingPaid =
      reading?.paymentStatus === "paid" ||
      reading?.paymentStatus === "mock_paid";

    if (!readingPaid) {
      return NextResponse.json(
        {
          error: "PAYMENT_REQUIRED",
          message: "请先完成支付。单次 ¥9.9，3 次包 ¥19.9。",
          deepResult: null,
        },
        { status: 402 },
      );
    }
  }

  /* 4. 校验 scene */
  const scene = (
    typeof body.scene === "string" &&
    VALID_SCENES.includes(body.scene as SceneKey)
      ? body.scene
      : "love"
  ) as SceneKey;

  /* 5. 尝试通过 readingId 查已有 reading */
  const existingReading = findReadingById(readingId);

  /* 6. 前次牌名 */
  const previousCards: string[] = Array.isArray(body.previousCards)
    ? (body.previousCards as string[]).filter(
        (c): c is string => typeof c === "string",
      )
    : (existingReading?.cards.map((c) => c.name) ?? []);

  /* 7. 调用 AI provider */
  const { deepResult, source } = await generateDeepReading(
    scene,
    existingReading?.question ??
      (typeof body.question === "string" ? body.question : ""),
    previousCards,
  );

  /* 8. 保存 deepResult 到 reading */
  setDeepResult(readingId, deepResult);

  return NextResponse.json({
    readingId,
    scene,
    deepResult,
    source,
    unlocked: true,
    unlockedAt: new Date().toISOString(),
  });
}
