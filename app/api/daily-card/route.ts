/**
 * POST /api/daily-card
 *
 * 每日牌 API：同一 anonymousId 同一天只返回一张每日牌。
 * 当前为 mock 实现，后续可接 AI。
 *
 * 请求：{ anonymousId }
 * 返回：{ date, card, message, action }
 */

import { NextResponse } from "next/server";

/* ─── Mock 牌库 ─── */

const DAILY_CARDS = [
  {
    name: "星星",
    orientation: "正位" as const,
    keyword: "恢复",
    message: "今天适合把注意力放回自己能掌控的一步。",
    action: "完成一个小而明确的行动，不计较结果。",
  },
  {
    name: "太阳",
    orientation: "正位" as const,
    keyword: "确认",
    message: "方向正确，今天适合做出一个明确的推进。",
    action: "把一件拖延的事往前推一步。",
  },
  {
    name: "力量",
    orientation: "正位" as const,
    keyword: "耐心",
    message: "以柔克刚，今天不需要用力，需要信任过程。",
    action: "对一件让你焦虑的事，试着放手半天。",
  },
  {
    name: "魔术师",
    orientation: "正位" as const,
    keyword: "资源",
    message: "你已拥有启动所需的一切，缺的只是第一步。",
    action: "列出三件你已经准备好的资源。",
  },
  {
    name: "节制",
    orientation: "正位" as const,
    keyword: "平衡",
    message: "节奏刚好，今天不宜激进也不宜完全休息。",
    action: "保持当前的节奏，不增不减。",
  },
  {
    name: "隐士",
    orientation: "正位" as const,
    keyword: "审视",
    message: "独处比向外求索更有收获，给自己一点安静的时间。",
    action: "花 10 分钟写下今天脑子里最吵的 3 个念头。",
  },
  {
    name: "女祭司",
    orientation: "正位" as const,
    keyword: "直觉",
    message: "答案早已在你心中，今天适合倾听内在声音。",
    action: "做一个让你身体感觉舒展的决定。",
  },
  {
    name: "月亮",
    orientation: "逆位" as const,
    keyword: "迷雾",
    message: "今天不要急着下结论，所见可能只是投射。",
    action: "把今天的判断放到明天再重新看一遍。",
  },
  {
    name: "命运之轮",
    orientation: "正位" as const,
    keyword: "时机",
    message: "顺势而为比强力控制更有效，机会正在靠近。",
    action: "留意今天出现的意外信息或邀约。",
  },
  {
    name: "世界",
    orientation: "正位" as const,
    keyword: "完成",
    message: "一个周期接近尾声，你已具备进入下一阶段的资本。",
    action: "回顾过去一个月你完成了什么，给自己一个肯定。",
  },
];

/* ─── 简单的内存缓存（同一天返回同一张） ─── */

// key: `${anonymousId}:${date}`, value: card index
const dailyCache = new Map<string, number>();

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10); // "2026-05-25"
}

export async function POST(request: Request) {
  let body: { anonymousId?: unknown };
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON", message: "请求体必须是合法 JSON。" },
      { status: 400 },
    );
  }

  const anonymousId =
    typeof body.anonymousId === "string" ? body.anonymousId.trim() : "";

  if (!anonymousId) {
    return NextResponse.json(
      { error: "MISSING_ANONYMOUS_ID", message: "缺少 anonymousId。" },
      { status: 400 },
    );
  }

  const today = getTodayStr();
  const cacheKey = `${anonymousId}:${today}`;

  let cardIndex = dailyCache.get(cacheKey);
  if (cardIndex === undefined) {
    // 基于 anonymousId + date 的确定性选择（同一人同一天固定一张）
    cardIndex =
      ((hashString(cacheKey) % DAILY_CARDS.length) + DAILY_CARDS.length) %
      DAILY_CARDS.length;
    dailyCache.set(cacheKey, cardIndex);
  }

  const card = DAILY_CARDS[cardIndex];

  return NextResponse.json({
    date: today,
    card: {
      name: card.name,
      orientation: card.orientation,
      keyword: card.keyword,
    },
    message: card.message,
    action: card.action,
  });
}

/** 简单字符串哈希 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
