"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { scenes } from "@/lib/content";
import { getAnonymousId } from "@/lib/anonymous";
import { trackEvent } from "@/lib/analytics/client";
import { MathCurveLoader } from "@/components/MathCurveLoader";
import { TarotCardImage } from "@/components/TarotCardImage";
import type { Reading, SceneKey, TarotCard } from "@/lib/types";

/* ─── constants ─── */

type HistoryItem = {
  id: string;
  scene: string;
  sceneLabel: string;
  question: string;
  cards: Array<{ name: string; orientation?: string }>;
  createdAt: string;
  unlocked: boolean;
};

const GUIDES = ["清醒分析", "温柔陪伴", "关系复盘", "职业决策"] as const;

const DEFAULT_QUESTION = "我和他最近忽冷忽热，我该主动沟通吗？";

/* ─── 首页状态持久化 key ─── */
const HOME_READING_KEY = "jingtower:last-home-reading";

interface HomeReadingState {
  scene: SceneKey;
  question: string;
  guide: string;
  readingData: Reading;
  phase: "revealed";
  drawnCount: number;
}

function saveHomeReading(state: HomeReadingState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HOME_READING_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function loadHomeReading(): HomeReadingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(HOME_READING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HomeReadingState;
    if (
      parsed &&
      parsed.phase === "revealed" &&
      parsed.readingData?.cards?.length
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function clearHomeReading() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(HOME_READING_KEY);
  } catch {
    /* ignore */
  }
}

/* ─── helpers ─── */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      window.localStorage.getItem("jingtower-history") || "[]",
    ) as HistoryItem[];
  } catch {
    return [];
  }
}

function writeHistory(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("jingtower-history", JSON.stringify(items));
}

/* ─── component ─── */

export function TarotRoom() {
  /* 输入状态 */
  const [activeScene, setActiveScene] = useState<SceneKey>("love");
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [guide, setGuide] = useState<string>(GUIDES[0]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  /* API 调用状态 */
  const [apiStatus, setApiStatus] = useState<
    "idle" | "loading" | "success" | "safety_blocked" | "error"
  >("idle");
  const [readingData, setReadingData] = useState<Reading | null>(null);
  const [safetyMessage, setSafetyMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /* 翻牌动画状态机 */
  const [drawnCount, setDrawnCount] = useState(0);
  const [phase, setPhase] = useState<
    "idle" | "collecting" | "shuffling" | "flipping" | "revealed"
  >("idle");

  /* 第四张牌互动提示 */
  const [lockHint, setLockHint] = useState("");
  const lockHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const scene = useMemo(
    () => scenes.find((item) => item.key === activeScene) ?? scenes[0],
    [activeScene],
  );

  /* 改写问题：优先用 API 返回，否则本地生成 */
  const rewrittenQuestion = useMemo(() => {
    if (readingData?.rewrittenQuestion) return readingData.rewrittenQuestion;
    const q = question.trim();
    if (q.length <= 3) return scene.rewrite;
    return `我想复盘「${q}」背后的真实需求、阻力和下一步低风险行动。`;
  }, [question, scene.rewrite, readingData]);

  /* 显示的牌：API 返回优先，否则用场景默认 */
  const displayCards: TarotCard[] = readingData?.cards ?? scene.cards;

  /* cleanup */
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    setHistory(readHistory());
    trackEvent("page_view", { scene: activeScene, page: "/" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── 恢复上次首页阅读状态 ─── */
  useEffect(() => {
    const saved = loadHomeReading();
    if (!saved) return;

    // 恢复场景、问题、引导
    setActiveScene(saved.scene);
    setQuestion(saved.question);
    setGuide(saved.guide);

    // 恢复阅读数据和翻牌状态
    setReadingData(saved.readingData);
    setApiStatus("success");
    setPhase("revealed");
    setDrawnCount(saved.drawnCount);
  }, []); // 只在挂载时执行一次

  /* ─── 动画执行（与 API 解耦） ─── */

  const runFlipAnimation = useCallback((cardsCount: number) => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const reduced = prefersReducedMotion();

    setDrawnCount(0);
    setPhase("collecting");

    if (reduced) {
      timersRef.current.push(
        setTimeout(() => {
          setDrawnCount(cardsCount);
          setPhase("revealed");
        }, 120),
      );
      return;
    }

    // 收拢(300) → 洗牌(400) → 逐张展开+翻牌(stagger 380)
    const collectEnd = 300;
    const shuffleEnd = collectEnd + 400;

    timersRef.current.push(setTimeout(() => setPhase("shuffling"), collectEnd));
    timersRef.current.push(
      setTimeout(() => {
        setDrawnCount(1);
        setPhase("flipping");
      }, shuffleEnd),
    );
    timersRef.current.push(
      setTimeout(() => setDrawnCount(2), shuffleEnd + 380),
    );
    timersRef.current.push(
      setTimeout(() => setDrawnCount(3), shuffleEnd + 380 * 2),
    );
    timersRef.current.push(
      setTimeout(() => setPhase("revealed"), shuffleEnd + 380 * 2 + 450),
    );
  }, []);

  /* ─── 核心流程：调 API → 写历史 → 启动画 ─── */

  const drawCards = useCallback(async () => {
    // 取消上一次未完成的请求
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // 清除旧的首页阅读状态（用户主动重新抽牌）
    clearHomeReading();

    // 重置所有状态
    timersRef.current.forEach(clearTimeout);
    setDrawnCount(0);
    setPhase("idle");
    setReadingData(null);
    setSafetyMessage("");
    setErrorMessage("");
    setApiStatus("loading");

    const q = question.trim() || scene.rewrite;

    // 埋点：开始解读
    trackEvent("start_reading", {
      scene: activeScene,
      questionLength: q.length,
    });

    try {
      const res = await fetch("/api/reading/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scene: activeScene,
          question: q,
          anonymousId: getAnonymousId(),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as Record<
          string,
          unknown
        >;
        // 安全拦截
        if (body.safetyFlag) {
          const safetyMsg =
            typeof body.message === "string"
              ? body.message
              : "此问题不适合塔罗解读。";
          setSafetyMessage(safetyMsg);
          setApiStatus("safety_blocked");
          setPhase("idle");
          // 埋点：安全拒答
          trackEvent("safety_blocked", {
            scene: activeScene,
            questionLength: q.length,
            metadata: { safetyMessage: safetyMsg },
          });
          return;
        }
        // 其他 4xx/5xx
        setErrorMessage(
          typeof body.message === "string"
            ? body.message
            : `服务器返回错误 (${res.status})`,
        );
        setApiStatus("error");
        setPhase("idle");
        return;
      }

      const data = (await res.json()) as {
        safetyFlag: boolean;
        reading: Reading;
      };
      const reading = data.reading;

      if (!reading?.cards?.length) {
        throw new Error("API 返回数据不完整");
      }

      setReadingData(reading);
      setApiStatus("success");

      // 埋点：抽牌成功
      trackEvent("draw_cards", {
        scene: reading.scene,
        readingId: reading.id,
        source: reading.source,
        spreadType: reading.spreadType,
      });

      // 埋点：问题改写（如果有改写）
      if (reading.rewrittenQuestion && reading.rewrittenQuestion !== q) {
        trackEvent("rewrite_question", {
          scene: reading.scene,
          readingId: reading.id,
          questionLength: q.length,
        });
      }

      // 持久化：存到 localStorage 供报告页读取
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "jingtower-last-reading",
          JSON.stringify(reading),
        );

        // 持久化首页阅读状态（用于返回首页时恢复牌面）
        saveHomeReading({
          scene: activeScene,
          question: q,
          guide: guide,
          readingData: reading,
          phase: "revealed",
          drawnCount: reading.cards.length,
        });
      }

      // 写入历史（完整记录）
      const newRecord: HistoryItem = {
        id: reading.id,
        scene: activeScene,
        sceneLabel: scene.label,
        question: q,
        cards: reading.cards.map((c) => ({
          name: c.name,
          orientation: c.orientation,
        })),
        createdAt: reading.createdAt || new Date().toISOString(),
        unlocked: false,
      };
      const filtered = history.filter((h) => h.id !== reading.id);
      const nextHistory = [newRecord, ...filtered].slice(0, 5);
      setHistory(nextHistory);
      writeHistory(nextHistory);

      // 启动翻牌动画
      runFlipAnimation(reading.cards.length);
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      const msg =
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "网络连接失败，请检查网络后重试。"
          : err instanceof Error
            ? err.message
            : "未知错误，请稍后重试。";
      setErrorMessage(msg);
      setApiStatus("error");
      setPhase("idle");
    }
  }, [question, activeScene, scene, history, guide, runFlipAnimation]);

  // 埋点：免费结果展示（phase 变为 revealed 时）
  useEffect(() => {
    if (phase === "revealed" && readingData) {
      trackEvent("view_free_result", {
        scene: readingData.scene,
        readingId: readingData.id,
        source: readingData.source,
      });
    }
  }, [phase, readingData]);

  /* 切换场景时重置 */
  const switchScene = useCallback((key: SceneKey) => {
    clearHomeReading();
    setActiveScene(key);
    setDrawnCount(0);
    setPhase("idle");
    setApiStatus("idle");
    setReadingData(null);
    setSafetyMessage("");
    setErrorMessage("");
    setLockHint("");
    timersRef.current.forEach(clearTimeout);
    abortRef.current?.abort();
  }, []);

  /* ─── 第四张牌点击逻辑 ─── */

  const checkReadingUnlocked = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    if (!readingData?.id) return false;
    try {
      // 检查全局解锁状态
      const raw = window.localStorage.getItem("jingtower-unlock-state");
      if (raw) {
        const state = JSON.parse(raw) as { readingId?: string };
        if (state.readingId === readingData.id) return true;
        // 兼容旧版 mock-paid 标记
      }
    } catch {
      /* ignore */
    }
    try {
      if (window.localStorage.getItem("jingtower-mock-paid")) return true;
    } catch {
      /* ignore */
    }
    return readingData.paymentStatus !== "free";
  }, [readingData]);

  const handleLockedCardClick = useCallback(() => {
    // 清除旧提示
    if (lockHintTimerRef.current) {
      clearTimeout(lockHintTimerRef.current);
    }

    // 状态 1：还没有抽牌 / 正在抽牌中
    if (!readingData) {
      setLockHint("请先完成三张牌开卡，再解锁澄清牌。");
      lockHintTimerRef.current = setTimeout(() => setLockHint(""), 4000);
      return;
    }

    // 状态 2：已抽牌但还没翻完
    if (phase !== "revealed") {
      setLockHint("正在生成本次报告，请稍后再试。");
      lockHintTimerRef.current = setTimeout(() => setLockHint(""), 4000);
      return;
    }

    // 状态 3：已抽牌，有 readingId，检查是否已解锁
    if (checkReadingUnlocked()) {
      // 已解锁 → 跳转报告页
      window.location.href = `/reading/${readingData.id}`;
      return;
    }

    // 状态 4：已抽牌，未解锁 → 跳转付费页
    window.location.href = `/pricing?readingId=${encodeURIComponent(readingData.id)}&product=single_deep_reading`;
  }, [readingData, phase, checkReadingUnlocked]);

  // cleanup lockHintTimer
  useEffect(() => {
    return () => {
      if (lockHintTimerRef.current) clearTimeout(lockHintTimerRef.current);
    };
  }, []);

  /* ─── 计算状态 ─── */

  const isDrawn = phase !== "idle";
  const isBusy =
    apiStatus === "loading" ||
    phase === "collecting" ||
    phase === "shuffling" ||
    phase === "flipping";

  const buttonLabel =
    apiStatus === "loading"
      ? "正在解读…"
      : phase === "collecting"
        ? "收拢卡牌…"
        : phase === "shuffling"
          ? "洗牌中…"
          : phase === "flipping"
            ? "翻牌中…"
            : phase === "revealed"
              ? "重新洗牌"
              : "改写问题并洗牌";

  const cardPositions = ["one", "two", "three"] as const;

  return (
    <>
      <section className="hero-room" id="room" aria-label="AI 塔罗牌室">
        {/* ── 左栏：输入区 ── */}
        <div className="room-copy">
          <h1>AI 塔罗牌室</h1>
          <p>
            先把问题问清楚，再抽三张牌。免费给到可行动的洞察，完整仪式解锁第四张澄清牌和
            7 日行动剧本。
          </p>

          <div className="scene-tabs" aria-label="场景入口">
            {scenes.map((item) => (
              <button
                className={
                  item.key === activeScene ? "scene-tab active" : "scene-tab"
                }
                key={item.key}
                onClick={() => switchScene(item.key)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <label className="question-box">
            <span>写下你正在卡住的事</span>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="比如：我和他最近忽冷忽热，我该主动沟通吗？"
              maxLength={200}
            />
            <span className="char-count">{question.length}/200</span>
          </label>

          <div className="guide-section">
            <div className="guide-row" aria-label="AI 引导者选择">
              {GUIDES.map((item) => (
                <button
                  className={
                    item === guide ? "guide-chip active" : "guide-chip"
                  }
                  key={item}
                  onClick={() => setGuide(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rewrite-card" aria-live="polite">
            <span>AI 改写 · {guide}</span>
            <p>{rewrittenQuestion}</p>
          </div>

          <div className="room-actions">
            <button
              className={`draw-button${isBusy ? " is-busy" : ""}`}
              onClick={drawCards}
              disabled={isBusy}
              type="button"
            >
              {buttonLabel}
            </button>
            {phase === "revealed" && readingData && (
              <Link
                className="button ghost"
                href={`/reading/${readingData.id}`}
              >
                查看完整报告
              </Link>
            )}
          </div>
          <p className="safety-hint">
            仅作娱乐与自我探索参考。医疗、法律、投资、自伤风险等问题应寻求专业帮助。
          </p>

          {/* 拒答提示 */}
          {apiStatus === "safety_blocked" && (
            <div className="safety-blocked" role="alert">
              <strong>此问题不适合塔罗解读</strong>
              <p>{safetyMessage}</p>
            </div>
          )}
        </div>

        {/* ── 右栏：卡牌舞台 + 洞察 ── */}
        <div className="room-stage" aria-label="洗牌开卡舞台">
          <div className="stage-topline">
            <span>三牌阵 · {scene.label}</span>
            <span>第 4 张待解锁</span>
          </div>

          <div
            className={`card-stage${phase === "idle" ? " is-idle" : ""}${isDrawn ? " is-drawn" : ""}${phase === "collecting" ? " is-collecting" : ""}${phase === "shuffling" ? " is-shuffling" : ""}${phase === "revealed" ? " is-revealed" : ""}`}
          >
            <div className="stage-rings" aria-hidden="true" />

            {/* 数学曲线 loader：API 加载中或洗牌翻牌中 */}
            {(apiStatus === "loading" ||
              phase === "collecting" ||
              phase === "shuffling" ||
              phase === "flipping") && (
              <div className="card-stage-loader" aria-hidden="true">
                <MathCurveLoader
                  variant={apiStatus === "loading" ? "lemniscate" : "rose"}
                  size={140}
                  label=""
                  tone="gold"
                  active={true}
                />
              </div>
            )}

            {displayCards.slice(0, 3).map((card, index) => {
              const flipped = drawnCount > index;
              return (
                <article
                  className={`tarot-card card-${cardPositions[index]}${flipped ? " flipped" : ""}`}
                  key={`${card.name}-${index}`}
                  style={{
                    transitionDelay: flipped ? `${index * 0.15}s` : "0s",
                  }}
                >
                  <div className="card-inner">
                    <div className="card-back">
                      <TarotCardImage card={card} revealed={false} size="sm" />
                    </div>
                    <div className="card-face">
                      <TarotCardImage
                        card={card}
                        revealed={true}
                        size="sm"
                        overlayLabel={true}
                      />
                    </div>
                  </div>
                </article>
              );
            })}

            <button
              className={`tarot-card card-locked${readingData ? " has-reading" : ""}${checkReadingUnlocked() ? " is-unlocked" : ""}`}
              aria-label={
                checkReadingUnlocked()
                  ? "查看第四张澄清牌（已解锁）"
                  : readingData
                    ? "解锁第四张澄清牌 ¥9.9"
                    : "先抽三张牌后解锁澄清牌"
              }
              onClick={handleLockedCardClick}
              type="button"
            >
              <div className="card-inner">
                <div className="card-back">
                  <TarotCardImage
                    card={{
                      name: "澄清牌",
                      role: "第四张",
                      keyword: "盲区提醒",
                      image: "",
                      backImage: "/tarot/deck-v1/backs/default.webp",
                      alt: "澄清牌背面",
                    }}
                    revealed={false}
                    locked={true}
                    lockedLabel={
                      checkReadingUnlocked()
                        ? "查看澄清牌"
                        : readingData
                          ? "解锁澄清牌"
                          : "先抽三张牌"
                    }
                    size="sm"
                  />
                </div>
              </div>
            </button>
          </div>

          {/* 洞察区 */}
          <div
            className={`reading-preview${phase === "revealed" ? " is-revealed" : ""}`}
          >
            {/* 第四张牌提示 */}
            {lockHint && (
              <div className="lock-hint" role="status" aria-live="polite">
                <span>{lockHint}</span>
              </div>
            )}

            {/* 状态 1：API 报错 */}
            {apiStatus === "error" && (
              <div className="insight-error" role="alert">
                <strong>暂时无法生成洞察</strong>
                <p>{errorMessage}</p>
                <button
                  className="button ghost"
                  onClick={() => {
                    setApiStatus("idle");
                    setErrorMessage("");
                  }}
                  type="button"
                >
                  重试
                </button>
              </div>
            )}

            {/* 状态 2：安全拒答 */}
            {apiStatus === "safety_blocked" && (
              <div className="insight-safety" role="alert">
                <span className="mini-label">温馨提示</span>
                <p>此问题不适合用塔罗解读。请优先寻求专业帮助。</p>
              </div>
            )}

            {/* 状态 3：成功且翻牌完毕 */}
            {phase === "revealed" && readingData && (
              <div className="insight-body">
                <span className="mini-label">免费洞察已生成</span>
                <h2>{readingData.freeResult.summary}</h2>
                <p className="insight-summary">
                  {readingData.freeResult.insight}
                </p>

                <div className="insight-cards">
                  {readingData.cards.map((card, i) => (
                    <div className="insight-mini" key={`${card.name}-${i}`}>
                      <strong>
                        {card.name}{" "}
                        <span className="orient-tag">{card.orientation}</span>
                      </strong>
                      <span>
                        {card.role} · {card.keyword}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="insight-action">
                  <span className="mini-label">今日行动</span>
                  <p>{readingData.freeResult.action}</p>
                </div>

                <div className="insight-teaser">
                  <span>{readingData.freeResult.paywallTeaser}</span>
                </div>
              </div>
            )}

            {/* 状态 4：等待抽牌（idle / loading / shuffling / flipping 且未 revealed） */}
            {phase !== "revealed" &&
              apiStatus !== "error" &&
              apiStatus !== "safety_blocked" && (
                <div className="insight-placeholder">
                  <span className="mini-label">免费洞察</span>
                  <h2>
                    {apiStatus === "loading"
                      ? "AI 正在解读你的问题…"
                      : "写下问题，改写，然后抽牌"}
                  </h2>
                  <p>
                    {apiStatus === "loading"
                      ? "正在根据你选择的场景生成改写和牌面，请稍候。"
                      : "三张牌翻开后，这里将展示当前状态、核心提醒和一个今日可执行的行动建议。"}
                  </p>
                </div>
              )}

            {/* 付费按钮：仅在成功翻牌后显示 */}
            {phase === "revealed" && readingData && (
              <Link
                className="button primary"
                href={`/pricing?readingId=${encodeURIComponent(readingData.id)}&product=single_deep_reading`}
              >
                解锁完整仪式 ¥9.9
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── 本地历史 ── */}
      <section className="history-panel" aria-label="最近开卡记录">
        <div>
          <span className="mini-label">开卡记录</span>
          <h2>最近开卡</h2>
          <p>保存在你的浏览器中，刷新后仍在，方便随时回看。</p>
        </div>
        <ol className="history-list">
          {history.length ? (
            history.map((item, index) => (
              <li key={`${item.scene}-${index}`}>
                <span className="hist-scene">{item.scene}</span>
                <span className="hist-question">{item.question}</span>
              </li>
            ))
          ) : (
            <li className="hist-empty">还没有记录 — 先开一次牌试试。</li>
          )}
        </ol>
      </section>
    </>
  );
}
