import type { MajorCard } from "./types";

/* ─── 图片路径 helper ─── */

const BASE = "/tarot/deck-v1";
const BACK = `${BASE}/backs/default.webp`;

function cardImage(id: string): string {
  return `${BASE}/major/${id}.webp`;
}

function cardAlt(name: string, keywords: string[]): string {
  return `${name}塔罗牌，象征${keywords.slice(0, 3).join("、")}`;
}

export const majorArcana: MajorCard[] = [
  {
    id: "fool",
    number: 0,
    name: "愚者",
    keywords: ["冒险", "新开始", "未知", "信任"],
    image: cardImage("fool"),
    backImage: BACK,
    alt: cardAlt("愚者", ["冒险", "新开始", "未知"]),
    upright:
      "全新的旅程正在召唤你，带着初心出发比做好万全准备更重要。不要被未知吓退，此刻的你拥有足够的勇气。",
    reversed:
      "你在犹豫是否迈出第一步。过度分析让你停滞，害怕犯错反而错过时机。问问自己：最坏的结果你能否承受？",
    love: "关系可能处于初期阶段。不确定是正常的，不必急着定义。先享受当下的连接，让关系自然生长。",
    career:
      "一个大胆的职业尝试正在等你。不适合做长期承诺，但适合做一次小的实验性行动：投一份简历、参加一次面试。",
    state:
      "你正站在某个新阶段的门槛上。兴奋和不安并存，这恰恰说明你在意。先走一小步，不必看完全程。",
    action: "写下你一直想做但不敢做的三件事，挑一件本周完成第一步。",
  },
  {
    id: "magician",
    number: 1,
    name: "魔术师",
    keywords: ["资源", "行动力", "专注", "创造"],
    image: cardImage("magician"),
    backImage: BACK,
    alt: cardAlt("魔术师", ["资源", "行动力", "专注"]),
    upright:
      "你已拥有启动所需的一切资源。不需要再等待更好的时机，此刻就是你行动的最佳窗口。",
    reversed:
      "能力与目标可能暂时错配。你也许在伪装自信，或者把精力花在了错误的方向上。先盘点真正可用的资本。",
    love: "你有能力推动关系进展。但不意味着强行控制——真正的魔力是用真诚吸引，而非技巧操控。",
    career:
      "你的技能和资源已经就位。本周适合展示能力、申请机会或启动一个酝酿已久的项目。",
    state:
      "能量充沛，方向清晰。你清楚自己在做什么，也相信自己能做到。保持这股专注力。",
    action:
      "列出你当前拥有的三项核心资源（技能、人脉、信息），选择一项立即使用。",
  },
  {
    id: "high-priestess",
    number: 2,
    name: "女祭司",
    keywords: ["直觉", "潜意识", "内省", "秘密"],
    image: cardImage("high-priestess"),
    backImage: BACK,
    alt: cardAlt("女祭司", ["直觉", "潜意识", "内省"]),
    upright:
      "答案不在外部，而在你内心深处。安静下来，倾听身体和情绪给出的信号，它们比头脑更诚实。",
    reversed:
      "你在逃避自己的直觉，或者过于依赖外部意见。别人给不了你答案，你需要回到自己的内心。",
    love: "有些话还没说出口，有些真相还没浮出水面。不急于揭开，先感受关系的底层温度。",
    career:
      "表面信息不够支撑决策。去找那些没写在招聘启事里的真实情况，做一次信息访谈。",
    state:
      "你正在消化一些深层信息。表面平静但内在活跃，适合独处、记录梦境或写日记。",
    action:
      "今天给自己 15 分钟安静时间，不做任何事，只是感受当下的情绪和身体。",
  },
  {
    id: "empress",
    number: 3,
    name: "皇后",
    keywords: ["丰盛", "滋养", "创造力", "自然"],
    image: cardImage("empress"),
    backImage: BACK,
    alt: cardAlt("皇后", ["丰盛", "滋养", "创造力"]),
    upright:
      "你正在进入一个生长和收获的阶段。允许自己享受成果，也允许自己慢下来感受生活的丰盛。",
    reversed:
      "你可能在过度付出而忽略了自己。或者对物质的追求盖过了内心真正的需求。检查你的能量收支。",
    love: "关系需要被滋养，而不是被策略和技巧驱动。真诚的关心比精心设计的言语更有力量。",
    career:
      "适合做与创意、照顾、教育相关的工作。如果你在做不喜欢的事，考虑增加一些创造性元素。",
    state:
      "你的身心在呼唤关照。好好吃饭、好好睡觉不是浪费时间，是在为下一阶段储备能量。",
    action: "今天做一件纯粹为了愉悦自己的事，不与任何目标挂钩。",
  },
  {
    id: "emperor",
    number: 4,
    name: "皇帝",
    keywords: ["秩序", "权威", "边界", "稳定"],
    image: cardImage("emperor"),
    backImage: BACK,
    alt: cardAlt("皇帝", ["秩序", "权威", "边界"]),
    upright:
      "建立规则和边界的时候到了。混乱不会自己消失，你需要主动为生活搭建框架。",
    reversed:
      "你或许在逃避承担责任，或过于僵化地固守过时的规则。检查你的边界是否合理：太硬会断，太软会被践踏。",
    love: "关系需要结构和承诺来稳定。如果对方不愿意建立边界，你需要自己先划清底线。",
    career:
      "适合建立长期规划，而不是频繁跳槽。找到你愿意持续深耕的方向，用纪律而非激情推动。",
    state:
      "你渴望秩序和安全感。先从整理一件小事开始，一个整洁的空间会给内心带来秩序。",
    action: "为你当前最焦虑的一件事制定一个简单规则，并遵守三天。",
  },
  {
    id: "hierophant",
    number: 5,
    name: "教皇",
    keywords: ["传统", "导师", "信仰", "学习"],
    image: cardImage("hierophant"),
    backImage: BACK,
    alt: cardAlt("教皇", ["传统", "导师", "信仰"]),
    upright:
      "向有经验的人学习能节省你大量试错成本。找到一位值得信赖的导师或参考一个成熟体系。",
    reversed:
      "你可能在盲目遵循某种教条，或过度依赖权威。有些规则已经不适用于你当下的处境，需要重新检验。",
    love: "关系可能需要一个更正式的定义或承诺。但如果只是为了满足外部期待，先问问自己真正想要什么。",
    career:
      "适合在成熟的框架内深耕。不需要另辟蹊径，先在一个被验证的体系里做到优秀。",
    state: "你正在寻求某种确定性和指引。不必从零摸索，前人已经走过类似的路。",
    action: "找到一个在你在意领域有经验的人，真诚地请教一个问题。",
  },
  {
    id: "lovers",
    number: 6,
    name: "恋人",
    keywords: ["选择", "价值观", "关系", "契合"],
    image: cardImage("lovers"),
    backImage: BACK,
    alt: cardAlt("恋人", ["选择", "价值观", "关系"]),
    upright:
      "你面临一个需要价值观判断的选择，不是简单的好坏对错，而是什么对你更重要。",
    reversed:
      "价值观冲突让你难以抉择。你也许在回避一个需要诚实面对的选择，或者试图两边都不得罪。",
    love: "关系到了需要确认价值观是否一致的阶段。不是看对方说了什么，而是看对方做了什么。",
    career:
      "两个机会各有利弊。不要只看短期收益，看哪条路更符合你三年后想成为的样子。",
    state:
      "你正在做一个关于「你是谁」的选择。这个选择会定义接下来很长一段时间的方向。",
    action:
      "把你要选的两条路分别列出来，写下各三个「做了会后悔」和「不做会后悔」的理由。",
  },
  {
    id: "chariot",
    number: 7,
    name: "战车",
    keywords: ["意志力", "前进", "胜利", "掌控"],
    image: cardImage("chariot"),
    backImage: BACK,
    alt: cardAlt("战车", ["意志力", "前进", "胜利"]),
    upright:
      "你拥有强大的驱动力。现在是果断前行的时候，但方向盘要握稳，不要让情绪左右方向。",
    reversed:
      "方向可能失控。你推进得太快或太强硬，忽略了一些重要信号。先停下来检查你的动机和动力来源。",
    love: "你有能力推动关系发展。但注意：推进不等于强迫。确认对方也在同一方向上后再加速。",
    career:
      "适合果断做决定并执行。不需要完美方案，先动起来再调整。速度本身也是一种优势。",
    state:
      "你的斗志正旺。这股能量如果引导得好可以突破瓶颈，但需注意不要变成冲动和攻击性。",
    action: "选一件你已经想了很久的事，今天做出一个不可逆的小决定并执行。",
  },
  {
    id: "strength",
    number: 8,
    name: "力量",
    keywords: ["耐心", "柔韧", "内在力量", "信任"],
    image: cardImage("strength"),
    backImage: BACK,
    alt: cardAlt("力量", ["耐心", "柔韧", "内在力量"]),
    upright:
      "真正的力量不是压制，而是以柔克刚。耐心和信任是比强硬更持久的武器。",
    reversed:
      "自我怀疑正在消耗你。你比你以为的更有力量，只是暂时被焦虑掩盖了。先安抚内在的恐惧。",
    love: "关系不需要争输赢。退一步不是软弱，是为了更清楚地看到整体。你的温柔比愤怒更有说服力。",
    career: "不需要急于证明自己。持续稳定地交付价值，比一次爆发更让人信服。",
    state:
      "你正在经历内在的角力。不需要强迫自己马上变好，先接纳当下的状态，力量会自然恢复。",
    action:
      "今天找一个让你焦虑的念头，温柔地对自己说：这个担忧有道理，但它不能定义我。",
  },
  {
    id: "hermit",
    number: 9,
    name: "隐士",
    keywords: ["内省", "独处", "智慧", "指引"],
    image: cardImage("hermit"),
    backImage: BACK,
    alt: cardAlt("隐士", ["内省", "独处", "智慧"]),
    upright:
      "你需要暂时从外部世界抽离，回到自己的内心寻找答案。独处不是逃避，是为了更清晰地看见。",
    reversed:
      "你在过度孤立自己，或者拒绝了他人的帮助。内省很重要，但一直待在黑暗里会迷失方向。",
    love: "此刻更适合理解自己在一段关系里的需求，而不是向外寻找新的人。想清楚你要什么，才能找到对的人。",
    career:
      "适合做深度思考而非频繁行动。反思你的职业路径是否还在你想要的轨道上。",
    state:
      "你需要的不是更多信息，而是安静下来整理已有的体验。灯光不在远处，在你手里。",
    action: "今晚花 20 分钟独自散步，不带耳机，不听任何内容，只是走和感受。",
  },
  {
    id: "wheel-of-fortune",
    number: 10,
    name: "命运之轮",
    keywords: ["转变", "周期", "机遇", "顺应"],
    image: cardImage("wheel-of-fortune"),
    backImage: BACK,
    alt: cardAlt("命运之轮", ["转变", "周期", "机遇"]),
    upright:
      "生命中自然的转折点已经到来。不需要强力控制，顺势而行比对抗更明智。",
    reversed:
      "你正在抗拒不可避免的变化。或者感到自己被命运捉弄，看不到转机。但轮子还在转动，低点之后必然向上。",
    love: "关系可能正经历自然的变化周期。不是每一段低谷都意味着结束，有时候只是需要换个角度相处。",
    career:
      "外部环境在变化，你不需要掌控一切。关注那些正在打开的新门，而不是紧抓着即将关闭的旧门。",
    state:
      "你感到事物在流动，方向暂时不明确。这正是信任生命的时刻，观察比行动更重要。",
    action:
      "回顾你过去三年最大的三个变化，看看哪些是你控制的，哪些是自然发生的。",
  },
  {
    id: "justice",
    number: 11,
    name: "正义",
    keywords: ["公平", "因果", "责任", "真相"],
    image: cardImage("justice"),
    backImage: BACK,
    alt: cardAlt("正义", ["公平", "因果", "责任"]),
    upright:
      "你的选择会带来相应的结果。此刻需要冷静和诚实，做出符合你价值观的判断。",
    reversed:
      "你在逃避某个责任，或者拒绝面对某个真相。不公平感也许来自你对自己的不诚实。",
    love: "关系需要平等和互相尊重。如果天平长期倾斜，需要一次坦诚的对话来恢复平衡。",
    career:
      "你的努力会被看见，但需要时间。如果感到不被公平对待，先收集事实再决定是否提出。",
    state:
      "你渴望公正的对待或清晰的了结。确保你看到的是事实而非猜测，再做判断。",
    action:
      "列出当前让你感到不公平的三件事，分别标注哪些是事实、哪些是你的猜测。",
  },
  {
    id: "hanged-man",
    number: 12,
    name: "倒吊人",
    keywords: ["暂停", "牺牲", "新视角", "臣服"],
    image: cardImage("hanged-man"),
    backImage: BACK,
    alt: cardAlt("倒吊人", ["暂停", "牺牲", "新视角"]),
    upright:
      "停下来不是为了放弃，而是为了换个角度看问题。这段静止期是你最需要的调整。",
    reversed:
      "你在抗拒必要的暂停。或者用牺牲的姿态来逃避真正的行动。等待不是目的，看见不同的视角才是。",
    love: "关系可能需要你暂时退一步。不要急于解决所有问题，有时候换个立场就看到了对方的感受。",
    career:
      "不适合做重大决定。如果有瓶颈，尝试从完全不同的角度思考：如果是你的竞争对手，会如何看待你的处境？",
    state:
      "你感到被悬在半空，什么也做不了。这不是坏事——悬停让你有了平时看不到的视角。",
    action: "找一个你最纠结的问题，试着站在完全相反的立场上写一段辩护。",
  },
  {
    id: "death",
    number: 13,
    name: "死神",
    keywords: ["结束", "蜕变", "放手", "新生"],
    image: cardImage("death"),
    backImage: BACK,
    alt: cardAlt("死神", ["结束", "蜕变", "放手"]),
    upright:
      "某个阶段正在结束，这不是坏事，是为新的事物腾出空间。放手不是失去，是给新生让路。",
    reversed:
      "你紧抓着已经不再适合你的人、事或身份。害怕改变让你停滞，但不变才是最危险的。",
    love: "一段旧的关系模式需要结束，不一定是分手，而是告别旧有的相处方式。",
    career:
      "可能意味着跳槽、转行或项目的结束。不要恐惧，每一次结束都伴随着新的可能。",
    state:
      "你正在经历深层的蜕变。可能会感到失落或不安，但请相信：旧的壳裂开，是因为你已经长大了。",
    action:
      "写下一个你已经知道该放手但还在紧抓的东西，写下放手后最坏和最好的结果。",
  },
  {
    id: "temperance",
    number: 14,
    name: "节制",
    keywords: ["平衡", "调和", "耐心", "中庸"],
    image: cardImage("temperance"),
    backImage: BACK,
    alt: cardAlt("节制", ["平衡", "调和", "耐心"]),
    upright:
      "不急不缓，找到适合自己的节奏。极端的方法往往带来极端的后果，中道才是长久之道。",
    reversed:
      "你在某些方面过度或不足。可能太急切，也可能太克制。找到失衡的点并调整。",
    love: "关系需要磨合而非改造。接受对方的节奏，也保持自己的节奏，找到一个双方舒服的中间点。",
    career:
      "不要过度工作也别完全松懈。找到可持续的节奏，职业是马拉松而非冲刺。",
    state: "你正在寻找平衡。生活不需要完美，只需要各部分之间不那么冲突。",
    action:
      "审视你生活的四个维度（工作/关系/健康/兴趣），指出最失衡的一项并做一个小调整。",
  },
  {
    id: "devil",
    number: 15,
    name: "恶魔",
    keywords: ["束缚", "欲望", "阴影", "依赖"],
    image: cardImage("devil"),
    backImage: BACK,
    alt: cardAlt("恶魔", ["束缚", "欲望", "阴影"]),
    upright:
      "你可能被某种模式或执念困住了。这不是外力的束缚，而是你内心某些欲望在牵制你。",
    reversed:
      "你正在挣脱某种不健康的依赖或习惯。这个过程不容易，但你已经看到了链条的另一端。",
    love: "关系中可能有不健康的依赖或控制模式。不是指责对方，而是检查自己是否也在其中扮演了角色。",
    career:
      "你也许在为了金钱或安全感做一份消耗自己的工作。这份觉察本身就是改变的开始。",
    state:
      "你感到被某些欲望或恐惧驱动，而不是自由选择。问问自己：抛开恐惧，你还会做同样的选择吗？",
    action:
      "识别一个让你感到被困住的行为模式，写下如果不这样做你会得到的自由是什么。",
  },
  {
    id: "tower",
    number: 16,
    name: "高塔",
    keywords: ["突变", "崩塌", "觉醒", "重建"],
    image: cardImage("tower"),
    backImage: BACK,
    alt: cardAlt("高塔", ["突变", "崩塌", "觉醒"]),
    upright:
      "一个不再稳固的结构正在瓦解。虽然过程痛苦，但它让你看到真相，并为重建创造了条件。",
    reversed:
      "你在拼命维护一个注定要倒塌的东西。或者你预感到了变化但拒绝接受，导致焦虑累积。",
    love: "关系中长期回避的问题可能会爆发。这不是灾难，是清理积弊后重新建立更真实连接的契机。",
    career:
      "可能面临突然的变动。与其恐惧，不如看看这次变动暴露了什么你之前忽略的信号。",
    state:
      "你感到安全和惯性被打破。这是不舒服的，但也是让你重新审视生活基础的机会。",
    action:
      "写下你人生中过去三次「崩塌后反而更好」的经历，提醒自己变化不是终点。",
  },
  {
    id: "star",
    number: 17,
    name: "星星",
    keywords: ["希望", "疗愈", "愿景", "信心"],
    image: cardImage("star"),
    backImage: BACK,
    alt: cardAlt("星星", ["希望", "疗愈", "愿景"]),
    upright:
      "疗愈已经开始，你的信心正在回归。给自己一点时间，不必急于恢复到完美状态。",
    reversed:
      "你暂时看不到希望，或者对自己的未来缺乏信心。这不是永久的，只是你需要先处理好眼前的疲惫。",
    love: "关系进入疗愈期。过去的伤痛正在被温柔地对待，你可以慢慢重新打开自己。",
    career:
      "你的职业方向正在变得明朗。不必急着下结论，先跟随那些让你感到兴奋的信号。",
    state:
      "你正在从一段低谷中恢复。不用急着立刻振作，像对待受伤的朋友一样对待自己。",
    action:
      "写下你对未来最期待的一个画面，不需要现实，不需要可行，只需要让你嘴角上扬。",
  },
  {
    id: "moon",
    number: 18,
    name: "月亮",
    keywords: ["迷雾", "潜意识", "投射", "直觉"],
    image: cardImage("moon"),
    backImage: BACK,
    alt: cardAlt("月亮", ["迷雾", "潜意识", "投射"]),
    upright:
      "你正穿行在不确定的地带。不要急着要求清晰，先信任直觉的提醒——它看到了理性忽略的信息。",
    reversed:
      "恐惧被放大了，你所见的可能只是自己内心的投射。分辨哪些是真实的风险，哪些是想象的威胁。",
    love: "关系中存在不确定和隐藏的信息。不适合在此期间做出重大承诺，先观察和感受。",
    career:
      "信息不够透明，不适合做重大职业决定。先收集更多信息，特别是那些没写在招聘启事里的。",
    state:
      "你的潜意识正在活跃，梦境和直觉会给出线索。不必急着行动，先记录和观察。",
    action: "今晚睡前问自己一个问题，不做任何分析，明早记录第一个念头。",
  },
  {
    id: "sun",
    number: 19,
    name: "太阳",
    keywords: ["喜悦", "成功", "活力", "真诚"],
    image: cardImage("sun"),
    backImage: BACK,
    alt: cardAlt("太阳", ["喜悦", "成功", "活力"]),
    upright:
      "一切都在变好。你的努力正在被看见，你的快乐是真实的。享受此刻的温暖，不必怀疑它是否应得。",
    reversed:
      "你暂时感受不到光明，或者成功被某些阴影掩盖。不是太阳没升起，是有云层挡住了。",
    love: "关系充满温暖和真诚。适合表达感受、确认关系，或者单纯享受两人之间的明亮时光。",
    career:
      "成果正在显现。适合展示你的工作、接受认可、或者帮助他人。分享你的光芒不会让它变少。",
    state:
      "你的能量和信心都在高点。趁这股劲做那些需要勇气的事，快乐本身就是最好的催化剂。",
    action: "今天真诚地赞美或感谢一个人，不求回报，只是让温暖流动。",
  },
  {
    id: "judgement",
    number: 20,
    name: "审判",
    keywords: ["觉醒", "反思", "召唤", "重生"],
    image: cardImage("judgement"),
    backImage: BACK,
    alt: cardAlt("审判", ["觉醒", "反思", "召唤"]),
    upright:
      "你在被召唤去做一件你一直知道该做的事。这是一个需要诚实面对自己的时刻，过去的经历已经在塑造你的答案。",
    reversed:
      "你在逃避一个内在的召唤或反思。也许是时候放下自我批判，用慈悲的眼光看待过去的自己。",
    love: "关系到了一个需要「清算」的阶段。不是针对对方，而是回顾你在关系中学到了什么、成长了什么。",
    career:
      "你可能听到了某种职业召唤。也许不是换工作，而是用更符合你价值观的方式做现在的事。",
    state:
      "你在对过去做一次深层的复盘。不是为了自责，是为了从经历中提取智慧，然后轻装前行。",
    action: "写下过去一年你学到的最重要的三件事，以及它们如何改变了你。",
  },
  {
    id: "world",
    number: 21,
    name: "世界",
    keywords: ["完成", "圆满", "整合", "新周期"],
    image: cardImage("world"),
    backImage: BACK,
    alt: cardAlt("世界", ["完成", "圆满", "整合"]),
    upright:
      "一个完整的周期即将或已经完成。你已具备进入下一阶段的全部条件。不只是结束，更是全新的开始。",
    reversed:
      "你离完成还差最后一步。也许在拖延收尾，也许觉得自己还不够好。但其实你已经准备好了。",
    love: "一段关系或一个阶段趋向圆满。可能是关系升级，也可能是和平地结束并带着感恩离开。",
    career:
      "一个项目或职业阶段即将完满。适合做总结、交接、或者开始规划下一个目标。",
    state:
      "你感到一种整合和完整的体验。回头看看走过的路，你会发现自己已经走了很远。",
    action:
      "回顾过去的你，写下你想对一年前的自己说的一句话。然后，带着这句话进入下一程。",
  },
];

/* ─── 小阿卡纳花色模板 ─── */

export const suitTemplates = [
  {
    id: "wands",
    name: "权杖",
    keywords: ["行动", "热情", "创造", "意志"],
    image: `${BASE}/suits/wands.webp`,
    backImage: BACK,
    alt: "权杖花色，象征行动力与创造热情",
  },
  {
    id: "cups",
    name: "圣杯",
    keywords: ["情感", "直觉", "关系", "内省"],
    image: `${BASE}/suits/cups.webp`,
    backImage: BACK,
    alt: "圣杯花色，象征情感流动与直觉",
  },
  {
    id: "swords",
    name: "宝剑",
    keywords: ["思维", "决断", "挑战", "真相"],
    image: `${BASE}/suits/swords.webp`,
    backImage: BACK,
    alt: "宝剑花色，象征理性思维与决断力",
  },
  {
    id: "pentacles",
    name: "星币",
    keywords: ["物质", "稳定", "收获", "实践"],
    image: `${BASE}/suits/pentacles.webp`,
    backImage: BACK,
    alt: "星币花色，象征物质稳定与实践收获",
  },
];

export function getCardById(id: string): MajorCard | undefined {
  return majorArcana.find((c) => c.id === id);
}

/** 中文牌名 → 英文 id（用于图片路径查找） */
export function getCardIdByName(name: string): string | undefined {
  const card = majorArcana.find((c) => c.name === name);
  return card?.id;
}

export function searchCards(query: string): MajorCard[] {
  const q = query.trim().toLowerCase();
  if (!q) return majorArcana;
  return majorArcana.filter(
    (c) =>
      c.name.includes(q) ||
      c.keywords.some((k) => k.toLowerCase().includes(q)) ||
      c.upright.includes(q) ||
      c.reversed.includes(query),
  );
}

export type CardFilter = "all" | "love" | "career" | "state" | "action";

export function getCardSceneText(card: MajorCard, filter: CardFilter): string {
  switch (filter) {
    case "love":
      return card.love;
    case "career":
      return card.career;
    case "state":
      return card.state;
    case "action":
      return card.action;
    default:
      return card.upright;
  }
}
