"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
  /** 匹配规则：pathname 以此开头即为 active */
  match: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
  {
    label: "牌室",
    href: "/",
    match: (p) => p === "/",
  },
  {
    label: "报告",
    href: "/reading/demo-reading",
    match: (p) => p.startsWith("/reading"),
  },
  {
    label: "牌义库",
    href: "/cards",
    match: (p) => p.startsWith("/cards"),
  },
  {
    label: "会员",
    href: "/pricing",
    match: (p) => p.startsWith("/pricing") || p.startsWith("/membership"),
  },
  {
    label: "免责声明",
    href: "/legal/disclaimer",
    match: (p) => p.startsWith("/legal/disclaimer"),
  },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="镜塔 Tarot 首页">
        <span className="brand-mark" aria-hidden="true" />
        <span>镜塔 Tarot</span>
      </Link>
      <nav className="nav-links" aria-label="主导航">
        {navItems.map(({ label, href, match }) => {
          const isActive = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={isActive ? "nav-active" : ""}
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <Link className="header-cta" href="/#room">
        进入牌室
      </Link>
    </header>
  );
}
