/**
 * 支付产品定义
 * 所有价格固定在这里，服务端决定金额，前端不可传价格。
 */

export interface Product {
  productType: ProductType;
  name: string;
  /** 金额：单位分（CNY） */
  amount: number;
  currency: "CNY";
  /** 展示价格 */
  displayPrice: string;
  /** 描述 */
  description: string;
}

export type ProductType = "single_deep_reading" | "three_pack";

export const PRODUCTS: Record<ProductType, Product> = {
  single_deep_reading: {
    productType: "single_deep_reading",
    name: "单次完整仪式",
    amount: 990,
    currency: "CNY",
    displayPrice: "¥9.9",
    description: "单次解锁，永久可回看",
  },
  three_pack: {
    productType: "three_pack",
    name: "3 次完整仪式包",
    amount: 1990,
    currency: "CNY",
    displayPrice: "¥19.9",
    description: "适合反复复盘，可不同场景使用",
  },
};

/** 校验 productType 是否有效 */
export function isValidProductType(type: unknown): type is ProductType {
  return type === "single_deep_reading" || type === "three_pack";
}

/** 根据 productType 获取产品信息 */
export function getProduct(type: ProductType): Product {
  return PRODUCTS[type];
}

/** 获取所有产品列表 */
export function getAllProducts(): Product[] {
  return Object.values(PRODUCTS);
}
