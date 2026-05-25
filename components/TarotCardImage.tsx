"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

/* ─── types ─── */

export interface CardImageData {
  name: string;
  role?: string;
  keyword?: string;
  orientation?: "正位" | "逆位";
  image?: string;
  backImage?: string;
  alt?: string;
}

export interface TarotCardImageProps {
  card: CardImageData;
  /** 是否翻开显示牌面 */
  revealed?: boolean;
  /** 是否锁定（显示牌背 + 锁定文案） */
  locked?: boolean;
  /** 锁定文案 */
  lockedLabel?: string;
  size?: "sm" | "md" | "lg";
  /** 是否显示牌名标签（在卡片下方） */
  showLabel?: boolean;
  /** 是否在牌面上叠加底部渐变标签（牌名 + 正逆位） */
  overlayLabel?: boolean;
  /** next/image priority */
  priority?: boolean;
  className?: string;
  onClick?: () => void;
}

/* ─── size map ─── */

const sizeMap: Record<
  "sm" | "md" | "lg",
  { width: number; height: number; className: string }
> = {
  sm: { width: 120, height: 180, className: "tci-sm" },
  md: { width: 180, height: 270, className: "tci-md" },
  lg: { width: 240, height: 360, className: "tci-lg" },
};

/* ─── component ─── */

export function TarotCardImage({
  card,
  revealed = false,
  locked = false,
  lockedLabel = "解锁澄清牌",
  size = "md",
  showLabel = false,
  overlayLabel = false,
  priority = false,
  className = "",
  onClick,
}: TarotCardImageProps) {
  const { width, height, className: sizeClass } = sizeMap[size];

  /* 图片加载失败 → fallback 到文字 */
  const [imgError, setImgError] = useState(false);
  const [backError, setBackError] = useState(false);

  const handleImgError = useCallback(() => setImgError(true), []);
  const handleBackError = useCallback(() => setBackError(true), []);

  /* ─── 决定显示哪张图 ─── */
  const showFace = revealed && !locked;
  const imgSrc = showFace ? card.image : card.backImage;
  const imgAlt = card.alt ?? `${card.name} 塔罗牌`;

  /* 是否需要 fallback */
  const needFallback = showFace
    ? !imgSrc || imgError
    : locked || !imgSrc || backError;

  const containerClass = [
    "tarot-card-image",
    sizeClass,
    locked ? "tci-locked" : "",
    revealed && !locked ? "tci-revealed" : "",
    showLabel ? "tci-has-label" : "",
    onClick ? "tci-clickable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  /* ─── 牌背 CSS fallback ─── */
  if (!showFace && needFallback) {
    return (
      <div
        className={containerClass}
        onClick={onClick}
        role="img"
        aria-label={locked ? lockedLabel : "牌背"}
      >
        <div className="tci-fallback-back">
          {locked && <span className="tci-locked-label">{lockedLabel}</span>}
          {!locked && <span className="tci-back-pattern" aria-hidden="true" />}
        </div>
        {showLabel && <span className="tci-label">{card.name}</span>}
      </div>
    );
  }

  /* ─── 牌面 CSS fallback ─── */
  if (showFace && needFallback) {
    return (
      <div
        className={`${containerClass} tci-fallback-face`}
        onClick={onClick}
        role="img"
        aria-label={imgAlt}
      >
        <div className="tci-fallback-face-inner">
          <span className="tci-fallback-name">{card.name}</span>
          <small className="tci-fallback-orient">
            {card.orientation ?? "正位"}
          </small>
          {card.keyword && (
            <em className="tci-fallback-keyword">{card.keyword}</em>
          )}
        </div>
        {showLabel && <span className="tci-label">{card.name}</span>}
      </div>
    );
  }

  /* ─── 正常图片渲染 ─── */
  return (
    <div className={containerClass} onClick={onClick}>
      <Image
        src={imgSrc!}
        alt={imgAlt}
        width={width}
        height={height}
        priority={priority}
        onError={showFace ? handleImgError : handleBackError}
        style={{ objectFit: "cover" }}
        sizes={size === "sm" ? "120px" : size === "md" ? "180px" : "240px"}
      />
      {showFace && overlayLabel && (
        <span className="tci-overlay-label">
          {card.name}
          {card.orientation ? ` · ${card.orientation}` : ""}
        </span>
      )}
      {showLabel && <span className="tci-label">{card.name}</span>}
    </div>
  );
}
