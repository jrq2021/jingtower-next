/**
 * Analytics 埋点类型定义
 *
 * 所有事件类型和字段规范。
 */

/* ─── 事件名枚举 ─── */

export const AnalyticsEvents = {
  PAGE_VIEW: "page_view",
  START_READING: "start_reading",
  REWRITE_QUESTION: "rewrite_question",
  DRAW_CARDS: "draw_cards",
  VIEW_FREE_RESULT: "view_free_result",
  CLICK_UNLOCK: "click_unlock",
  CREATE_ORDER: "create_order",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILED: "payment_failed",
  VIEW_DEEP_RESULT: "view_deep_result",
  SHARE_CARD_OPEN: "share_card_open",
  SHARE_CARD_DOWNLOAD: "share_card_download",
  SAFETY_BLOCKED: "safety_blocked",
  CARD_ENTRY_CLICK: "card_entry_click",
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

/* ─── 事件载荷 ─── */

export interface AnalyticsEvent {
  /** 事件名 */
  event: AnalyticsEventName;
  /** ISO 时间戳 */
  timestamp: string;
  /** 匿名用户 ID */
  anonymousId: string;
  /** 关联的 reading ID（可选） */
  readingId?: string;
  /** 场景（love/career/yesno/choice） */
  scene?: string;
  /** 数据来源（mock/ai/fallback） */
  source?: string;
  /** 牌阵类型 */
  spreadType?: string;
  /** 支付状态 */
  paymentStatus?: string;
  /** 产品类型 */
  productType?: string;
  /** 订单 ID */
  orderId?: string;
  /** 当前页面路径 */
  page?: string;
  /** 问题长度（不存原文） */
  questionLength?: number;
  /** 安全拦截类别（不存原文） */
  safetyCategory?: string;
  /** 扩展元数据 */
  metadata?: Record<string, string | number | boolean | undefined>;
}

/* ─── Analytics Provider 接口 ─── */

export interface AnalyticsProvider {
  /** 发送单个事件 */
  send(event: AnalyticsEvent): Promise<void>;
  /** 批量发送事件 */
  sendBatch?(events: AnalyticsEvent[]): Promise<void>;
  /** 刷新缓冲区 */
  flush?(): Promise<void>;
}
