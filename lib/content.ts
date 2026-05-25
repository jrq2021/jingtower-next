import type { Reading, Scene, SceneKey, TarotCard } from "./types";

/* ─── 图片路径 helper ─── */
const IMG_BASE = "/tarot/deck-v1";
const IMG_BACK = `${IMG_BASE}/backs/default.webp`;
function sceneCardImage(name: string): string {
  const slugMap: Record<string, string> = {
    月亮: "moon",
    力量: "strength",
    星星: "star",
    恋人: "lovers",
    隐士: "hermit",
    战车: "chariot",
    正义: "justice",
    节制: "temperance",
    太阳: "sun",
    魔术师: "magician",
    高塔: "tower",
    星币八: "pentacles",
    愚者: "fool",
    女祭司: "high-priestess",
  };
  const slug = slugMap[name];
  return slug ? `${IMG_BASE}/major/${slug}.webp` : "";
}

export const scenes: Scene[] = [
  {
    key: "love",
    label: "爱情塔罗",
    title: "暧昧、复合、关系边界",
    description: "看清关系里的真实需求、阻力和下一步行动。",
    rewrite: "我想复盘这段关系里，真实需求、阻力和下一步行动是什么？",
    freeTitle: "先分清事实和猜测",
    freeInsight:
      "牌面提示你现在被不确定感牵动，适合先做一次低压力沟通，而不是直接追问最终答案。",
    freeAction: "发一条不逼迫对方表态的消息，只确认一个事实。",
    freePaywallTeaser:
      "解锁第四张澄清牌：你真正害怕的是什么？以及 7 日关系复盘路线。",
    cards: [
      {
        name: "月亮",
        role: "现状",
        keyword: "迷雾",
        upright: "直觉提醒",
        reversed: "恐惧放大",
        image: sceneCardImage("月亮"),
        backImage: IMG_BACK,
        alt: "月亮塔罗牌，象征迷雾、投射和潜意识",
      },
      {
        name: "力量",
        role: "阻力",
        keyword: "耐心",
        upright: "以柔克刚",
        reversed: "自我怀疑",
        image: sceneCardImage("力量"),
        backImage: IMG_BACK,
        alt: "力量塔罗牌，象征耐心、柔韧和信任",
      },
      {
        name: "星星",
        role: "行动",
        keyword: "希望",
        upright: "信心回归",
        reversed: "方向迷失",
        image: sceneCardImage("星星"),
        backImage: IMG_BACK,
        alt: "星星塔罗牌，象征希望、疗愈和愿景",
      },
    ],
  },
  {
    key: "yesno",
    label: "是否塔罗",
    title: "快速判断与风险提醒",
    description: "把是或否拆成信号强弱、风险和行动。",
    rewrite: "我想把这个是否问题拆成可观察的信号、风险和下一步行动。",
    freeTitle: "答案不是一句是或否",
    freeInsight:
      "这类问题更适合看信号强弱。先验证关键事实，再决定是否继续投入。",
    freeAction: "列出支持/反对各三条事实证据，不做直觉判断。",
    freePaywallTeaser:
      "解锁第四张澄清牌：你忽略的关键变量是什么？以及时间窗口建议。",
    cards: [
      {
        name: "正义",
        role: "判断",
        keyword: "边界",
        upright: "客观权衡",
        reversed: "逃避责任",
        image: sceneCardImage("正义"),
        backImage: IMG_BACK,
        alt: "正义塔罗牌，象征公平、因果和责任",
      },
      {
        name: "节制",
        role: "风险",
        keyword: "平衡",
        upright: "节奏刚好",
        reversed: "操之过急",
        image: sceneCardImage("节制"),
        backImage: IMG_BACK,
        alt: "节制塔罗牌，象征平衡、调和和耐心",
      },
      {
        name: "太阳",
        role: "建议",
        keyword: "确认",
        upright: "方向正确",
        reversed: "还需等待",
        image: sceneCardImage("太阳"),
        backImage: IMG_BACK,
        alt: "太阳塔罗牌，象征喜悦、成功和活力",
      },
    ],
  },
  {
    key: "choice",
    label: "二选一",
    title: "选择 A / B 的差异",
    description: "比较两个选项背后的收益、代价和适配度。",
    rewrite: "我想比较两个选择背后的收益、代价和更适合我的行动路径。",
    freeTitle: "把选择变成代价比较",
    freeInsight:
      "牌面提醒你不要只看哪条路更诱人，也要看哪条路更符合你当前能量。",
    freeAction: "为两条路各写一个「最低成本小测试」，本周完成其中一个。",
    freePaywallTeaser:
      "解锁第四张澄清牌：两条路之外是否有第三条？以及隐藏动机分析。",
    cards: [
      {
        name: "恋人",
        role: "选择 A",
        keyword: "连接",
        upright: "真心契合",
        reversed: "价值观冲突",
        image: sceneCardImage("恋人"),
        backImage: IMG_BACK,
        alt: "恋人塔罗牌，象征选择、价值观和契合",
      },
      {
        name: "隐士",
        role: "选择 B",
        keyword: "审视",
        upright: "内省智慧",
        reversed: "过度孤立",
        image: sceneCardImage("隐士"),
        backImage: IMG_BACK,
        alt: "隐士塔罗牌，象征内省、独处和智慧",
      },
      {
        name: "战车",
        role: "行动",
        keyword: "推进",
        upright: "果断前行",
        reversed: "方向失控",
        image: sceneCardImage("战车"),
        backImage: IMG_BACK,
        alt: "战车塔罗牌，象征意志力、前进和胜利",
      },
    ],
  },
  {
    key: "career",
    label: "职业选择",
    title: "机会、阻力、低风险行动",
    description: "适合跳槽、转型、接项目和短期赚钱决策。",
    rewrite: "我想复盘当前职业选择里的机会、阻力和下一步低风险行动。",
    freeTitle: "先做可逆的小动作",
    freeInsight:
      "职业问题不需要一次押注。先收集信息、测试机会，再做更大的决定。",
    freeAction: "本周做一次信息访谈或投一份试探性简历，不急于做决定。",
    freePaywallTeaser:
      "解锁第四张澄清牌：你的核心竞争力在哪？以及 7 日职业推进剧本。",
    cards: [
      {
        name: "魔术师",
        role: "机会",
        keyword: "资源",
        upright: "万事俱备",
        reversed: "能力错配",
        image: sceneCardImage("魔术师"),
        backImage: IMG_BACK,
        alt: "魔术师塔罗牌，象征资源、行动力和创造",
      },
      {
        name: "高塔",
        role: "阻力",
        keyword: "变化",
        upright: "破而后立",
        reversed: "恐惧改变",
        image: sceneCardImage("高塔"),
        backImage: IMG_BACK,
        alt: "高塔塔罗牌，象征突变、崩塌和觉醒",
      },
      {
        name: "星币八",
        role: "行动",
        keyword: "打磨",
        upright: "日拱一卒",
        reversed: "重复消耗",
        image: `${IMG_BASE}/suits/pentacles.webp`,
        backImage: IMG_BACK,
        alt: "星币花色，象征物质稳定与实践收获",
      },
    ],
  },
];

export const cardMeanings: TarotCard[] = [
  { name: "月亮", role: "状态", keyword: "迷雾、投射、潜意识" },
  { name: "恋人", role: "选择", keyword: "连接、价值观、关系边界" },
  { name: "力量", role: "行动", keyword: "耐心、柔韧、信任" },
  { name: "星星", role: "疗愈", keyword: "希望、恢复、愿景" },
  { name: "愚者", role: "开始", keyword: "冒险、新计划、未知" },
  { name: "正义", role: "判断", keyword: "边界、后果、公平感" },
];

export function getScene(key: SceneKey | string = "love"): Scene {
  return scenes.find((scene) => scene.key === key) ?? scenes[0];
}

export function createMockReading(
  sceneKey: SceneKey = "love",
  question = "我和他最近忽冷忽热，我该主动沟通吗？",
): Reading {
  const scene = getScene(sceneKey);

  // 基于问题长度伪随机决定正逆位，保证同一问题始终得到相同结果
  const cardsWithOrientation: TarotCard[] = scene.cards.map((card, index) => {
    const seed = (question.length * 7 + index * 13) % 2;
    return {
      ...card,
      orientation: seed === 0 ? ("正位" as const) : ("逆位" as const),
    };
  });

  return {
    id:
      crypto.randomUUID?.() ??
      `reading-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    scene: scene.key,
    question,
    rewrittenQuestion:
      question.length > 3
        ? `我想复盘「${question}」背后的真实需求、阻力和下一步低风险行动。`
        : scene.rewrite,
    spreadType: "three-card",
    cards: cardsWithOrientation,
    freeResult: {
      summary: scene.freeTitle,
      insight: scene.freeInsight,
      action: scene.freeAction,
      paywallTeaser: scene.freePaywallTeaser,
    },
    paymentStatus: "free",
    createdAt: new Date().toISOString(),
    source: "mock" as const,
  };
}

export const growthLoops = [
  ["每日牌", "每天一张牌，给自己一个温和的提醒。", "日常"],
  ["最近 5 次", "回看最近的开卡记录，看看哪些主题反复出现。", "记录"],
  ["牌义宇宙", "了解每张牌在爱情、事业和状态里的不同含义。", "牌义"],
  ["主题牌组", "选择你喜欢的牌面风格，让开卡更有仪式感。", "风格"],
] as const;

/* ─── mock deep result per scene ─── */

import type { DeepResult } from "./types";

const deepMocks: Record<SceneKey, DeepResult> = {
  love: {
    clarifierCard: {
      name: "女祭司",
      role: "盲区",
      keyword: "直觉",
      orientation: "正位",
      upright: "倾听内心",
      reversed: "逃避真相",
      message: "你真正需要的是先信任自己的直觉，而不是向外寻找确定性。",
    },
    hiddenMotive:
      "你害怕的是不被选择，而不是没有答案。你的深层需求是被看见和被确认。",
    windows: [
      { label: "1-3 天", advice: "只观察对方回应稳定度，不做任何判断或逼迫。" },
      {
        label: "7 天",
        advice: "看对方是否愿意推进具体安排，而不是停留在情绪聊天。",
      },
      {
        label: "4 周",
        advice: "复盘你是否还在消耗自己：这段关系让你更完整还是更焦虑？",
      },
    ],
    risks: [
      "反复试探会让对方感受到压力而非吸引",
      "把猜测当事实会让你陷入自我实现的预言",
      "忽略自己的生活和朋友会导致过度依赖关系",
    ],
    actionPlan: [
      "第 1 天：写下一个你确认的事实和一个你在猜测的事，分开记录",
      "第 2 天：发一次低压力沟通，不追问、不逼迫",
      "第 3 天：暂停重复试探一天，观察自己的情绪变化",
      "第 4 天：做一件和关系无关、但让你开心的小事",
      "第 5 天：记录对方的回应模式，不看内容看规律",
      "第 6 天：和朋友聊一次，获取外部视角",
      "第 7 天：复盘整周，写下一个决定：继续、暂停还是调整边界",
    ],
    followUps: [
      "如果我主动会怎样？",
      "如果我等待会怎样？",
      "如果我放下会怎样？",
    ],
  },
  yesno: {
    clarifierCard: {
      name: "命运之轮",
      role: "盲区",
      keyword: "时机",
      orientation: "正位",
      upright: "顺势而为",
      reversed: "错失时机",
      message: "答案不在是或否，而在这个时间点做决定是否合适。",
    },
    hiddenMotive: "你真正的不安不是选错，而是怕自己承担不了选择的后果。",
    windows: [
      {
        label: "1-3 天",
        advice: "收集支持/反对的事实证据各三条，不做直觉判断。",
      },
      { label: "7 天", advice: "找一个已经经历过类似选择的人聊聊实际体验。" },
      { label: "4 周", advice: "用一个月的时间验证关键假设，再做最终决定。" },
    ],
    risks: [
      "短期情绪会放大对风险的恐惧",
      "他人的选择不一定适合你的处境",
      "拖延本身也是一种选择，需要设定决策截止日",
    ],
    actionPlan: [
      "第 1 天：列出支持 vs 反对各三条客观事实",
      "第 2 天：定位最关键的假设，设计一个小测试验证它",
      "第 3 天：咨询一个有经验的人，记录他们的实际经历",
      "第 4 天：写下最坏结果和应对方案，评估自己能否承受",
      "第 5 天：对比「做了后悔」vs「不做后悔」哪个更让你睡不着",
      "第 6 天：给自己设一个决策截止日，写在日历上",
      "第 7 天：做出初步决定，标注需要继续观察的信号",
    ],
    followUps: [
      "如果我选择 A 会怎样？",
      "如果我选择 B 会怎样？",
      "如果我两者都不选会怎样？",
    ],
  },
  choice: {
    clarifierCard: {
      name: "皇帝",
      role: "盲区",
      keyword: "秩序",
      orientation: "逆位",
      upright: "果断决策",
      reversed: "逃避责任",
      message: "两个选项之外，你是否在逃避自己真正想要的东西？",
    },
    hiddenMotive:
      "两条路可能都不是最佳选择，你真正需要的是给自己第三个可能性。",
    windows: [
      {
        label: "1-3 天",
        advice: "为每条路写一个「最低成本小测试」，限时完成其中一个。",
      },
      {
        label: "7 天",
        advice: "分别体验两条路的一天日常，用身体感受而非头脑判断。",
      },
      { label: "4 周", advice: "评估哪条路让你更有能量，而不是更安全。" },
    ],
    risks: [
      "非此即彼的思维可能让你错过第三条路",
      "过度分析会导致行动瘫痪",
      "选择之后反复回头看会让你无法全心投入",
    ],
    actionPlan: [
      "第 1 天：为两条路各写一个可执行的小测试方案",
      "第 2 天：完成方案 A 的小测试，记录感受",
      "第 3 天：完成方案 B 的小测试，记录感受",
      "第 4 天：列出两条路之外的第三个可能性",
      "第 5 天：比较三个选项的「能量消耗」vs「成长收益」",
      "第 6 天：和下一个人分享你的思考，获取反馈",
      "第 7 天：做出暂时性选择，设 2 周后复盘检查点",
    ],
    followUps: [
      "如果我选 A 会怎样？",
      "如果我选 B 会怎样？",
      "如果有一条新路出现会怎样？",
    ],
  },
  career: {
    clarifierCard: {
      name: "世界",
      role: "盲区",
      keyword: "完成",
      orientation: "正位",
      upright: "周期结束",
      reversed: "未完成",
      message: "你已具备转型的条件，只是需要确认自己真正的竞争优势。",
    },
    hiddenMotive:
      "你不是不确定能不能换工作，而是不确定换了之后自己是否更有价值。",
    windows: [
      {
        label: "1-3 天",
        advice: "信息访谈：找一个已在你目标领域的人聊聊真实日常。",
      },
      {
        label: "7 天",
        advice: "投一份试探性简历或参加一次行业活动，测试市场反应。",
      },
      {
        label: "4 周",
        advice: "盘点你当前的核心竞争力，看看哪些可以迁移到新领域。",
      },
    ],
    risks: [
      "理想化新机会而忽略其弊端",
      "低估现有工作中积累的可迁移能力",
      "在情绪低谷时做职业决定容易过度悲观",
    ],
    actionPlan: [
      "第 1 天：定位 1-2 个目标岗位，分析招聘需求",
      "第 2 天：联系一个目标领域的人做信息访谈",
      "第 3 天：更新简历，突出可迁移能力",
      "第 4 天：参加一次行业活动或线上分享",
      "第 5 天：投一份试探性简历或不正式申请",
      "第 6 天：盘点当前工作中的核心竞争力和gap",
      "第 7 天：综合信息，做出下一步行动决定",
    ],
    followUps: [
      "如果我跳槽会怎样？",
      "如果我留下会怎样？",
      "如果我转行会怎样？",
    ],
  },
};

export function createMockDeepResult(sceneKey: SceneKey = "love"): DeepResult {
  return deepMocks[sceneKey] ?? deepMocks.love;
}
