import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "免责声明",
  description:
    "镜塔 Tarot 内容仅用于娱乐和自我探索参考，不提供确定性预测，不替代医疗、法律、投资等专业意见。",
  openGraph: {
    title: "免责声明 | 镜塔 Tarot",
    description: "镜塔 Tarot 内容仅用于娱乐和自我探索参考，不提供确定性预测。",
  },
};

export default function DisclaimerPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <section className="legal-page">
          {/* ── Hero 合规卡 ── */}
          <div className="legal-hero">
            <span className="legal-badge">合规说明</span>
            <h1>免责声明</h1>
            <p className="legal-hero-sub">
              镜塔 Tarot 的解读仅用于娱乐、自我探索、情绪整理和行动复盘。
              它可以帮助你复盘问题，但不能替代专业判断。
            </p>
            <div className="legal-compliance-bar">
              <span className="legal-compliance-icon" aria-hidden="true">
                !
              </span>
              <span>
                不提供确定性预测，不替代医疗、法律、投资等专业意见。
                高风险问题将被自动拦截，不进入付费流程。
              </span>
            </div>
          </div>

          {/* ── 双栏：能提供 / 不能提供 ── */}
          <div className="legal-grid">
            {/* 左：能提供 */}
            <div className="legal-card legal-card-light">
              <h2>
                <span className="legal-card-icon" aria-hidden="true">
                  &check;
                </span>
                我们能提供什么
              </h2>
              <ul className="legal-list">
                <li>帮你把模糊的问题改写成更适合复盘的结构化问题</li>
                <li>提供塔罗牌义启发和情绪整理角度</li>
                <li>提供低风险、可执行的行动建议</li>
                <li>帮你记录和回看自己的状态变化</li>
                <li>免费三牌阵给到当前状态、核心提醒和一个行动方向</li>
              </ul>
            </div>

            {/* 右：不能提供 */}
            <div className="legal-card legal-card-dark">
              <h2>
                <span className="legal-card-icon" aria-hidden="true">
                  !
                </span>
                我们不能提供什么
              </h2>
              <ul className="legal-list legal-list-neg">
                <li>不提供确定性预测</li>
                <li>不保证任何关系、职业、财务结果</li>
                <li>不提供医疗诊断、用药建议</li>
                <li>不提供法律结论或法律意见</li>
                <li>不提供投资、股票、彩票、赌博建议</li>
                <li>不处理暴力伤害、自伤等高风险请求</li>
              </ul>
            </div>
          </div>

          {/* ── 高风险问题处理 ── */}
          <div className="legal-warning">
            <h2>
              <span className="legal-card-icon" aria-hidden="true">
                &loz;
              </span>
              高风险问题处理
            </h2>
            <p>
              当问题涉及医疗健康、法律纠纷、投资理财、彩票博彩、生命安全、自伤风险、暴力伤害等内容时，
              系统会拒绝生成塔罗解读，也不会引导进入付费流程。
              我们鼓励你在这些情况下优先寻求医生、律师、心理健康专业人士或当地紧急救助渠道的帮助。
            </p>
          </div>

          {/* ── 双栏：付费说明 / 紧急情况 ── */}
          <div className="legal-grid">
            {/* 付费前说明 */}
            <div className="legal-card legal-card-light">
              <h2>
                <span className="legal-card-icon" aria-hidden="true">
                  &diams;
                </span>
                付费前说明
              </h2>
              <p>
                完整仪式解锁的是更完整的自我探索结构，包括第四张澄清牌、隐藏动机分析、
                时间窗口建议和可执行的行动清单。它不是确定性预测，也不构成专业意见。
                付费后如对内容不满意，可联系客服处理。
              </p>
            </div>

            {/* 紧急情况 */}
            <div className="legal-card legal-card-emergency">
              <h2>
                <span className="legal-card-icon" aria-hidden="true">
                  +
                </span>
                遇到紧急情况怎么办
              </h2>
              <p>
                如果你或他人正处于即时危险、自伤风险、暴力威胁或严重心理危机中，
                请立即联系当地紧急救助渠道，或寻求专业心理健康支持。
              </p>
              <div className="legal-emergency-links">
                <span>全国心理援助热线：400-161-9995</span>
                <span>生命热线：400-821-1215</span>
                <span>报警电话：110</span>
                <span>急救电话：120</span>
              </div>
            </div>
          </div>

          {/* ── 底部 CTA ── */}
          <div className="legal-actions">
            <Link className="button primary" href="/#room">
              返回牌室
            </Link>
            <Link className="button ghost" href="/cards">
              查看牌义库
            </Link>
            <Link className="button ghost" href="/pricing">
              了解完整仪式
            </Link>
          </div>

          {/* ── 合规脚注 ── */}
          <div className="legal-footer-note">
            <p>
              本页面内容最后更新于 2026 年 5
              月。用户协议和隐私政策页面即将上线。
            </p>
            <p>
              镜塔 Tarot 是一个 AI 辅助的自我探索工具，用于娱乐和行动复盘。
              所有解读均为 AI 基于塔罗符号体系生成，不代表任何形式的确定性预测。
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
