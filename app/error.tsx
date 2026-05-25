"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("页面错误：", error);
  }, [error]);

  return (
    <div className="error-page-wrapper">
      <main className="error-page">
        <span className="error-icon" aria-hidden="true">
          {"🃏"}
        </span>
        <h1>出了一点小状况</h1>
        <p>牌阵暂时无法展开，这通常不是你的问题。</p>
        <p className="error-hint">
          可能是网络波动或服务暂时繁忙，稍等片刻再试试。
        </p>
        <div className="error-actions">
          <button className="button primary" onClick={reset} type="button">
            重新尝试
          </button>
          <Link className="button ghost" href="/">
            返回首页
          </Link>
        </div>
        <p className="error-compliance">
          仅作娱乐与自我探索参考，不替代专业意见。
        </p>
      </main>
    </div>
  );
}
