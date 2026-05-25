/**
 * Reading Repository
 * 封装 Reading 的 CRUD 操作
 */

import {
  getReading,
  saveReading,
  updateReadingPaymentStatus,
  updateReadingDeepResult,
  generateId,
} from "./storage";
import type { ReadingModel } from "../models";
import type { Reading } from "../types";

/* ─── 类型转换 ─── */

export function toApiReading(model: ReadingModel): Reading {
  return {
    id: model.id,
    scene: model.scene,
    question: model.question,
    rewrittenQuestion: model.rewrittenQuestion,
    spreadType: model.spreadType,
    cards: model.cards,
    freeResult: model.freeResult,
    deepResult: model.deepResult ?? undefined,
    paymentStatus: model.paymentStatus === "mock_paid" ? "mock_paid"
      : model.paymentStatus === "paid" ? "paid"
      : "free",
    createdAt: model.createdAt,
    source: model.source,
  };
}

/* ─── CRUD ─── */

export function findReadingById(id: string): Reading | undefined {
  const model = getReading(id);
  if (!model) return undefined;
  return toApiReading(model);
}

export function createReading(
  input: Omit<ReadingModel, "id" | "createdAt" | "updatedAt">,
): Reading {
  const now = new Date().toISOString();
  const model: ReadingModel = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  saveReading(model);
  return toApiReading(model);
}

export function setPaymentStatus(
  id: string,
  status: ReadingModel["paymentStatus"],
): Reading | undefined {
  const model = updateReadingPaymentStatus(id, status);
  return model ? toApiReading(model) : undefined;
}

export function setDeepResult(
  id: string,
  deepResult: ReadingModel["deepResult"],
): Reading | undefined {
  const model = updateReadingDeepResult(id, deepResult);
  return model ? toApiReading(model) : undefined;
}

/* ─── Mock 辅助 ─── */

export function seedReading(reading: Reading): void {
  const now = new Date().toISOString();
  saveReading({
    ...reading,
    anonymousId: reading.id.startsWith("demo") ? null : undefined,
    source: reading.source ?? "mock",
    paymentStatus: reading.paymentStatus ?? "free",
    createdAt: reading.createdAt ?? now,
    updatedAt: now,
  });
}
