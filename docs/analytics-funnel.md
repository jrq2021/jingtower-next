# 镜塔 Tarot — 转化漏斗 & 埋点说明

## 埋点架构

```
lib/analytics/
├── types.ts      # 事件类型定义 + AnalyticsProvider 接口
├── mock.ts       # Mock provider（console + 内存缓冲区）
├── client.ts     # 前端入口 trackEvent()
└── server.ts     # 服务端入口 trackServerEvent()

app/api/analytics/track/route.ts  # HTTP 上报端点（可选）
```

当前 provider 为 `mock`（console 输出 + 内存缓冲）。
后续替换为真实统计平台时，只需实现 `AnalyticsProvider` 接口并调用 `setAnalyticsProvider()`。

## 事件列表（13 个）

| 事件名 | 触发位置 | 关键字段 |
|---|---|---|
| `page_view` | 所有页面 onMount | page, scene |
| `start_reading` | 首页点击「改写问题并洗牌」 | scene, questionLength |
| `rewrite_question` | AI 改写问题完成后 | scene, readingId, questionLength |
| `draw_cards` | 三张牌抽取成功 | scene, readingId, source, spreadType |
| `view_free_result` | 翻牌动画结束（revealed） | scene, readingId, source |
| `click_unlock` | 点击 ¥9.9/¥19.9 解锁按钮 | productType, readingId, scene |
| `create_order` | 订单创建成功 | productType, readingId, orderId |
| `payment_success` | mock 支付成功 | productType, orderId, readingId |
| `payment_failed` | mock 支付失败 | productType, orderId |
| `view_deep_result` | 深度报告展示 | scene, readingId, source |
| `share_card_open` | 点击「生成分享卡」 | scene, readingId |
| `share_card_download` | 点击「下载分享卡」 | scene, readingId |
| `safety_blocked` | 高风险问题被拒答（前端+服务端各一次） | scene, questionLength, safetyCategory |
| `card_entry_click` | 牌义库点击「用这张牌开一次牌」 | cardName, cardNumber |

## 核心转化漏斗

```
page_view              ← 100% 到达
    ↓
start_reading          ← 输入问题并点击开始
    ↓
draw_cards             ← 抽牌成功（排除安全拒答和 API 错误）
    ↓
view_free_result       ← 翻牌动画完成，看到免费报告
    ↓
click_unlock           ← 点击解锁按钮
    ↓
create_order           ← 订单创建成功
    ↓
payment_success        ← 支付成功
    ↓
view_deep_result       ← 深度报告展示
    ↓
share_card_open        ← 生成分享卡
```

## 首月关注指标

| 指标 | 计算方式 | 说明 |
|---|---|---|
| 免费占卜次数 | count(draw_cards) | 核心活跃度 |
| 安全拒答率 | count(safety_blocked) / count(start_reading) | 问题质量 |
| 免费→付费点击率 | count(click_unlock) / count(view_free_result) | 付费意愿 |
| 订单创建率 | count(create_order) / count(click_unlock) | 流程顺畅度 |
| 支付成功率 | count(payment_success) / count(create_order) | mock 支付可靠性 |
| 付费转化率 | count(payment_success) / count(draw_cards) | 整体变现 |
| 分享卡打开率 | count(share_card_open) / count(view_deep_result) | 传播意愿 |
| 各 scene 转化率 | 按 scene 分组计算上述漏斗 | 场景对比优化 |

## 隐私保护规则

1. **不上报完整 question**：只上报 `questionLength`（字符数）
2. **不上报用户身份**：只使用 `anonymousId`（匿名标识）
3. **安全拒答不上报原文**：只上报 `safetyCategory`（医疗/投资/法律等类别）
4. **API 白名单过滤**：`/api/analytics/track` 只接受白名单字段
5. **埋点失败不影响主流程**：所有 `trackEvent` 调用包裹在 try-catch 中

## 后续接入真实统计平台

替换步骤：
1. 实现 `AnalyticsProvider` 接口（参考 `mock.ts`）
2. 在 `client.ts` 中调用 `setAnalyticsProvider()`
3. 在 `server.ts` 中调用 `setServerAnalyticsProvider()`

支持的目标平台：
- Plausible（自建 / Cloud）
- PostHog（开源 / Cloud）
- Google Analytics 4
- 百度统计
- 自建分析接口
