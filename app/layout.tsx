import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "镜塔 Tarot | AI 塔罗牌室",
    template: "%s | 镜塔 Tarot",
  },
  description:
    "中文 AI 塔罗牌室，提供爱情塔罗、每日塔罗、事业塔罗、牌义库和自我探索报告。免费三牌阵给到可行动的洞察，用于娱乐和行动复盘。",
  openGraph: {
    title: "镜塔 Tarot | AI 塔罗牌室",
    description:
      "中文 AI 塔罗陪伴，用于自我探索和行动复盘。不提供确定性预测，只提供更完整的复盘结构和行动参考。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
