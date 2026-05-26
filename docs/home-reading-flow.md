# 首页 AI 塔罗抽卡 · 完整流程与状态机

> 文档版本：v1.0 ｜ 更新日期：2026-05-26

---

## 一、完整流程（8 步）

```
┌─────────────────────────────────────────────────────────┐
│ 1. 选择问题类型                                           │
│    用户在 4 个 tab 中选择最接近当前处境的场景               │
│    · 感情关系  · 是/否判断  · 选择对比  · 职业决策         │
│                                                         │
│ 2. 输入具体问题                                           │
│    用户用自己的话描述当前卡住的事（必填，≤200字）           │
│    placeholder 提供示例，但 textarea 初始为空               │
│                                                         │
│ 3. AI 改写为更适合复盘的问题                               │
│    · 改写卡片实时预览改写结果                              │
│    · 用户未输入时显示轻提示，不展示默认爱情问题               │
│    · 改写风格由选择的「AI 引导者」决定                      │
│                                                         │
│ 4. 点击「改写问题并洗牌」                                   │
│    · 用户未输入问题 → 提示"请先写下你想探索的问题"            │
│    · 已输入 → 发送 API 请求，进入 shuffling 状态            │
│                                                         │
│ 5. 展示洗牌 / 翻牌动画                                    │
│    · collecting（收拢 300ms）→ shuffling（洗牌 400ms）     │
│    · → flipping（逐张展开，stagger 380ms）                  │
│    · 舞台中显示单个 MathCurveLoader，不出现多重动画          │
│    · prefers-reduced-motion 下直接展示结果                  │
│                                                         │
│ 6. 三张牌生成免费洞察                                      │
│    · 翻牌完毕后展示 enhanced free result：                  │
│      - summary（标题式总结）                                │
│      - currentState（当前处境 80-120字）                    │
│      - cardSynthesis（三牌组合解读 120-180字）               │
│      - action（今日低风险行动）                              │
│      - risk（容易踩的坑）                                   │
│      - paywallTeaser（付费引导）                            │
│                                                         │
│ 7. 第四张澄清牌作为付费解锁点                                │
│    · 第四张牌与前三张同一视觉基线，略靠右、略暗、轻微旋转      │
│    · 标签统一为「解锁澄清牌」                                │
│    · 点击 → 跳转 /pricing 页面                             │
│    · 已解锁 → 跳转 /reading/[id] 完整报告页                 │
│                                                         │
│ 8. 支付后进入完整报告页                                     │
│    · /reading/[id] 展示：                                  │
│      - 三张牌详细解读 + 第四张澄清牌（盲区揭示）               │
│      - 隐藏动机分析                                         │
│      - 1-3天 / 7天 / 4周 时间窗口                           │
│      - 7 日行动剧本                                         │
│      - 追问建议                                             │
└─────────────────────────────────────────────────────────┘
```

---

## 二、状态机

```
                    ┌─────────┐
                    │  idle   │  ← 初始状态，卡牌扇开呼吸动画
                    └────┬────┘
                         │ 用户点击「改写问题并洗牌」
                         ▼
                    ┌──────────┐
                    │ validating│  ← 校验问题非空（前端校验）
                    └────┬─────┘
                         │ 问题为空？
                    ┌────┴────┐
                    ▼         ▼
               error      ┌──────────┐
               (提示      │ shuffling │  ← API 请求中，舞台显示 lemniscate loader
               输入问题)   └────┬─────┘
                               │ API 返回成功
                               ▼
                          ┌──────────┐
                          │generating │  ← 收拢卡片 (collecting 300ms)
                          └────┬─────┘
                               │
                               ▼
                          ┌──────────┐
                          │ flipping │  ← 逐张翻牌 (stagger 380ms)
                          └────┬─────┘
                               │ 三张牌全部翻开
                               ▼
                          ┌──────────┐
                          │ revealed │  ← 展示免费洞察 + 第四张锁定牌
                          └────┬─────┘
                               │ 用户点击第四张牌
                          ┌────┴────┐
                          ▼         ▼
                    已解锁?      未解锁?
                    /reading    /pricing
                    /[id]       ?readingId=xxx

异常分支：
  idle ──(API error)──▶ error ──(重试)──▶ idle
  idle ──(安全拒答)──▶ blocked ──(修改问题)──▶ idle
```

### 状态说明

| 状态         | 含义                | 用户可见                             |
| ------------ | ------------------- | ------------------------------------ |
| `idle`       | 初始状态，未抽牌    | 卡牌扇开呼吸动画，洞察区显示引导文案 |
| `validating` | 前端校验问题        | 瞬间完成，空问题则弹 error           |
| `shuffling`  | API 请求 + 收拢动画 | 舞台显示 lemniscate loader，按钮置灰 |
| `generating` | 卡片收拢中          | collecting → shuffling 过渡          |
| `flipping`   | 逐张翻牌            | 三张牌依次翻转（stagger 效果）       |
| `revealed`   | 翻牌完成            | 免费洞察区展开，第四张牌可点击       |
| `error`      | API 调用失败        | 洞察区显示错误信息 + 重试按钮        |
| `blocked`    | 安全拒答            | 洞察区显示温馨提醒                   |

---

## 三、关键设计决策

### 3.1 问题输入

- **初始值**：空字符串（不是 DEFAULT_QUESTION）
- **placeholder**：提供场景相关示例（如"我和他最近忽冷忽热，我该主动沟通吗？"）
- **空值校验**：前端在 drawCards 中先检查 `question.trim()`，为空则直接设 error 状态
- **AI 改写卡片**：用户未输入时显示轻提示「写下你的问题后，AI 会帮你改写…」

### 3.2 动画策略

- **单一 loader 来源**：仅在 `card-stage-loader` 中显示 MathCurveLoader
- **按钮 shimmer**：已移除 `is-busy::after` 动画
- **prefers-reduced-motion**：全局 `@media (prefers-reduced-motion: reduce)` 关闭所有动画
- **代码中的 reduced motion**：`prefersReducedMotion()` 函数 → 跳过动画直接 revealed

### 3.3 第四张牌定位

- 使用 CSS 变量 `--card-w`、`--card-h`、`--card-y`、`--card-gap` 统一控制
- 第四张牌与前三张处于同一 `--card-y` 基线
- 略靠右（`card-w + gap*2 + 18px`），略暗（`brightness(0.65)`），轻微旋转（`6deg`）
- 标签统一为「解锁澄清牌」

### 3.4 免费结果结构

| 字段            | 字数      | 说明           |
| --------------- | --------- | -------------- |
| `summary`       | 16-28字   | 标题式总结     |
| `currentState`  | 80-120字  | 当前处境分析   |
| `cardSynthesis` | 120-180字 | 三牌串联解读   |
| `action`        | 50-90字   | 今日低风险行动 |
| `risk`          | 50-90字   | 容易踩的坑     |
| `paywallTeaser` | 60-100字  | 付费引导       |

### 3.5 分类标签

| key    | 首页标签  | SEO 页面标题 | 短说明                 |
| ------ | --------- | ------------ | ---------------------- |
| love   | 感情关系  | 爱情塔罗     | 暧昧、复合、边界感     |
| yesno  | 是/否判断 | 是否塔罗     | 要不要、该不该、能不能 |
| choice | 选择对比  | 二选一       | A/B 两个方向怎么选     |
| career | 职业决策  | 职业选择     | 跳槽、转型、项目选择   |

---

## 四、相关文件索引

| 文件                               | 职责                             |
| ---------------------------------- | -------------------------------- |
| `app/page.tsx`                     | 首页布局入口                     |
| `components/TarotRoom.tsx`         | 核心抽卡交互 + 动画 + 洞察展示   |
| `components/UserRetention.tsx`     | 复访欢迎栏 + 每日指引 + 最近记录 |
| `components/MarketingSections.tsx` | 首页 SEO 入口卡片 + 功能展示     |
| `lib/content.ts`                   | 场景定义、mock 数据              |
| `lib/ai/prompts.ts`                | AI prompt 模板                   |
| `lib/ai/provider.ts`               | AI provider 抽象层               |
| `lib/ai/schema.ts`                 | AI 输出校验                      |
| `lib/types.ts`                     | 类型定义                         |
| `app/api/reading/free/route.ts`    | 免费解读 API 端点                |
| `app/globals.css`                  | 全局样式 + 设计 token            |
| `docs/home-reading-flow.md`        | 本文档                           |
