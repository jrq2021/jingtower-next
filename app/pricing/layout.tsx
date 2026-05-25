import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "完整仪式解锁",
  description:
    "解锁完整塔罗仪式：第四张澄清牌、隐藏动机、三个时间窗口、7 日行动剧本和追问。一次解锁，永久可回看。仅作娱乐与自我探索参考。",
  openGraph: {
    title: "完整仪式解锁 | 镜塔 Tarot",
    description:
      "解锁完整塔罗仪式，获得更深层的复盘结构和行动参考。",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <main className="page-main pricing-page">
        <section className="page-hero compact">
          <h1>解锁完整仪式</h1>
          <p>正在加载...</p>
        </section>
      </main>
    }>
      {children}
    </Suspense>
  );
}
