import { NextResponse } from "next/server";
import { getSafetyFlag } from "@/lib/safety";
import { generateFreeReading } from "@/lib/ai/provider";
import { createReading } from "@/lib/repositories/readings";
import { trackServerEvent } from "@/lib/analytics/server";
import type { SceneKey } from "@/lib/types";

const VALID_SCENES: SceneKey[] = ["love", "yesno", "choice", "career"];

export async function POST(request: Request) {
  /* 1. 解析 body */
  let body: {
    scene?: unknown;
    question?: unknown;
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

  /* 2. 校验 scene */
  const scene = (
    typeof body.scene === "string" &&
    VALID_SCENES.includes(body.scene as SceneKey)
      ? body.scene
      : "love"
  ) as SceneKey;

  /* 3. 校验 question */
  const rawQuestion =
    typeof body.question === "string" ? body.question.trim() : "";
  if (!rawQuestion) {
    return NextResponse.json(
      { error: "EMPTY_QUESTION", message: "请写下你想探索的问题，不能为空。" },
      { status: 400 },
    );
  }
  if (rawQuestion.length > 500) {
    return NextResponse.json(
      { error: "QUESTION_TOO_LONG", message: "问题长度不能超过 500 字。" },
      { status: 400 },
    );
  }

  /* 4. 安全拦截 */
  const safety = getSafetyFlag(rawQuestion);
  if (safety.blocked) {
    // 服务端埋点：安全拒答
    trackServerEvent("safety_blocked", {
      scene,
      anonymousId: typeof body.anonymousId === "string" ? body.anonymousId : undefined,
      questionLength: rawQuestion.length,
      safetyCategory: safety.category ?? "unknown",
    });

    return NextResponse.json(
      { safetyFlag: true, message: safety.message, reading: null },
      { status: 400 },
    );
  }

  /* 5. 调用 AI provider */
  const { reading: generated, source } = await generateFreeReading(
    scene,
    rawQuestion,
  );

  /* 6. 通过 repository 持久化 */
  const anonymousId =
    typeof body.anonymousId === "string" ? body.anonymousId : null;
  const reading = createReading({
    scene: generated.scene,
    question: generated.question,
    rewrittenQuestion: generated.rewrittenQuestion,
    spreadType: generated.spreadType,
    cards: generated.cards,
    freeResult: generated.freeResult,
    source: generated.source ?? source,
    paymentStatus: "free",
    anonymousId,
  });

  return NextResponse.json({ safetyFlag: false, reading, source });
}
