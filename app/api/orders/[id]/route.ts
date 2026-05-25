/**
 * GET /api/orders/[id]
 *
 * 查询订单状态。
 * 不返回敏感字段。
 */

import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const provider = getPaymentProvider();
  const result = await provider.queryPayment(id);

  if (!result) {
    return NextResponse.json(
      { error: "ORDER_NOT_FOUND", message: "订单不存在。" },
      { status: 404 },
    );
  }

  // 只返回安全字段
  return NextResponse.json({
    orderId: result.orderId,
    status: result.status,
    amount: result.amount,
    currency: result.currency,
    productType: result.productType,
    readingId: result.readingId,
    createdAt: result.createdAt,
    paidAt: result.paidAt,
  });
}
