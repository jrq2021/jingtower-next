"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ─── types ─── */

export type CardRarity = "normal" | "gold" | "locked" | "revealed";
export type CardIntensity = "soft" | "medium" | "strong";

export interface AnimatedTarotCardProps {
  children: ReactNode;
  /** 是否启用动效（翻牌完成后才激活） */
  active?: boolean;
  /** 稀有度，影响特效风格 */
  rarity?: CardRarity;
  /** 动效强度 */
  intensity?: CardIntensity;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 点击处理 */
  onClick?: () => void;
  /** aria-label */
  ariaLabel?: string;
}

/* ─── helpers ─── */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function mapTilt(offset: number, maxOffset: number, maxDeg: number): number {
  const ratio = Math.max(-1, Math.min(1, offset / maxOffset));
  return ratio * maxDeg;
}

/* ─── sparkle config ─── */

const SPARKLE_COUNT: Record<CardRarity, number> = {
  normal: 0,
  gold: 5,
  locked: 3,
  revealed: 6,
};

function generateSparkles(count: number): Array<{
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}> {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 8 + Math.random() * 84,
    top: 6 + Math.random() * 88,
    size: 1.5 + Math.random() * 2.5,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
  }));
}

/* ─── component ─── */

export function AnimatedTarotCard({
  children,
  active = true,
  rarity = "gold",
  intensity = "medium",
  className = "",
  onClick,
  ariaLabel,
}: AnimatedTarotCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState<ReturnType<typeof generateSparkles>>(
    [],
  );
  const [mounted, setMounted] = useState(false);

  /* 客户端挂载后生成粒子（避免 SSR hydration 不匹配） */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* 检测 reduced motion */
  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* 客户端挂载 + reduced 确定后，再生成粒子 */
  useEffect(() => {
    if (!mounted || reduced) {
      setSparkles([]);
      return;
    }
    setSparkles(generateSparkles(SPARKLE_COUNT[rarity]));
  }, [mounted, reduced, rarity]);

  /* 指针移动 → tilt + glare */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!active || reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const offsetX = e.clientX - cx;
      const offsetY = e.clientY - cy;

      const maxDeg =
        intensity === "strong" ? 14 : intensity === "medium" ? 8 : 4;
      setTiltX(mapTilt(-offsetY, rect.height / 2, maxDeg));
      setTiltY(mapTilt(offsetX, rect.width / 2, maxDeg));

      // Glare follows pointer as percentage
      setGlareX(((e.clientX - rect.left) / rect.width) * 100);
      setGlareY(((e.clientY - rect.top) / rect.height) * 100);
    },
    [active, reduced, intensity],
  );

  const handlePointerEnter = useCallback(() => {
    if (!active || reduced) return;
    setIsHovered(true);
  }, [active, reduced]);

  const handlePointerLeave = useCallback(() => {
    setTiltX(0);
    setTiltY(0);
    setGlareX(50);
    setGlareY(50);
    setIsHovered(false);
  }, []);

  /* 构建 class */
  const containerClass = [
    "atc-container",
    `atc-rarity-${rarity}`,
    `atc-intensity-${intensity}`,
    active ? "atc-active" : "",
    isHovered ? "atc-hovered" : "",
    reduced ? "atc-reduced" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const innerStyle: CSSProperties = reduced
    ? {}
    : {
        transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: isHovered
          ? "transform 120ms ease-out"
          : "transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)",
      };

  const glareStyle: CSSProperties = reduced
    ? { display: "none" }
    : {
        background: `radial-gradient(
          ellipse at ${glareX}% ${glareY}%,
          rgba(255, 255, 255, 0.22) 0%,
          rgba(255, 246, 228, 0.08) 30%,
          transparent 60%
        )`,
        opacity: isHovered ? 1 : 0,
        transition: "opacity 350ms ease",
      };

  return (
    <div
      ref={containerRef}
      className={containerClass}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      aria-label={ariaLabel}
    >
      {/* 3D 变换层 */}
      <div className="atc-inner" style={innerStyle}>
        {/* 边缘金色 glow */}
        <div className="atc-glow" aria-hidden="true" />

        {/* Holo shimmer 扫光 */}
        <div className="atc-shimmer" aria-hidden="true" />

        {/* 鼠标驱动的 radial glare */}
        <div className="atc-glare" style={glareStyle} aria-hidden="true" />

        {/* 牌面内容 */}
        <div className="atc-content">{children}</div>

        {/* 星尘粒子 */}
        {!reduced &&
          sparkles.length > 0 &&
          sparkles.map((s) => (
            <span
              key={s.id}
              className="atc-sparkle"
              aria-hidden="true"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
      </div>
    </div>
  );
}
