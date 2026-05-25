const blockedPatterns: Array<{ pattern: RegExp; category: string }> = [
  // 医疗健康
  {
    pattern:
      /诊断|癌症|肿瘤|怀孕|用药|处方|化验|检查报告|B超|CT|MRI|病灶|恶性|良性/,
    category: "医疗健康",
  },
  { pattern: /我是不是[得了有][一-龥]{1,6}(病|癌|症)/, category: "医疗健康" },
  { pattern: /什么药|吃什么药|该吃|药方|偏方/, category: "医疗健康" },
  // 投资理财
  {
    pattern:
      /股票|买入|卖出|基金|币圈|比特币|以太坊|加密货币|抄底|满仓|做空|做多|杠杆/,
    category: "投资理财",
  },
  {
    pattern: /该不该买|要不要卖|能不能买|值不值得投|会涨|会跌|涨停|跌停/,
    category: "投资理财",
  },
  {
    pattern: /投资建议|理财建议|财富自由|短线|长线|K线|行情/,
    category: "投资理财",
  },
  // 彩票博彩
  {
    pattern: /彩票|号码|下注|赌博|赌|六合彩|时时彩|PK10|竞彩|足彩|博彩/,
    category: "彩票博彩",
  },
  { pattern: /下一期|开奖|中奖|预测号码|特码/, category: "彩票博彩" },
  // 法律
  {
    pattern:
      /律师|判几年|起诉|违法|犯罪|判刑|胜诉|败诉|量刑|罪名|刑事责任|民事责任/,
    category: "法律",
  },
  { pattern: /是不是违法|会不会坐牢|要判|打官司能赢/, category: "法律" },
  // 生命安全
  {
    pattern: /自杀|自残|轻生|不想活|活不下去|结束生命|去死|死了算/,
    category: "生命安全",
  },
  { pattern: /怎么死|想死|死了一了百了|活着没意思/, category: "生命安全" },
  // 暴力伤害
  {
    pattern: /报复|杀了|弄死|废了|打残|威胁|伤害|害人|同归于尽/,
    category: "暴力伤害",
  },
];

const SAFETY_REJECT_MESSAGE =
  "这个问题涉及高风险专业判断，不适合用塔罗解读。请优先联系医生、律师、心理健康专业人士或当地紧急救助渠道。";

export function getSafetyFlag(question: string) {
  const hit = blockedPatterns.find((item) => item.pattern.test(question));

  return {
    blocked: !!hit,
    category: hit?.category ?? "",
    message: hit ? SAFETY_REJECT_MESSAGE : "",
  };
}
