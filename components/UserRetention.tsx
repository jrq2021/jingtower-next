"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getAnonymousId } from "@/lib/anonymous";
import { TarotCardImage } from "@/components/TarotCardImage";

/* ─── helpers ─── */

function dailyCardImagePath(name: string): string {
  const slugMap: Record<string, string> = {
    星星: "star",
    太阳: "sun",
    力量: "strength",
    魔术师: "magician",
    节制: "temperance",
    隐士: "hermit",
    女祭司: "high-priestess",
    月亮: "moon",
    恋人: "lovers",
    正义: "justice",
    战车: "chariot",
    高塔: "tower",
    愚者: "fool",
    死神: "death",
    世界: "world",
    审判: "judgement",
    倒吊人: "hanged-man",
    皇帝: "emperor",
    皇后: "empress",
    教皇: "hierophant",
    命运之轮: "wheel-of-fortune",
    恶魔: "devil",
    星币八: "pentacles",
  };
  const slug = slugMap[name];
  return slug ? `/tarot/deck-v1/major/${slug}.webp` : "";
}

/* ─── types ─── */

interface HistoryRecord {
  id: string;
  scene: string;
  sceneLabel: string;
  question: string;
  cards: Array<{ name: string; orientation?: string }>;
  createdAt: string;
  unlocked: boolean;
}

interface DailyCardData {
  date: string;
  card: { name: string; orientation: string; keyword: string };
  message: string;
  action: string;
}

/* ─── localStorage helpers ─── */

const HISTORY_KEY = "jingtower-history";
const DAILY_KEY_PREFIX = "jingtower-daily-";

function readHistory(): HistoryRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw) as Array<Record<string, unknown>>;
    return items.map((item) => ({
      id: (typeof item.id === "string" ? item.id : "") || `h-${Date.now()}`,
      scene: typeof item.scene === "string" ? item.scene : "",
      sceneLabel:
        typeof item.sceneLabel === "string"
          ? item.sceneLabel
          : typeof item.scene === "string"
            ? item.scene
            : "",
      question: typeof item.question === "string" ? item.question : "",
      cards: Array.isArray(item.cards)
        ? (item.cards as Array<{ name: string; orientation?: string }>)
        : [],
      createdAt:
        typeof item.createdAt === "string"
          ? item.createdAt
          : new Date().toISOString(),
      unlocked: false,
    }));
  } catch {
    return [];
  }
}

function readDailyCard(anonymousId: string): DailyCardData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DAILY_KEY_PREFIX + anonymousId);
    if (!raw) return null;
    const data = JSON.parse(raw) as DailyCardData & { _ts: number };
    // 检查是否同一天
    const today = new Date().toISOString().slice(0, 10);
    if (data.date !== today) return null;
    return data;
  } catch {
    return null;
  }
}

function writeDailyCard(anonymousId: string, data: DailyCardData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    DAILY_KEY_PREFIX + anonymousId,
    JSON.stringify({ ...data, _ts: Date.now() }),
  );
}

function checkUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem("jingtower-unlock-state");
    if (raw) {
      // 全局解锁或特定 readingId 解锁都算
      return true;
    }
  } catch {
    /* ignore */
  }
  // 兼容旧版
  try {
    if (window.localStorage.getItem("jingtower-mock-paid")) return true;
  } catch {
    /* ignore */
  }
  return false;
}

/* ─── scene label mapping ─── */

const sceneLabelMap: Record<string, string> = {
  love: "感情关系",
  yesno: "是/否判断",
  choice: "选择对比",
  career: "职业决策",
};

/* ─── component ─── */

export function UserRetention() {
  const [anonymousId, setAnonymousId] = useState("");
  const [recentRecords, setRecentRecords] = useState<HistoryRecord[]>([]);
  const [dailyCard, setDailyCard] = useState<DailyCardData | null>(null);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailyError, setDailyError] = useState("");

  /* 初始化 */
  useEffect(() => {
    const id = getAnonymousId();
    setAnonymousId(id);

    // 读取历史记录
    setRecentRecords(readHistory().slice(0, 5));

    // 尝试读取本地每日牌
    const cached = readDailyCard(id);
    if (cached) {
      setDailyCard(cached);
    }
  }, []);

  /* 抽每日牌 */
  const drawDailyCard = useCallback(async () => {
    if (!anonymousId) return;
    setDailyLoading(true);
    setDailyError("");

    try {
      const res = await fetch("/api/daily-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anonymousId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "获取每日牌失败");
      }

      const data = (await res.json()) as DailyCardData;
      setDailyCard(data);
      writeDailyCard(anonymousId, data);
    } catch (err) {
      setDailyError(
        err instanceof Error ? err.message : "获取每日牌失败，请重试",
      );
    } finally {
      setDailyLoading(false);
    }
  }, [anonymousId]);

  /* 格式化时间 */
  const formatDate = (iso: string): string => {
    try {
      const d = new Date(iso);
      return `${d.getMonth() + 1}月${d.getDate()}日`;
    } catch {
      return iso;
    }
  };

  /* ─── 是否有可展示内容 ─── */
  const hasRecords = recentRecords.length > 0;
  const hasDaily = !!dailyCard;
  const hasContent = hasRecords || hasDaily;
  const lastRecord = recentRecords[0] ?? null;

  return (
    <>
      {/* ── 复访欢迎栏 ── */}
      {hasContent && (
        <section className="retention-welcome" aria-label="复访入口">
          <div className="retention-welcome-inner">
            {/* 装饰星点 */}
            <div className="welcome-stars" aria-hidden="true" />

            {/* 左侧：欢迎文案 */}
            <div className="welcome-left">
              <span className="welcome-greeting">
                <span className="welcome-icon" aria-hidden="true">
                  ◇
                </span>
                欢迎回来
              </span>
              <p className="welcome-sub">
                {hasDaily
                  ? "今日牌已就绪，查看你的今日指引"
                  : hasRecords
                    ? "今天要抽每日牌还是继续上次报告？"
                    : "先抽一组三牌，开启你的塔罗之旅"}
              </p>
            </div>

            {/* 中间：状态提示 */}
            <div className="welcome-mid">
              {hasDaily && (
                <span className="welcome-badge daily-ready">
                  <span className="badge-dot" />
                  今日牌：{dailyCard.card.name}
                </span>
              )}
              {lastRecord && (
                <span className="welcome-badge last-read">
                  <span className="badge-dot" />
                  上次：{lastRecord.cards.map((c) => c.name).join(" · ")}
                </span>
              )}
              {!hasDaily && !lastRecord && (
                <span className="welcome-badge hint">
                  <span className="badge-dot" />
                  先抽一组三牌
                </span>
              )}
            </div>

            {/* 右侧：CTA 按钮 */}
            <div className="welcome-actions">
              <button
                className="button primary welcome-btn"
                onClick={drawDailyCard}
                disabled={dailyLoading}
                type="button"
              >
                {hasDaily ? "查看今日牌" : "抽今日牌"}
              </button>
              {lastRecord ? (
                <Link
                  className="button ghost welcome-btn"
                  href={`/reading/${lastRecord.id}`}
                >
                  继续上次报告
                </Link>
              ) : (
                <Link className="button ghost welcome-btn" href="/#room">
                  开始抽牌
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 每日牌 ── */}
      <section className="retention-daily" aria-label="每日牌">
        <div className="retention-section-header">
          <h2>今日牌</h2>
          <p>每天一张牌，一个关键提醒，一个可执行的行动。</p>
        </div>

        {dailyLoading ? (
          <div className="daily-card daily-loading">
            <div className="daily-card-inner">
              <div className="daily-shimmer" />
              <p>抽取中...</p>
            </div>
          </div>
        ) : dailyError ? (
          <div className="daily-card daily-error">
            <div className="daily-card-inner">
              <p>{dailyError}</p>
              <button
                className="button ghost"
                onClick={drawDailyCard}
                type="button"
              >
                重试
              </button>
            </div>
          </div>
        ) : hasDaily ? (
          <div className="daily-card daily-result">
            <div className="daily-card-inner">
              {/* 桌面端：左侧小牌图 + 右侧文字；移动端：上牌下文字 */}
              <div className="daily-card-layout">
                {/* 牌面视觉区 */}
                <div className="daily-card-visual">
                  <div className="daily-card-frame">
                    <TarotCardImage
                      card={{
                        name: dailyCard.card.name,
                        orientation: dailyCard.card.orientation as
                          | "正位"
                          | "逆位",
                        keyword: dailyCard.card.keyword,
                        image: dailyCardImagePath(dailyCard.card.name),
                        backImage: "/tarot/deck-v1/backs/default.webp",
                        alt: `${dailyCard.card.name} 塔罗牌`,
                      }}
                      revealed={true}
                      size="lg"
                      overlayLabel={true}
                    />
                  </div>
                </div>

                {/* 信息区：提醒 + 行动 */}
                <div className="daily-card-info">
                  <div className="daily-info-block">
                    <span className="daily-info-label">今日提醒</span>
                    <p className="daily-card-message">{dailyCard.message}</p>
                  </div>
                  <div className="daily-info-block">
                    <span className="daily-info-label">今日行动</span>
                    <p className="daily-card-action-text">{dailyCard.action}</p>
                  </div>
                  {/* 底部操作 */}
                  <div className="daily-card-footer">
                    <span className="daily-card-date">{dailyCard.date}</span>
                    <div className="daily-card-btns">
                      <button
                        className="button ghost daily-btn-sm"
                        onClick={drawDailyCard}
                        type="button"
                      >
                        明天再抽
                      </button>
                      <Link
                        className="button primary daily-btn-sm"
                        href="/cards"
                      >
                        查看牌义
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="daily-card daily-empty">
            <div className="daily-card-inner">
              <div className="daily-empty-visual" aria-hidden="true">
                <span className="daily-empty-icon" aria-hidden="true">
                  ◇
                </span>
              </div>
              <p>今天还没有抽每日牌。</p>
              <button
                className="button primary"
                onClick={drawDailyCard}
                type="button"
              >
                抽今日牌
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── 最近 5 次记录 ── */}
      <section className="retention-recent" aria-label="最近记录">
        <div className="retention-section-header">
          <h2>最近记录</h2>
          <p>你最近的几次开卡，可以随时回看。</p>
        </div>

        {!hasRecords ? (
          <div className="recent-empty">
            <p>还没有开卡记录，先抽一次牌。</p>
            <Link className="button primary" href="/#room">
              开始抽牌
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentRecords.map((record) => (
              <Link
                className="recent-item"
                href={`/reading/${record.id}`}
                key={record.id}
              >
                <div className="recent-item-left">
                  <span className="recent-scene">
                    {sceneLabelMap[record.scene] ||
                      record.sceneLabel ||
                      record.scene}
                  </span>
                  <span className="recent-cards">
                    {record.cards.map((c) => c.name).join(" · ")}
                  </span>
                </div>
                <div className="recent-item-right">
                  <span className="recent-time">
                    {formatDate(record.createdAt)}
                  </span>
                  {record.unlocked || checkUnlocked() ? (
                    <span className="recent-badge unlocked">已解锁</span>
                  ) : (
                    <span className="recent-badge locked">待解锁</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
