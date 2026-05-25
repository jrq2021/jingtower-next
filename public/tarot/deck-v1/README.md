# 塔罗牌图片资产 · Deck v1

## 目录结构

```
public/tarot/deck-v1/
├── backs/          # 牌背图片
├── major/          # 22 张大阿卡纳
└── suits/          # 4 组小阿卡纳花色模板
```

## 图片规格

| 属性     | 推荐值                   |
| -------- | ------------------------ |
| 尺寸     | 1024×1536 或 768×1152    |
| 比例     | **2 : 3**                |
| 格式     | `.webp`（优先）或 `.png` |
| 单张大小 | < 300KB                  |
| 色彩空间 | sRGB                     |

## 命名规则

### 牌背

- `backs/default.webp` — 默认牌背

### 大阿卡纳 (22 张)

文件名使用英文 ID，与 `lib/cards.ts` 中 `id` 字段对应：

| 文件名                        | 牌名     | 编号 |
| ----------------------------- | -------- | ---- |
| `major/fool.webp`             | 愚者     | 0    |
| `major/magician.webp`         | 魔术师   | 1    |
| `major/high-priestess.webp`   | 女祭司   | 2    |
| `major/empress.webp`          | 皇后     | 3    |
| `major/emperor.webp`          | 皇帝     | 4    |
| `major/hierophant.webp`       | 教皇     | 5    |
| `major/lovers.webp`           | 恋人     | 6    |
| `major/chariot.webp`          | 战车     | 7    |
| `major/strength.webp`         | 力量     | 8    |
| `major/hermit.webp`           | 隐士     | 9    |
| `major/wheel-of-fortune.webp` | 命运之轮 | 10   |
| `major/justice.webp`          | 正义     | 11   |
| `major/hanged-man.webp`       | 倒吊人   | 12   |
| `major/death.webp`            | 死神     | 13   |
| `major/temperance.webp`       | 节制     | 14   |
| `major/devil.webp`            | 恶魔     | 15   |
| `major/tower.webp`            | 高塔     | 16   |
| `major/star.webp`             | 星星     | 17   |
| `major/moon.webp`             | 月亮     | 18   |
| `major/sun.webp`              | 太阳     | 19   |
| `major/judgement.webp`        | 审判     | 20   |
| `major/world.webp`            | 世界     | 21   |

### 小阿卡纳花色模板 (4 张)

| 文件名                 | 花色 |
| ---------------------- | ---- |
| `suits/wands.webp`     | 权杖 |
| `suits/cups.webp`      | 圣杯 |
| `suits/swords.webp`    | 宝剑 |
| `suits/pentacles.webp` | 星币 |

## 图片缺失时的行为

如果图片文件尚未放入对应目录，前端会自动 fallback 到当前文字牌面样式（CSS 绘制），不会白屏或报错。

## 生成建议

- 使用 Midjourney / Stable Diffusion 生成后手动挑选
- 保持同一套 prompt 风格以确保 22 张牌视觉一致
- 建议风格：暗色星图 + 羊皮纸底 + 金色线条 + 克制用色
