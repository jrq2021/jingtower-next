import { NextResponse } from "next/server";
import { findReadingById } from "@/lib/repositories/readings";

type ShareCardInput = {
  readingId?: unknown;
  scene?: unknown;
  cards?: unknown;
  summary?: unknown;
};

export async function POST(request: Request) {
  let body: ShareCardInput;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON", message: "请求体必须是合法 JSON。" },
      { status: 400 },
    );
  }

  /* 优先通过 readingId 查 reading */
  let sceneTitle = "塔罗牌阵";
  let safeCards: Array<{ name: string; keyword: string }> = [];
  let summary = "今天的关键词：自我探索与行动复盘。";

  const sceneLabels: Record<string, string> = {
    love: "爱情塔罗",
    yesno: "是否塔罗",
    choice: "二选一",
    career: "职业选择",
  };

  const readingId = typeof body.readingId === "string" ? body.readingId : null;
  if (readingId) {
    const reading = findReadingById(readingId);
    if (reading) {
      sceneTitle = sceneLabels[reading.scene] ?? sceneTitle;
      safeCards = reading.cards.map((c) => ({
        name: c.name,
        keyword: c.keyword,
      }));
      summary = reading.freeResult.summary;
    }
  }

  /* fallback: 使用请求中的 cards / scene / summary */
  if (safeCards.length < 3) {
    const cards = Array.isArray(body.cards) ? body.cards : [];
    if (cards.length < 3) {
      return NextResponse.json(
        { error: "MISSING_CARDS", message: "至少需要三张牌来生成分享卡。" },
        { status: 400 },
      );
    }
    safeCards = cards.slice(0, 3).map((c: Record<string, unknown>) => ({
      name: typeof c.name === "string" ? c.name : "?",
      keyword: typeof c.keyword === "string" ? c.keyword : "",
    }));

    const scene = typeof body.scene === "string" ? body.scene : "love";
    sceneTitle = sceneLabels[scene] ?? sceneTitle;
  }

  if (typeof body.summary === "string" && body.summary.trim()) {
    summary = body.summary.trim();
  }

  return NextResponse.json({
    status: "mock",
    privacySafe: true,
    imageUrl: null,
    poster: {
      title: sceneTitle,
      cards: safeCards.map((c) => c.name),
      keywords: safeCards.map((c) => c.keyword),
      summary,
      brand: "镜塔 Tarot",
    },
    cta: "也抽一组三牌",
    landingPath: "/#room",
    message:
      "当前为 mock 分享卡，正式版可接入 Satori、Canvas、html-to-image 或服务端截图生成 1080x1440 中文海报。",
  });
}
