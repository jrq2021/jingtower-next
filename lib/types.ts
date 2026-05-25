export type SceneKey = "love" | "yesno" | "choice" | "career";

export type TarotCard = {
  name: string;
  role: string;
  keyword: string;
  orientation?: "正位" | "逆位";
  upright?: string;
  reversed?: string;
  meaning?: string;
  /** 牌面图片路径（public 目录下） */
  image?: string;
  /** 牌背图片路径 */
  backImage?: string;
  /** 图片 alt 描述 */
  alt?: string;
};

export type MajorCard = {
  id: string;
  number: number;
  name: string;
  keywords: string[];
  upright: string;
  reversed: string;
  love: string;
  career: string;
  state: string;
  action: string;
  /** 牌面图片路径 */
  image: string;
  /** 牌背图片路径 */
  backImage: string;
  /** 图片 alt 描述 */
  alt: string;
};

export type Scene = {
  key: SceneKey;
  label: string;
  title: string;
  description: string;
  rewrite: string;
  freeTitle: string;
  freeInsight: string;
  freeAction: string;
  freePaywallTeaser: string;
  cards: TarotCard[];
};

export type TimeWindow = {
  label: string;
  advice: string;
};

export type DeepResult = {
  clarifierCard: TarotCard & { message: string };
  hiddenMotive: string;
  windows: TimeWindow[];
  risks: string[];
  actionPlan: string[];
  followUps: string[];
};

export type Reading = {
  id: string;
  scene: SceneKey;
  question: string;
  rewrittenQuestion: string;
  spreadType: string;
  cards: TarotCard[];
  freeResult: {
    summary: string;
    insight: string;
    action: string;
    paywallTeaser: string;
  };
  deepResult?: DeepResult;
  paymentStatus: "free" | "paid" | "mock_paid";
  createdAt: string;
  source?: "mock" | "ai" | "fallback";
};
