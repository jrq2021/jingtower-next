import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const pages = [
    { path: "", priority: 1.0 },
    { path: "/pricing", priority: 0.9 },
    { path: "/cards", priority: 0.9 },
    { path: "/legal/disclaimer", priority: 0.5 },
    { path: "/love-tarot", priority: 0.8 },
    { path: "/career-tarot", priority: 0.8 },
    { path: "/yes-no-tarot", priority: 0.8 },
    { path: "/daily-tarot", priority: 0.8 },
    { path: "/spreads", priority: 0.8 },
    { path: "/tarot-guides", priority: 0.8 },
  ];

  return pages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page.priority,
  }));
}
