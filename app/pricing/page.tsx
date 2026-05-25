"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { trackEvent } from "@/lib/analytics/client";

/* ─── types ─── */

type ProductType = "single_deep_reading" | "three_pack";
type Plan = "single" | "tripack";

/**
 * 支付流程状态机：
 * idle → creating-order → awaiting-confirm → confirming → success | failed
 */
type PayFlowState =
  | "idle"
  | "creating-order"
  | "awaiting-confirm"
  | "confirming"
  | "success"
  | "failed";

/* ─── localStorage helpers ─── */

const UNLOCK_KEY = "jingtower-unlock-state";

interface UnlockState {
  readingId: string;
  orderId: string;
  productType: ProductType;
  unlockedAt: string;
}

function readUnlockState(): UnlockState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(UNLOCK_KEY);
    return raw ? (JSON.parse(raw) as UnlockState) : null;
  } catch {
    return null;
  }
}

function writeUnlockState(state: UnlockState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UNLOCK_KEY, JSON.stringify(state));
}

function getLastReadingId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const last = window.localStorage.getItem("jingtower-last-reading");
    if (last) return (JSON.parse(last) as { id?: string }).id ?? null;
  } catch {
    /* ignore */
  }
  return null;
}

/* ─── 功能对比 ─── */

const freeFeatures = [
  "三张牌解读",
  "当前状态分析",
  "核心提醒",
  "1 个今日行动",
  "基础免责声明",
] as const;

const paidFeatures = [
  ["第四张澄清牌", "揭示你没问出口的关键盲区"],
  ["隐藏动机", "拆解真实需求、回避点和关系动力"],
  ["三个时间窗口", "1-3 天 · 7 天 · 4 周的观察与行动建议"],
  ["风险提醒", "当前的情绪陷阱与决策误区"],
  ["7 日行动剧本", "每天一个低风险动作，可执行可追踪"],
  ["3 次追问", "三种路径推演，帮你看到更多可能"],
] as const;

/* ─── 产品类型 -> Plan 映射 ─── */

function productTypeToPlan(pt: ProductType): Plan {
  return pt === "single_deep_reading" ? "single" : "tripack";
}

/* ─── component ─── */

export default function PricingPage() {
  const searchParams = useSearchParams();
  const [payState, setPayState] = useState<PayFlowState>("idle");
  const [activePlan, setActivePlan] = useState<Plan>("single");
  const [alreadyUnlocked, setAlreadyUnlocked] = useState(false);
  const [lastReadingId, setLastReadingId] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 优先从 URL 参数读取 readingId
    const urlReadingId = searchParams.get("readingId");
    const productParam = searchParams.get("product");

    const unlocked = readUnlockState();
    if (unlocked) {
      setAlreadyUnlocked(true);
      setActivePlan(productTypeToPlan(unlocked.productType));
    }

    // 如果有 URL readingId，使用它
    if (urlReadingId) {
      setLastReadingId(urlReadingId);
    } else {
      setLastReadingId(getLastReadingId());
    }

    // 如果有 product 参数，设置对应 plan
    if (productParam === "single_deep_reading") {
      setActivePlan("single");
    } else if (productParam === "three_pack") {
      setActivePlan("tripack");
    }

    trackEvent("page_view", { page: "/pricing" });
  }, [searchParams]);

  /** 步骤 1：创建订单 */
  const handleCreateOrder = useCallback(
    async (plan: Plan) => {
      setActivePlan(plan);
      setPayState("creating-order");
      setErrorMessage("");

      const productType: ProductType =
        plan === "single" ? "single_deep_reading" : "three_pack";
      const readingId = lastReadingId || "demo-reading";

      // 埋点：点击解锁
      trackEvent("click_unlock", { productType, readingId });

      try {
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ readingId, productType }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "创建订单失败");
        }

        setCurrentOrderId(data.orderId);
        setPayState("awaiting-confirm");

        // 埋点：订单创建成功
        trackEvent("create_order", {
          productType,
          readingId,
          orderId: data.orderId,
        });
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "创建订单失败，请重试",
        );
        setPayState("failed");
      }
    },
    [lastReadingId],
  );

  /** 步骤 2：模拟支付确认 */
  const handleMockConfirm = useCallback(
    async (desiredResult: "success" | "failed") => {
      if (!currentOrderId) return;

      setPayState("confirming");
      setErrorMessage("");

      try {
        const res = await fetch("/api/payments/mock/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: currentOrderId,
            result: desiredResult,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "支付确认失败");
        }

        if (data.status === "paid") {
          const productType: ProductType =
            activePlan === "single" ? "single_deep_reading" : "three_pack";
          writeUnlockState({
            readingId: lastReadingId || "demo-reading",
            orderId: currentOrderId,
            productType,
            unlockedAt: new Date().toISOString(),
          });
          setAlreadyUnlocked(true);
          setPayState("success");

          // 埋点：支付成功
          trackEvent("payment_success", {
            productType,
            orderId: currentOrderId,
            readingId: lastReadingId || "demo-reading",
          });
        } else {
          setPayState("failed");
          setErrorMessage(data.message || "支付失败");

          // 埋点：支付失败
          trackEvent("payment_failed", {
            productType:
              activePlan === "single" ? "single_deep_reading" : "three_pack",
            orderId: currentOrderId,
          });
        }
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "支付确认失败，请重试",
        );
        setPayState("failed");
      }
    },
    [currentOrderId, activePlan, lastReadingId],
  );

  /** 重试：回到 idle */
  const handleRetry = useCallback(() => {
    setPayState("idle");
    setCurrentOrderId(null);
    setErrorMessage("");
  }, []);

  const readingLink = lastReadingId
    ? `/reading/${lastReadingId}`
    : "/reading/demo-reading";

  /* ─── 渲染按钮 ─── */

  function renderPriceButton(plan: Plan, variant: "plum" | "primary") {
    if (alreadyUnlocked && activePlan === plan) {
      return (
        <div className="pay-unlocked">
          <span>已解锁</span>
          <Link className="button primary" href={readingLink}>
            查看完整报告
          </Link>
        </div>
      );
    }

    switch (payState) {
      case "creating-order":
        if (activePlan === plan) {
          return (
            <button
              className={`button ${variant} is-busy`}
              disabled
              type="button"
            >
              创建订单中...
            </button>
          );
        }
        break;

      case "awaiting-confirm":
        if (activePlan === plan) {
          return (
            <div className="pay-mock-confirm">
              <span className="pay-mock-hint">支付确认</span>
              <div className="pay-mock-actions">
                <button
                  className="button primary"
                  onClick={() => handleMockConfirm("success")}
                  type="button"
                >
                  确认支付
                </button>
                <button
                  className="button ghost"
                  onClick={() => handleMockConfirm("failed")}
                  type="button"
                >
                  取消支付
                </button>
              </div>
            </div>
          );
        }
        break;

      case "confirming":
        if (activePlan === plan) {
          return (
            <button
              className={`button ${variant} is-busy`}
              disabled
              type="button"
            >
              确认中...
            </button>
          );
        }
        break;

      case "failed":
        if (activePlan === plan) {
          return (
            <div className="pay-failed">
              <span>{errorMessage || "支付未完成"}</span>
              <button
                className="button ghost"
                onClick={handleRetry}
                type="button"
              >
                重试
              </button>
            </div>
          );
        }
        break;
    }

    // idle 或其它计划
    return (
      <button
        className={`button ${variant}`}
        onClick={() => handleCreateOrder(plan)}
        type="button"
      >
        {plan === "single" ? "¥9.9 解锁" : "¥19.9 解锁"}
      </button>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="page-main pricing-page">
        <section className="page-hero compact">
          <h1>解锁完整仪式</h1>
          <p>
            一次解锁，永久可回看。不提供确定性预测，只提供更完整的复盘结构和行动参考。
          </p>
        </section>

        {/* ── 对比区 ── */}
        <section className="pricing-compare">
          <article className="plan-card free-plan">
            <span className="mini-label">免费版</span>
            <h2>已经给到价值</h2>
            <ul>
              {freeFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p>
              免费版已提供核心洞察。需要更深结构的话，可以随时解锁完整仪式。
            </p>
          </article>

          <article className="plan-card paid-plan">
            <span className="mini-label">完整仪式</span>
            <h2>更深的复盘结构</h2>
            {paidFeatures.map(([title, desc]) => (
              <div className="paid-feature" key={title}>
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </article>
        </section>

        {/* ── 价格卡 ── */}
        <section className="pricing-cta-section">
          <h2>选择方案</h2>
          <div className="pricing-cta-cards">
            {/* 单次 */}
            <article
              className={`price-card ${activePlan === "single" ? "selected" : ""}`}
            >
              <span className="price-tag">单次解锁</span>
              <strong className="price-num">¥9.9</strong>
              <span className="price-desc">不自动续费，永久可回看</span>
              {renderPriceButton("single", "plum")}
            </article>

            {/* 3 次包 */}
            <article
              className={`price-card best ${activePlan === "tripack" ? "selected" : ""}`}
            >
              <span className="price-badge">更划算</span>
              <span className="price-tag">3 次包</span>
              <strong className="price-num">¥19.9</strong>
              <span className="price-desc">适合反复复盘，可不同场景使用</span>
              {renderPriceButton("tripack", "primary")}
            </article>
          </div>

          <p className="pricing-compliance">
            仅作娱乐与自我探索参考，不提供确定性预测，不承诺特定结果。
            不替代医疗、法律、投资等专业意见。
          </p>

          <div className="pricing-back">
            <Link className="button ghost" href="/#room">
              先免费开一次牌
            </Link>
          </div>
        </section>

        {/* ── 解锁后节奏 ── */}
        <section className="ritual-timeline">
          <h2>解锁后的页面节奏</h2>
          <div className="timeline-grid">
            {[
              "第四张澄清牌翻开",
              "隐藏动机分析",
              "三个时间窗口建议",
              "风险提醒",
              "7 日行动剧本",
              "3 次追问对话",
            ].map((item, index) => (
              <div key={item}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
