# 镜塔 Tarot — Next.js 工程

中文 AI 塔罗牌室，提供爱情塔罗、每日塔罗、事业塔罗、牌义库和自我探索报告。
不提供确定性预测，只提供更完整的复盘结构和行动参考。

## 路由结构

| 路由 | 说明 | 类型 |
|---|---|---|
| `/` | 首页牌室（AI 改写 + 三牌阵抽牌 + 留存模块） | 静态 |
| `/reading/[id]` | 塔罗报告页（免费洞察 + 付费深度报告 + 分享卡） | 动态 |
| `/pricing` | 完整仪式解锁页（mock 支付流程） | 静态 |
| `/cards` | 22 张大阿卡纳牌义库（搜索 + 筛选 + 场景释义） | 静态 |
| `/legal/disclaimer` | 免责声明 | 静态 |
| `/love-tarot` | SEO：爱情塔罗入口 | 静态 |
| `/career-tarot` | SEO：事业塔罗入口 | 静态 |
| `/yes-no-tarot` | SEO：是否塔罗入口 | 静态 |
| `/daily-tarot` | SEO：每日塔罗入口 | 静态 |
| `/spreads` | SEO：牌阵库 | 静态 |
| `/tarot-guides` | SEO：入门指南 | 静态 |

API 路由：`/api/reading/free`、`/api/reading/deep`、`/api/reading/[id]`、`/api/reading/[id]/unlock`、`/api/orders/create`、`/api/orders/[id]`、`/api/payments/mock/confirm`、`/api/daily-card`、`/api/share-card`、`/api/analytics/track`

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量（可选，默认使用 mock）
copy .env.example .env

# 3. 启动开发服务器
npm run dev
```

打开 http://localhost:3000

## 生产构建

```bash
npm run build
npm run start
```

## 环境变量说明

复制 `.env.example` 为 `.env`，按需填入。以下变量没有真实 key 时项目仍可运行（默认 mock）：

| 变量 | 用途 | 默认值 |
|---|---|---|
| `AI_PROVIDER` | AI 类型：mock / deepseek / openai | `mock` |
| `AI_API_KEY` | AI 服务 API Key | （空） |
| `AI_BASE_URL` | AI API 地址 | `https://api.deepseek.com/v1` |
| `AI_MODEL` | 模型名称 | `deepseek-chat` |
| `AI_TIMEOUT_MS` | 请求超时（毫秒） | `20000` |
| `DATA_PROVIDER` | 数据存储：mock / supabase | `mock` |
| `ANALYTICS_PROVIDER` | 埋点：mock / plausible / posthog | `mock` |
| `ANALYTICS_ENDPOINT` | 埋点上报地址 | （空） |
| `ANALYTICS_API_KEY` | 埋点 API Key | （空） |
| `PAYMENT_PROVIDER` | 支付：mock / wechat / alipay | `mock` |
| `MOCK_PAYMENT_ENABLED` | 是否启用 mock 支付 | `true` |
| `NEXT_PUBLIC_SITE_URL` | 网站域名（OG/metadataBase） | `http://localhost:3000` |

> **注意**：服务端 key（AI_API_KEY 等）不要用 `NEXT_PUBLIC_` 前缀，前端只能读取 `NEXT_PUBLIC_` 开头的变量。

## Vercel 部署步骤

1. 将项目导入 Vercel（GitHub / GitLab / CLI）
2. 在 Vercel Dashboard → Settings → Environment Variables 中设置上述变量
3. 构建命令：`npm run build`
4. 输出目录：默认（Next.js 自动处理）
5. 设置 `NEXT_PUBLIC_SITE_URL` 为你的实际域名（如 `https://jingtower.com`）
6. 部署

## 当前 Mock 的模块

| 模块 | Mock 方式 | 说明 |
|---|---|---|
| AI 解读 | `lib/content.ts` mock 数据 | 设置 `AI_PROVIDER` + `AI_API_KEY` 可接入真实 AI |
| 支付 | Mock provider + 模拟确认按钮 | 设置 `PAYMENT_PROVIDER` 可接入微信/支付宝 |
| 数据库 | 内存 Map 存储（重启丢失） | 设置 `DATA_PROVIDER=supabase` 可接持久化 |
| 分享卡图片 | HTML 预览 | 可接入 Satori / html-to-image 生成海报 |
| 埋点 | console.log + 内存缓冲 | 设置 `ANALYTICS_PROVIDER` 接入 Plausible/PostHog |

## 项目结构

```
app/               # Next.js App Router 页面和 API
├── api/           # API 路由
├── cards/         # 牌义库
├── pricing/       # 付费页
├── reading/       # 报告页
├── legal/         # 免责声明
├── love-tarot/ ... # SEO 入口页
├── robots.ts      # robots.txt
├── sitemap.ts     # sitemap.xml
├── not-found.tsx  # 404 页面
├── error.tsx      # 错误页面
└── loading.tsx    # 加载状态
components/        # 共享组件
lib/               # 业务逻辑
├── analytics/     # 埋点抽象层
├── payments/      # 支付抽象层
├── repositories/  # 数据仓库
├── ai/            # AI provider
├── anonymous.ts   # 匿名用户 ID
├── seo-pages.ts   # SEO 页面数据
└── types.ts       # 前端类型定义
docs/              # 文档
```

## 合规说明

- 全站内容仅作娱乐与自我探索参考
- 不提供确定性预测，不承诺特定结果
- 不替代医疗、法律、投资等专业意见
- 敏感问题（医疗/投资/法律/自伤等）自动拦截，不进入付费流程
- 价格由服务端产品配置决定，前端不可传金额
- 不上报用户完整隐私问题
