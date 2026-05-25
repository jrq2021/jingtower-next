/**
 * GET /api/reading/[id]/unlock
 *
 * 查询阅读报告的解锁状态。
 * 返回 { unlocked: boolean, source: string }
 */

import { NextResponse } from "next/server";
import { isReadingUnlocked } from "@/lib/repositories/unlocks";
import { findReadingById } from "@/lib/repositories/readings";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // demo-reading 特殊处理
  if (id === "demo-reading") {
    return NextResponse.json({ unlocked: true, source: "demo" });
  }

  // 1. 检查 unlock 记录
  if (isReadingUnlocked(id)) {
    return NextResponse.json({ unlocked: true, source: "unlock_record" });
  }

  // 2. 检查 reading 的 paymentStatus（兼容直接设置的情况）
  const reading = findReadingById(id);
  if (
    reading?.paymentStatus === "paid" ||
    reading?.paymentStatus === "mock_paid"
  ) {
    return NextResponse.json({ unlocked: true, source: "payment_status" });
  }

  return NextResponse.json({ unlocked: false, source: "none" });
}
