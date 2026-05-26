/**
 * AI 输出结构定义和校验
 * 用于验证 AI 返回的 JSON 是否完整
 */

export interface FreeReadingAIOutput {
  safetyFlag: boolean;
  rewrittenQuestion?: string;
  cards?: Array<{
    name: string;
    orientation: "正位" | "逆位";
    role: string;
    keyword: string;
    meaning: string;
  }>;
  freeResult?: {
    summary: string;
    currentState?: string;
    cardSynthesis?: string;
    coreReminder?: string;
    action: string;
    risk?: string;
    paywallTeaser: string;
  };
}

export interface DeepReadingAIOutput {
  clarifierCard: {
    name: string;
    orientation: "正位" | "逆位";
    keyword: string;
    message: string;
  };
  hiddenMotive: string;
  relationshipOrCareerTrend?: string;
  windows: Array<{ label: string; advice: string }>;
  risks: string[];
  actionPlan: string[];
  followUps: string[];
}

/** 校验 free reading AI 返回是否包含必要字段 */
export function validateFreeAIOutput(
  parsed: unknown,
): parsed is FreeReadingAIOutput {
  const p = parsed as Record<string, unknown>;
  if (!p || typeof p !== "object") return false;
  if (typeof p.safetyFlag !== "boolean") return false;
  if (p.safetyFlag === true) return true; // 安全拒答有效

  const cards = Array.isArray(p.cards) ? p.cards : [];
  if (cards.length < 3) return false;
  for (const c of cards) {
    if (!c.name || !c.orientation || !c.keyword) return false;
  }

  const fr = p.freeResult as Record<string, unknown> | undefined;
  if (!fr || !fr.summary || !fr.action || !fr.paywallTeaser) return false;

  return true;
}

/** 校验 deep reading AI 返回是否包含必要字段 */
export function validateDeepAIOutput(
  parsed: unknown,
): parsed is DeepReadingAIOutput {
  const p = parsed as Record<string, unknown>;
  if (!p || typeof p !== "object") return false;

  const cc = p.clarifierCard as Record<string, unknown> | undefined;
  if (!cc || !cc.name || !cc.keyword || !cc.message) return false;

  if (typeof p.hiddenMotive !== "string") return false;
  if (!Array.isArray(p.windows) || p.windows.length < 3) return false;
  if (!Array.isArray(p.risks) || p.risks.length < 2) return false;
  if (!Array.isArray(p.actionPlan) || p.actionPlan.length < 3) return false;
  if (!Array.isArray(p.followUps) || p.followUps.length < 3) return false;

  return true;
}
