"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/client";
import type { SeoPageData } from "@/lib/seo-pages";

interface SeoLandingPageProps {
  page: SeoPageData;
}

export function SeoLandingPage({ page }: SeoLandingPageProps) {
  useEffect(() => {
    trackEvent("page_view", { page: `/${page.slug}` });
  }, [page.slug]);
  return (
    <>
      {/* H1 区域 */}
      <section className="seo-hero">
        <h1>{page.h1}</h1>
        <p className="seo-hero-desc">{page.description}</p>
      </section>

      {/* 内容段落 */}
      <section className="seo-sections">
        {page.sections.map((section, idx) => (
          <div className="seo-section-block" key={idx}>
            <h2>{section.title}</h2>
            <p className="seo-body">{section.body}</p>
            {section.examples && section.examples.length > 0 && (
              <ul className="seo-examples">
                {section.examples.map((ex, i) => (
                  <li key={i}>
                    <span className="seo-example-bullet" aria-hidden="true">
                      {section.title.includes("不建议") ? "✕" : "▸"}
                    </span>
                    {ex}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {/* CTA 区域 */}
      <section className="seo-cta-section">
        <div className="seo-cta-card">
          <h2>准备好开始了吗？</h2>
          <Link className="button primary seo-cta-btn" href={page.ctaHref}>
            {page.ctaLabel}
          </Link>
          {page.secondaryCtaLabel && page.secondaryCtaHref && (
            <Link className="button ghost" href={page.secondaryCtaHref}>
              {page.secondaryCtaLabel}
            </Link>
          )}
        </div>
        <p className="seo-compliance">
          仅作娱乐与自我探索参考，不提供确定性预测，不承诺特定结果。
          不替代医疗、法律、投资等专业意见。
        </p>
      </section>
    </>
  );
}
