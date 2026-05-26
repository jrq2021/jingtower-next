import Link from "next/link";
import { growthLoops, scenes } from "@/lib/content";

export function EntryUniverse() {
  return (
    <section className="entry-universe" aria-label="更多探索入口">
      <div className="section-heading">
        <h2>从不同主题进入，找到适合你的牌阵</h2>
        <p>
          从爱情、选择、事业或每日状态进入，镜塔都会帮你把问题整理成一次清晰的三牌复盘。
        </p>
      </div>
      <div className="entry-grid">
        {scenes.map((scene) => {
          const href =
            scene.key === "love"
              ? "/love-tarot"
              : scene.key === "career"
                ? "/career-tarot"
                : scene.key === "yesno"
                  ? "/yes-no-tarot"
                  : `/?scene=${scene.key}#room`;
          return (
            <Link className="entry-card" href={href} key={scene.key}>
              <strong>{scene.labelSeo ?? scene.label}</strong>
              <span>{scene.title}</span>
            </Link>
          );
        })}
        <Link className="entry-card" href="/daily-tarot">
          <strong>每日塔罗</strong>
          <span>一天一张牌 · 日常觉察</span>
        </Link>
        <Link className="entry-card" href="/cards">
          <strong>塔罗牌义</strong>
          <span>22 张大阿卡纳详解</span>
        </Link>
        <Link className="entry-card" href="/spreads">
          <strong>牌阵库</strong>
          <span>一张牌到凯尔特十字</span>
        </Link>
        <Link className="entry-card" href="/tarot-guides">
          <strong>入门指南</strong>
          <span>怎么问、怎么看、怎么用</span>
        </Link>
      </div>
    </section>
  );
}

export function ReportAndGrowth() {
  return (
    <>
      <section className="report-frame" aria-label="免费报告与完整仪式">
        <div className="report-column">
          <span className="mini-label">免费报告</span>
          <h2>免费版已包含这些内容</h2>
          <ul className="report-list">
            <li>问题复述与 AI 改写</li>
            <li>三张牌的正逆位和关键词</li>
            <li>当前状态、核心提醒、一个行动建议</li>
            <li>敏感问题拒答和专业求助提示</li>
          </ul>
        </div>
        <div className="paywall-column">
          <span className="mini-label">完整仪式</span>
          <h2>付费点锁在“更深结构”上</h2>
          <div className="unlock-list">
            <div>
              <strong>第 4 张</strong>
              <span>盲区澄清牌</span>
            </div>
            <div>
              <strong>隐藏动机</strong>
              <span>真实需求与回避点</span>
            </div>
            <div>
              <strong>时间窗口</strong>
              <span>1-3 天 / 7 天 / 4 周</span>
            </div>
            <div>
              <strong>行动剧本</strong>
              <span>7 日路线与追问</span>
            </div>
          </div>
          <Link className="button plum" href="/pricing">
            查看会员页
          </Link>
        </div>
        <aside className="share-poster" aria-label="分享卡预览">
          <span>分享卡</span>
          <strong>月亮 · 力量 · 星星</strong>
          <p>今天的关键词：先看清，再行动。</p>
        </aside>
      </section>

      <section className="loops-section" aria-label="留住用户的循环">
        <div className="section-heading">
          <h2>每天都有回来的理由</h2>
          <p>
            你可以每天抽一张牌，也可以回看最近的开卡记录，观察自己这段时间反复遇到的主题。
          </p>
        </div>
        <div className="loop-grid">
          {growthLoops.map(([title, copy, tag]) => (
            <article className="loop-card" key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span>{tag}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function SitemapSection() {
  const groups: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }> = [
    {
      title: "场景入口",
      links: [
        { label: "AI 塔罗占卜", href: "/#room" },
        { label: "爱情塔罗", href: "/love-tarot" },
        { label: "事业塔罗", href: "/career-tarot" },
        { label: "是否塔罗", href: "/yes-no-tarot" },
      ],
    },
    {
      title: "时间入口",
      links: [
        { label: "每日塔罗", href: "/daily-tarot" },
        { label: "本周塔罗", href: "/spreads" },
        { label: "月运塔罗", href: "/spreads" },
        { label: "塔罗年运", href: "/spreads" },
      ],
    },
    {
      title: "牌阵入口",
      links: [
        { label: "一张牌", href: "/spreads" },
        { label: "二选一", href: "/spreads" },
        { label: "三牌阵", href: "/spreads" },
        { label: "凯尔特十字", href: "/spreads" },
      ],
    },
    {
      title: "内容入口",
      links: [
        { label: "塔罗牌义大全", href: "/cards" },
        { label: "入门指南", href: "/tarot-guides" },
        { label: "会员订阅", href: "/pricing" },
        { label: "免责声明", href: "/legal/disclaimer" },
      ],
    },
  ];

  return (
    <section className="sitemap-section" aria-label="更多塔罗入口">
      <h2>按你的问题选择入口</h2>
      <div className="sitemap-grid">
        {groups.map(({ title, links }) => (
          <div key={title}>
            <h3>{title}</h3>
            {links.map(({ label, href }) => (
              <Link href={href} key={label}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
