/**
 * AI Provider 抽象层
 *
 * 设计原则：
 * 1. 单入口 callAI() 函数，内部根据环境变量选择 provider
 * 2. 所有错误自动 fallback 到 mock
 * 3. 不暴露 API Key 到前端
 * 4. 支持 OpenAI-compatible API 的通用接口
 */

import {
  FREE_SYSTEM_PROMPT,
  DEEP_SYSTEM_PROMPT,
  freeUserPrompt,
  deepUserPrompt,
} from "./prompts";
import {
  validateFreeAIOutput,
  validateDeepAIOutput,
  type FreeReadingAIOutput,
  type DeepReadingAIOutput,
} from "./schema";
import { createMockReading, createMockDeepResult } from "../content";
import type { Reading, DeepResult, SceneKey } from "../types";

/* ─── 环境变量 ─── */

function getAIConfig() {
  return {
    provider: process.env.AI_PROVIDER || "mock",
    apiKey: process.env.AI_API_KEY || "",
    baseUrl: process.env.AI_BASE_URL || "https://api.deepseek.com/v1",
    model: process.env.AI_MODEL || "deepseek-chat",
    timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || "20000", 10),
  };
}

/* ─── 通用 OpenAI-compatible 请求 ─── */

async function callOpenAICompatible(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const config = getAIConfig();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI API error ${res.status}: ${text.slice(0, 200)}`);
    }

    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI returned empty response");

    return content;
  } finally {
    clearTimeout(timer);
  }
}

/* ─── JSON 解析 ─── */

function safeParseAIJson(raw: string): Record<string, unknown> | null {
  try {
    // 尝试直接解析
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    // 尝试提取 JSON 块
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
    return null;
  }
}

/* ─── 公开 API ─── */

export interface FreeReadingResult {
  reading: Reading;
  source: "mock" | "ai" | "fallback";
}

export interface DeepReadingResult {
  deepResult: DeepResult;
  source: "mock" | "ai" | "fallback";
}

/**
 * 生成免费塔罗解读
 * 优先调用 AI，失败时自动 fallback 到 mock
 */
export async function generateFreeReading(
  scene: SceneKey,
  question: string,
): Promise<FreeReadingResult> {
  const config = getAIConfig();

  // 无 API Key → mock
  if (!config.apiKey || config.provider === "mock") {
    const reading = createMockReading(scene, question);
    reading.source = "mock";
    return { reading, source: "mock" };
  }

  try {
    const raw = await callOpenAICompatible(
      FREE_SYSTEM_PROMPT,
      freeUserPrompt(scene, question),
    );

    const parsed = safeParseAIJson(raw);
    if (!parsed) throw new Error("AI returned invalid JSON");

    // 安全拒答
    if (parsed.safetyFlag === true) {
      const reading = createMockReading(scene, question);
      reading.source = "fallback";
      return { reading, source: "fallback" };
    }

    if (!validateFreeAIOutput(parsed)) {
      throw new Error("AI output missing required fields");
    }

    // 组装 Reading
    const ai = parsed as FreeReadingAIOutput;
    const reading: Reading = {
      id: crypto.randomUUID?.() ?? `ai-${Date.now()}`,
      scene,
      question,
      rewrittenQuestion: ai.rewrittenQuestion ?? question,
      spreadType: "three-card",
      cards: (ai.cards ?? []).map((c) => ({
        name: c.name,
        role: c.role,
        keyword: c.keyword,
        orientation: c.orientation as "正位" | "逆位",
        meaning: c.meaning,
      })),
      freeResult: {
        summary: ai.freeResult?.summary ?? "",
        currentState:
          ai.freeResult?.currentState ?? ai.freeResult?.coreReminder ?? "",
        cardSynthesis: ai.freeResult?.cardSynthesis ?? "",
        insight:
          ai.freeResult?.coreReminder ?? ai.freeResult?.currentState ?? "",
        action: ai.freeResult?.action ?? "",
        risk: ai.freeResult?.risk ?? "",
        paywallTeaser: ai.freeResult?.paywallTeaser ?? "",
      },
      paymentStatus: "free",
      createdAt: new Date().toISOString(),
      source: "ai",
    };

    return { reading, source: "ai" };
  } catch (err) {
    // 任何错误都 fallback，但在开发环境打印真实错误
    console.error("[AI] Free reading generation failed:", err);
    const reading = createMockReading(scene, question);
    reading.source = "fallback";
    return { reading, source: "fallback" };
  }
}

/**
 * 生成深度塔罗报告
 * 优先调用 AI，失败时自动 fallback 到 mock
 */
export async function generateDeepReading(
  scene: SceneKey,
  question: string,
  previousCards: string[],
): Promise<DeepReadingResult> {
  const config = getAIConfig();

  if (!config.apiKey || config.provider === "mock") {
    return { deepResult: createMockDeepResult(scene), source: "mock" };
  }

  try {
    const raw = await callOpenAICompatible(
      DEEP_SYSTEM_PROMPT,
      deepUserPrompt(scene, question, previousCards),
    );

    const parsed = safeParseAIJson(raw);
    if (!parsed || !validateDeepAIOutput(parsed)) {
      throw new Error("Deep AI output invalid");
    }

    const ai = parsed as DeepReadingAIOutput;
    const deepResult: DeepResult = {
      clarifierCard: {
        name: ai.clarifierCard.name,
        role: "盲区",
        keyword: ai.clarifierCard.keyword,
        orientation: ai.clarifierCard.orientation,
        message: ai.clarifierCard.message,
      },
      hiddenMotive: ai.hiddenMotive,
      windows: ai.windows,
      risks: ai.risks,
      actionPlan: ai.actionPlan,
      followUps: ai.followUps,
    };

    return { deepResult, source: "ai" };
  } catch {
    return { deepResult: createMockDeepResult(scene), source: "fallback" };
  }
}
