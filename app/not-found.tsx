import Link from "next/link";

export default function NotFound() {
  return (
    <div className="error-page-wrapper">
      <main className="error-page">
        <span className="error-icon" aria-hidden="true">
          ◇
        </span>
        <h1>页面未找到</h1>
        <p>这张牌还没有翻开，或者它已经回到了牌堆里。</p>
        <p className="error-hint">
          你寻找的页面可能已被移除、地址输入有误，或暂未开放。
        </p>
        <div className="error-actions">
          <Link className="button primary" href="/">
            返回牌室
          </Link>
          <Link className="button ghost" href="/cards">
            浏览牌义库
          </Link>
        </div>
        <p className="error-compliance">
          仅作娱乐与自我探索参考，不替代专业意见。
        </p>
      </main>
    </div>
  );
}
