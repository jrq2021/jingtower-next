import { NextResponse } from "next/server";
import { findReadingById } from "@/lib/repositories/readings";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const reading = findReadingById(id);
  if (!reading) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "未找到该报告。可能已过期或 ID 不正确。" },
      { status: 404 },
    );
  }

  // 隐私保护：不返回完整 question（仅返回 rewrittenQuestion）
  const safeReading = {
    ...reading,
    question: "",
  };

  return NextResponse.json({ reading: safeReading });
}
