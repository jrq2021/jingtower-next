"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { createMockReading, getScene } from "@/lib/content";
import { getCardIdByName } from "@/lib/cards";
import { trackEvent } from "@/lib/analytics/client";
import { MathCurveLoader } from "@/components/MathCurveLoader";
import { TarotCardImage } from "@/components/TarotCardImage";
import type { DeepResult, Reading, SceneKey, TarotCard } from "@/lib/types";

const cardInterpretations: Record<string, Record<string, string>> = {
  月亮: {
    正位: "潜意识浮现，直觉在提醒你注意隐藏的信息与情绪。",
    逆位: "恐惧被放大，你所见的可能只是自己的投射而非事实。",
  },
  力量: {
    正位: "以柔克刚，耐心与信任是比强硬更持久的力量。",
    逆位: "自我怀疑正在消耗你，需要先安抚内在的焦虑。",
  },
  星星: {
    正位: "信心回归，疗愈已经开始，给自己一点时间恢复。",
    逆位: "方向暂时模糊，不要急于求成，先整理情绪再行动。",
  },
  正义: {
    正位: "客观权衡利弊，边界清晰才能做出冷静判断。",
    逆位: "可能正在逃避某个责任，诚实面对才有出路。",
  },
  节制: {
    正位: "节奏刚好，不急不缓，保持当前的平衡感。",
    逆位: "操之过急或过度克制都会失去时机，找回中道。",
  },
  太阳: {
    正位: "方向正确，能量充沛，适合做出明确的行动。",
    逆位: "还需等待，信号还不够清晰，让时间给出答案。",
  },
  恋人: {
    正位: "真心契合，选择与你的价值观一致的方向。",
    逆位: "价值观可能有冲突，先想清楚你真正在意的是什么。",
  },
  隐士: {
    正位: "内省带来智慧，独处比向外求索更有收获。",
    逆位: "过度孤立让你失去外部信息，适度打开自己。",
  },
  战车: {
    正位: "果断前行，但方向盘要稳，不要被情绪左右。",
    逆位: "方向可能失控，先停下来检查你的动机和动力。",
  },
  魔术师: {
    正位: "万事俱备，你已拥有启动所需的所有资源。",
    逆位: "能力与目标可能错配，先盘点真正可用的资本。",
  },
  高塔: {
    正位: "破而后立，变化未必是坏事，是重建的契机。",
    逆位: "恐惧改变让你停滞，接受波动才能迎来新可能。",
  },
  星币八: {
    正位: "日拱一卒，持续打磨比一次爆发更可靠。",
    逆位: "重复消耗是否值得？检查你投入的方向是否对。",
  },
  女祭司: {
    正位: "倾听内在的声音，答案早已在你心中。",
    逆位: "你在逃避自己的直觉，向外寻求本应由内给出的确认。",
  },
  命运之轮: {
    正位: "时机已到，顺势而为比强力控制更有效。",
    逆位: "你在对抗自然的变化，接受波动才能找到节奏。",
  },
  皇帝: {
    正位: "果断决策，用秩序和纪律为自己建立边界。",
    逆位: "你在逃避承担决策的责任，拖延只会让选项消失。",
  },
  世界: {
    正位: "一个周期即将完成，你已经具备了进入下一阶段的资本。",
    逆位: "你离完成还差最后一步，不要在此刻放弃。",
  },
};

function getCardInterpret(card: TarotCard): string {
  const orient = card.orientation ?? "正位";
  return (
    cardInterpretations[card.name]?.[orient] ??
    card.keyword + "是当下的核心线索，值得反复体会。"
  );
}

function readStoredReading(id: string): Reading | null {
  if (typeof window === "undefined") return null;
  try {
    const last = window.localStorage.getItem("jingtower-last-reading");
    if (last) {
      const parsed = JSON.parse(last) as Reading;
      if (parsed.id === id || id === "demo-reading") return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/** 检查本地解锁状态（localStorage 快速路径） */
function checkLocalUnlocked(): {
  unlocked: boolean;
  orderId?: string;
  productType?: string;
} {
  if (typeof window === "undefined") return { unlocked: false };
  try {
    const raw = window.localStorage.getItem("jingtower-unlock-state");
    if (raw) {
      const state = JSON.parse(raw);
      return {
        unlocked: true,
        orderId: state.orderId,
        productType: state.productType,
      };
    }
  } catch {
    /* ignore */
  }
  // 兼容旧版 localStorage key
  try {
    const old = window.localStorage.getItem("jingtower-mock-paid");
    if (old) return { unlocked: true };
  } catch {
    /* ignore */
  }
  return { unlocked: false };
}

/** 通过 API 验证解锁状态 */
async function verifyUnlockFromAPI(readingId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/reading/${readingId}/unlock`);
    if (res.ok) {
      const data = await res.json();
      return data.unlocked === true;
    }
  } catch {
    /* fallback to local */
  }
  return false;
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return (
      d.getFullYear() +
      "年" +
      (d.getMonth() + 1) +
      "月" +
      d.getDate() +
      "日 " +
      String(d.getHours()).padStart(2, "0") +
      ":" +
      String(d.getMinutes()).padStart(2, "0")
    );
  } catch {
    return iso;
  }
}

export default function ReadingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [deepResult, setDeepResult] = useState<DeepResult | null>(null);
  const [deepLoading, setDeepLoading] = useState(false);
  const [deepError, setDeepError] = useState("");

  /* 继续追问状态 */
  const [followUpLoading, setFollowUpLoading] = useState<string | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<
    Record<string, string>
  >({});

  const followUpQuestions = [
    { key: "active", label: "如果我主动会怎样？" },
    { key: "wait", label: "如果我等待会怎样？" },
    { key: "letgo", label: "如果我放下会怎样？" },
  ];

  const handleFollowUp = useCallback(async (key: string) => {
    setFollowUpLoading(key);
    // Mock 回答（后续可接 /api/reading/follow-up）
    const mockAnswers: Record<string, string> = {
      active:
        "主动推进可能带来短期突破，但要注意节奏。对方准备好接受时，你的行动会事半功倍。建议先做一个低风险试探，再根据反馈决定下一步。",
      wait: "等待不是被动，而是让信息自然浮现。这段时间适合观察和收集信号，特别是对方是否开始主动释放明确意向。",
      letgo:
        "放下不等于放弃，是把控制权交还给事情本身。当你不再用力时，往往会看到之前忽略的选项和出口。",
    };
    await new Promise((r) => setTimeout(r, 800));
    setFollowUpAnswers((prev) => ({ ...prev, [key]: mockAnswers[key] }));
    setFollowUpLoading(null);
  }, []);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [sharePoster, setSharePoster] = useState<{
    title: string;
    cards: string[];
    keywords: string[];
    summary: string;
    brand: string;
  } | null>(null);
  const [shareCta, setShareCta] = useState("");
  const [shareLandingPath, setShareLandingPath] = useState("/#room");
  const [shareError, setShareErrorLocal] = useState("");
  const [downloadMsg, setDownloadMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1. 优先从 API 获取
      try {
        const res = await fetch(`/api/reading/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.reading) {
            setReading({ ...data.reading, question: "" } as Reading);

            // 埋点：报告页浏览
            trackEvent("page_view", {
              scene: data.reading.scene,
              readingId: data.reading.id,
              page: `/reading/${id}`,
            });

            // 先检查本地解锁状态（快速路径）
            const local = checkLocalUnlocked();
            if (local.unlocked) {
              // 异步验证服务端解锁状态
              const apiUnlocked = await verifyUnlockFromAPI(id);
              setIsUnlocked(apiUnlocked || local.unlocked);
            } else {
              setIsUnlocked(false);
            }

            setLoading(false);
            return;
          }
        }
      } catch {
        /* fallback */
      }

      // 2. localStorage fallback
      const stored = readStoredReading(id);
      if (!cancelled) {
        if (stored) {
          setReading(stored);
        } else {
          const sceneKey = (
            id.includes("career")
              ? "career"
              : id.includes("yesno")
                ? "yesno"
                : id.includes("choice")
                  ? "choice"
                  : "love"
          ) as SceneKey;
          setReading(
            createMockReading(
              sceneKey,
              "我想探索当前遇到的问题，获得一些行动启发。",
            ),
          );
        }

        // 检查解锁状态
        const local = checkLocalUnlocked();
        if (local.unlocked) {
          const apiUnlocked = await verifyUnlockFromAPI(id);
          setIsUnlocked(apiUnlocked || local.unlocked);
        } else {
          setIsUnlocked(false);
        }

        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // 如果已解锁且没有 deepResult，自动拉取
  useEffect(() => {
    if (!isUnlocked || !reading || deepResult || deepLoading) return;
    setDeepLoading(true);
    setDeepError("");
    fetch("/api/reading/deep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        readingId: reading.id,
        scene: reading.scene,
        question: reading.question,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "获取深度报告失败");
        }
        return res.json();
      })
      .then((data) => {
        setDeepResult(data.deepResult);
        // 埋点：深度报告展示
        if (reading) {
          trackEvent("view_deep_result", {
            scene: reading.scene,
            readingId: reading.id,
            source: data.source,
          });
        }
      })
      .catch((err) =>
        setDeepError(err instanceof Error ? err.message : "未知错误"),
      )
      .finally(() => setDeepLoading(false));
  }, [isUnlocked, reading, deepResult, deepLoading]);

  /* ─── 分享卡逻辑 ─── */

  const openShareModal = useCallback(async () => {
    setShareModalOpen(true);
    setShareStatus("loading");
    setShareErrorLocal("");
    setDownloadMsg("");
    setSharePoster(null);

    if (!reading) return;

    // 埋点：打开分享卡
    trackEvent("share_card_open", {
      scene: reading.scene,
      readingId: reading.id,
    });

    try {
      const res = await fetch("/api/share-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scene: reading.scene,
          cards: reading.cards.map((c) => ({
            name: c.name,
            keyword: c.keyword,
          })),
          summary: reading.freeResult.summary,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "生成失败");
      }
      const data = await res.json();
      setSharePoster(data.poster);
      setShareCta(data.cta || "也抽一组三牌");
      setShareLandingPath(data.landingPath || "/#room");
      setShareStatus("success");
    } catch (err) {
      setShareErrorLocal(err instanceof Error ? err.message : "未知错误");
      setShareStatus("error");
    }
  }, [reading]);

  const closeShareModal = useCallback(() => {
    setShareModalOpen(false);
    setDownloadMsg("");
  }, []);

  const handleDownload = useCallback(() => {
    setDownloadMsg("图片下载功能即将开放，敬请期待。");
    // 埋点：下载分享卡
    if (reading) {
      trackEvent("share_card_download", {
        scene: reading.scene,
        readingId: reading.id,
      });
    }
  }, [reading]);

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="page-main reading-report">
          <div className="report-loading">
            <MathCurveLoader
              variant="lemniscate"
              size={160}
              label="正在解读你的牌面"
              tone="gold"
            />
          </div>
        </main>
      </>
    );
  }
  if (!reading) {
    return (
      <>
        <SiteHeader />
        <main className="page-main reading-report">
          <div className="report-empty">
            <h1>未找到报告</h1>
            <p>该报告可能已过期或不存在。请回到首页重新开卡。</p>
            <Link className="button primary" href="/">
              返回牌室
            </Link>
          </div>
        </main>
      </>
    );
  }

  const scene = getScene(reading.scene);

  return (
    <>
      <SiteHeader />
      <main className="reading-report">
        <section className="rp-top">
          <div className="rp-top-badge">
            <span className="rp-scene-label">{scene.label}</span>
            <span className="rp-id">#{reading.id.slice(0, 8)}</span>
            {isUnlocked && <span className="rp-unlocked-badge">已解锁</span>}
          </div>
          <h1 className="rp-question">{reading.rewrittenQuestion}</h1>
          <div className="rp-meta">
            <span>生成时间：{formatTime(reading.createdAt)}</span>
          </div>
          <p className="rp-compliance">
            仅供娱乐与自我探索参考，不替代医疗、法律、投资等专业意见。
          </p>
        </section>

        <section className="rp-cards" aria-label="抽到的三张牌">
          <h2 className="rp-section-title">你的三张牌</h2>
          <div className="rp-cards-grid">
            {reading.cards.map((card, i) => (
              <article
                className={`rp-card-item rp-card-${i + 1}`}
                key={card.name}
              >
                <div className="rp-mini-card">
                  <TarotCardImage card={card} revealed={true} size="sm" />
                </div>
                <div className="rp-card-body">
                  <h3>
                    {card.name} — {card.role}
                  </h3>
                  <p className="rp-card-keyword">{card.keyword}</p>
                  <p className="rp-card-interpret">{getCardInterpret(card)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rp-insight">
          <h2 className="rp-section-title">免费洞察</h2>
          <div className="rp-insight-grid">
            <div className="rp-insight-block">
              <span className="rp-insight-icon" aria-hidden="true">
                ~
              </span>
              <h3>当前状态</h3>
              <p>{reading.freeResult.summary}</p>
            </div>
            <div className="rp-insight-block">
              <span className="rp-insight-icon" aria-hidden="true">
                *
              </span>
              <h3>核心提醒</h3>
              <p>{reading.freeResult.insight}</p>
            </div>
            <div className="rp-insight-block">
              <span className="rp-insight-icon" aria-hidden="true">
                &rarr;
              </span>
              <h3>今日行动</h3>
              <p>{reading.freeResult.action}</p>
            </div>
            <div className="rp-insight-block rp-risk">
              <span className="rp-insight-icon" aria-hidden="true">
                !
              </span>
              <h3>风险提醒</h3>
              <p>
                塔罗解读反映的是当前能量状态，不是确定性预言。所有决定仍需你自主判断，重大事项请咨询专业人士。
              </p>
            </div>
          </div>
          {!isUnlocked && (
            <div className="rp-teaser-banner">
              <span>{reading.freeResult.paywallTeaser}</span>
            </div>
          )}
        </section>

        {/* ═══ 付费区：未解锁 vs 已解锁 ═══ */}
        {!isUnlocked ? (
          <>
            <section className="rp-paywall">
              <div className="rp-paywall-header">
                <span className="rp-lock-icon" aria-hidden="true">
                  &loz;
                </span>
                <h2>完整仪式待解锁</h2>
                <p>以下内容在解锁后可见。一次解锁，永久可回看。</p>
              </div>
              <div className="rp-paywall-grid">
                <div className="rp-locked-item rp-locked-clarifier">
                  <strong>第四张澄清牌</strong>
                  <span>揭示你没问出口的关键盲区</span>
                </div>
                <div className="rp-locked-item">
                  <strong>隐藏动机</strong>
                  <span>拆解真实需求、回避点与关系动力</span>
                </div>
                <div className="rp-locked-item">
                  <strong>三个时间窗口</strong>
                  <span>1-3 天 · 7 天 · 4 周，分别怎么观察和行动</span>
                </div>
                <div className="rp-locked-item">
                  <strong>7 日行动剧本</strong>
                  <span>每天一个低风险动作，可执行、可追踪</span>
                </div>
                <div className="rp-locked-item">
                  <strong>3 次追问</strong>
                  <span>「如果我主动 / 等待 / 放下会怎样」三种路径推演</span>
                </div>
                <div className="rp-locked-item">
                  <strong>风险提醒</strong>
                  <span>当前需要注意的情绪陷阱和决策误区</span>
                </div>
              </div>
            </section>
            <section className="rp-cta">
              <h2>解锁后你可以获得</h2>
              <div className="rp-cta-cards">
                <article className="rp-price-card">
                  <span className="rp-price-tag">单次解锁</span>
                  <strong>¥9.9</strong>
                  <span>不自动续费，一次解锁永久可看</span>
                  <Link
                    className="button plum"
                    href={`/pricing?readingId=${encodeURIComponent(reading.id)}&product=single_deep_reading`}
                    onClick={() =>
                      trackEvent("click_unlock", {
                        scene: reading.scene,
                        readingId: reading.id,
                        productType: "single_deep_reading",
                      })
                    }
                  >
                    解锁完整仪式
                  </Link>
                </article>
                <article className="rp-price-card rp-price-best">
                  <span className="rp-price-tag">3 次包 · 更划算</span>
                  <strong>¥19.9</strong>
                  <span>适合反复复盘，可不同场景使用</span>
                  <Link
                    className="button primary"
                    href={`/pricing?readingId=${encodeURIComponent(reading.id)}&product=three_pack`}
                    onClick={() =>
                      trackEvent("click_unlock", {
                        scene: reading.scene,
                        readingId: reading.id,
                        productType: "three_pack",
                      })
                    }
                  >
                    查看会员方案
                  </Link>
                </article>
              </div>
              <p className="rp-cta-note">
                仅作娱乐与自我探索参考，不提供确定性预测，不承诺特定结果。
              </p>
            </section>
          </>
        ) : deepLoading ? (
          <section className="rp-deep rp-deep-loading">
            <MathCurveLoader
              variant="star"
              size={140}
              label="正在生成深度报告"
              tone="plum"
            />
          </section>
        ) : deepError ? (
          <section className="rp-deep rp-deep-error">
            <p>{deepError}</p>
            <button
              className="button ghost"
              onClick={() => setDeepResult(null)}
              type="button"
            >
              重试
            </button>
          </section>
        ) : deepResult ? (
          <section className="rp-deep">
            <h2 className="rp-section-title">完整仪式报告</h2>

            {/* 第四张澄清牌 */}
            <div className="rp-clarifier">
              <div className="rp-clarifier-card">
                <TarotCardImage
                  card={deepResult.clarifierCard}
                  revealed={true}
                  size="sm"
                />
              </div>
              <div className="rp-clarifier-body">
                <h3>第四张澄清牌 — {deepResult.clarifierCard.name}</h3>
                <p className="rp-clarifier-message">
                  {deepResult.clarifierCard.message}
                </p>
                <p className="rp-clarifier-interpret">
                  {getCardInterpret(deepResult.clarifierCard)}
                </p>
              </div>
            </div>

            {/* 隐藏动机 */}
            <div className="rp-deep-block">
              <h3>隐藏动机</h3>
              <p>{deepResult.hiddenMotive}</p>
            </div>

            {/* 时间窗口 */}
            <div className="rp-deep-block">
              <h3>三个时间窗口</h3>
              <div className="rp-windows-grid">
                {deepResult.windows.map((w) => (
                  <div className="rp-window-item" key={w.label}>
                    <strong>{w.label}</strong>
                    <p>{w.advice}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 风险提醒 */}
            <div className="rp-deep-block">
              <h3>风险提醒</h3>
              <ul className="rp-risks-list">
                {deepResult.risks.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* 7 日行动剧本 */}
            <div className="rp-deep-block">
              <h3>7 日行动剧本</h3>
              <ol className="rp-action-list">
                {deepResult.actionPlan.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            {/* 3 次追问 */}
            <div className="rp-deep-block">
              <h3>追问你自己</h3>
              <div className="rp-followups">
                {deepResult.followUps.map((q, i) => (
                  <div className="rp-followup-item" key={i}>
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="rp-share">
          <h2>分享你的牌阵</h2>
          <p>分享卡只展示牌面和关键词，不会暴露你的原始问题。</p>
          {!shareModalOpen ? (
            <button
              className="button primary"
              onClick={openShareModal}
              type="button"
            >
              生成分享卡
            </button>
          ) : null}
        </section>

        {/* 分享卡弹层 */}
        {shareModalOpen && (
          <div className="share-overlay" onClick={closeShareModal}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="share-close"
                onClick={closeShareModal}
                type="button"
                aria-label="关闭"
              >
                &times;
              </button>
              <h3>分享卡预览</h3>
              <div className="share-modal-body">

              {shareStatus === "loading" ? (
                <div className="share-status-text">
                  <MathCurveLoader
                    variant="orbit"
                    size={100}
                    label="正在生成分享卡"
                    tone="gold"
                  />
                </div>
              ) : shareStatus === "error" ? (
                <div className="share-status-text">
                  <p>生成失败：{shareError}</p>
                  <button
                    className="button ghost"
                    onClick={openShareModal}
                    type="button"
                  >
                    重试
                  </button>
                </div>
              ) : sharePoster ? (
                <>
                  <div className="share-card-poster">
                    <span className="scp-brand">镜塔 Tarot</span>
                    <span className="scp-title">{sharePoster.title}</span>
                    <div className="scp-cards">
                      {sharePoster.cards.map((name: string, i: number) => {
                        const cardId = getCardIdByName(name);
                        return (
                          <div className="scp-card" key={name}>
                            <TarotCardImage
                              card={{
                                name,
                                keyword: sharePoster.keywords[i],
                                image: cardId
                                  ? `/tarot/deck-v1/major/${cardId}.webp`
                                  : "",
                                backImage: "/tarot/deck-v1/backs/default.webp",
                                alt: `${name} 塔罗牌`,
                              }}
                              revealed={true}
                              size="sm"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <p className="scp-summary">{sharePoster.summary}</p>
                    <span className="scp-date">
                      {formatTime(reading.createdAt)}
                    </span>
                    <span className="scp-disclaimer">
                      仅作娱乐与自我探索参考
                    </span>
                  </div>
                  <div className="share-actions">
                    <button
                      className="button primary"
                      onClick={handleDownload}
                      type="button"
                    >
                      下载分享卡
                    </button>
                    {downloadMsg && (
                      <p className="share-download-msg">{downloadMsg}</p>
                    )}
                  </div>
                  <div className="share-cta-links">
                    <p className="share-cta-title">也来看看</p>
                    <div className="share-cta-grid">
                      <Link className="share-cta-btn" href={shareLandingPath}>
                        {shareCta || "也抽一组三牌"}
                      </Link>
                      <Link className="share-cta-btn" href="/#room">
                        进入镜塔 Tarot
                      </Link>
                    </div>
                  </div>
                </>
              ) : null}
              </div>{/* .share-modal-body */}
            </div>
          </div>
        )}
        {/* ── 继续追问 ── */}
        <section className="rp-followup-section" aria-label="继续追问">
          <h2>继续追问</h2>
          <p>从不同角度推演，看到更多可能。</p>

          {!isUnlocked ? (
            <div className="rp-followup-locked">
              <div className="rp-followup-locked-list">
                {followUpQuestions.map((q) => (
                  <div className="rp-followup-locked-item" key={q.key}>
                    <span className="rp-lock-icon-sm" aria-hidden="true">
                      &loz;
                    </span>
                    <span>{q.label}</span>
                  </div>
                ))}
              </div>
              <Link className="button plum" href="/pricing">
                解锁完整仪式后可继续追问
              </Link>
            </div>
          ) : (
            <div className="rp-followup-unlocked">
              <div className="rp-followup-buttons">
                {followUpQuestions.map((q) => (
                  <div className="rp-followup-btn-group" key={q.key}>
                    <button
                      className={`button ghost rp-followup-btn ${followUpLoading === q.key ? "is-busy" : ""}`}
                      onClick={() => handleFollowUp(q.key)}
                      disabled={followUpLoading !== null}
                      type="button"
                    >
                      {followUpLoading === q.key ? "思考中..." : q.label}
                    </button>
                    {followUpAnswers[q.key] && (
                      <div className="rp-followup-answer">
                        <p>{followUpAnswers[q.key]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <footer className="rp-footer">
          <p>镜塔 Tarot — AI 塔罗陪伴，用于娱乐、自我探索与行动复盘。</p>
          <p>
            不宣称算命必中，不承诺复合、改运、消灾。不替代医疗、法律、投资等专业意见。
          </p>
          <Link href="/legal/disclaimer">查看完整免责声明</Link>
        </footer>
      </main>
    </>
  );
}
