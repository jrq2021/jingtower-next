import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { CardsClient } from "./CardsClient";

export const metadata: Metadata = {
  title: "塔罗牌义库 | 镜塔 Tarot",
  description:
    "22 张大阿卡纳完整牌义：爱情塔罗、事业塔罗、每日状态与行动建议。中文 AI 塔罗陪伴，用于自我探索和行动复盘。",
  openGraph: {
    title: "塔罗牌义库 | 镜塔 Tarot",
    description: "探索 22 张大阿卡纳的完整牌义，找到属于你的那张牌。",
  },
};

export default function CardsPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <CardsClient />
      </main>
    </>
  );
}
