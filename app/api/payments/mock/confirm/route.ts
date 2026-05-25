/**
 * POST /api/payments/mock/confirm
 *
 * 模拟支付确认。
 * 请求体：{ orderId, result: "success" | "failed" }
 *
 * 逻辑：
 * - result 为 success 时，订单变 paid，创建 unlock，reading.paymentStatus 更新为 mock_paid。
 * - result 为 failed 时，订单变 failed。
 * - 幂等：重复确认同一订单不会重复创建 unlock。
 */

import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";
import {
  createUnlock,
  findUnlockByReadingId,
} from "@/lib/repositories/unlocks";
import { setPaymentStatus } from "@/lib/repositories/readings";

export async function POST(request: Request) {
  /* 1. 解析 body */
  let body: { orderId?: unknown; result?: unknown };
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON", message: "请求体必须是合法 JSON。" },
      { status: 400 },
    );
  }

  /* 2. 校验参数 */
  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  if (!orderId) {
    return NextResponse.json(
      { error: "MISSING_ORDER_ID", message: "缺少 orderId。" },
      { status: 400 },
    );
  }

  const result = body.result;
  if (result !== "success" && result !== "failed") {
    return NextResponse.json(
      { error: "INVALID_RESULT", message: "result 必须是 success 或 failed。" },
      { status: 400 },
    );
  }

  /* 3. 调用支付 provider 确认 */
  const provider = getPaymentProvider();
  const confirmResult = await provider.confirmMockPayment!({
    orderId,
    result,
  });

  /* 4. 支付成功 → 创建 unlock + 更新 reading.paymentStatus */
  if (result === "success" && confirmResult.status === "paid") {
    // 幂等：检查 unlock 是否已存在
    const existingUnlock = findUnlockByReadingId(confirmResult.readingId);
    if (!existingUnlock) {
      createUnlock(confirmResult.readingId, orderId);
    }

    // 更新 reading 的 paymentStatus
    setPaymentStatus(confirmResult.readingId, "mock_paid");
  }

  /* 5. 支付失败 → 更新 reading.paymentStatus */
  if (result === "failed" && confirmResult.status === "failed") {
    setPaymentStatus(confirmResult.readingId, "failed");
  }

  return NextResponse.json(confirmResult);
}
