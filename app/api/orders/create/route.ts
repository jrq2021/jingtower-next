/**
 * POST /api/orders/create
 *
 * 创建支付订单。
 * 请求体：{ readingId, productType }
 * 金额由服务端根据 productType 决定，前端不可传价格。
 */

import { NextResponse } from "next/server";
import { findReadingById } from "@/lib/repositories/readings";
import { getPaymentProvider } from "@/lib/payments/provider";
import { isValidProductType } from "@/lib/payments/products";

export async function POST(request: Request) {
  /* 1. 解析 body */
  let body: {
    readingId?: unknown;
    productType?: unknown;
    anonymousId?: unknown;
  };
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON", message: "请求体必须是合法 JSON。" },
      { status: 400 },
    );
  }

  /* 2. 校验 readingId */
  const readingId =
    typeof body.readingId === "string" ? body.readingId.trim() : "";
  if (!readingId) {
    return NextResponse.json(
      { error: "MISSING_READING_ID", message: "缺少 readingId。" },
      { status: 400 },
    );
  }

  // 校验 reading 是否存在（demo-reading 特殊放行）
  if (readingId !== "demo-reading") {
    const reading = findReadingById(readingId);
    if (!reading) {
      return NextResponse.json(
        { error: "READING_NOT_FOUND", message: "未找到对应报告，请先开卡。" },
        { status: 404 },
      );
    }
  }

  /* 3. 校验 productType */
  const productType = body.productType;
  if (!isValidProductType(productType)) {
    return NextResponse.json(
      {
        error: "INVALID_PRODUCT_TYPE",
        message: "无效的产品类型。可选：single_deep_reading, three_pack。",
        validTypes: ["single_deep_reading", "three_pack"],
      },
      { status: 400 },
    );
  }

  /* 4. 通过支付 provider 创建订单 */
  const anonymousId =
    typeof body.anonymousId === "string" ? body.anonymousId : null;

  const provider = getPaymentProvider();
  const result = await provider.createPayment({
    readingId,
    productType,
    anonymousId,
  });

  return NextResponse.json(result, { status: 201 });
}
