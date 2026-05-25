"use client";

import { useCallback, useEffect, useRef } from "react";
import { TarotCardImage } from "@/components/TarotCardImage";
import type { MajorCard } from "@/lib/types";

interface CardDetailModalProps {
  card: MajorCard | null;
  open: boolean;
  onClose: () => void;
}

export function CardDetailModal({ card, open, onClose }: CardDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (open) {
      if (!el.open) el.showModal();
    } else {
      if (el.open) el.close();
    }
  }, [open]);

  /* ESC 关闭 */
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  /* 点击遮罩关闭 */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === dialogRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  if (!card) return null;

  return (
    <dialog
      ref={dialogRef}
      className="card-modal"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-label={`${card.name} 大图详情`}
    >
      <div className="card-modal-content">
        {/* 关闭按钮 */}
        <button
          className="card-modal-close"
          onClick={onClose}
          type="button"
          aria-label="关闭"
        >
          ✕
        </button>

        {/* 大图 */}
        <div className="card-modal-image">
          <TarotCardImage
            card={{
              name: card.name,
              image: card.image,
              backImage: card.backImage,
              alt: card.alt ?? `${card.name} 塔罗牌`,
            }}
            revealed={true}
            size="lg"
          />
        </div>

        {/* 信息 */}
        <div className="card-modal-info">
          <h2 className="card-modal-name">{card.name}</h2>

          <div className="card-modal-keywords">
            <div className="card-modal-kw-group">
              <span className="card-modal-kw-label">正位关键词</span>
              <div className="card-modal-kw-tags">
                {card.keywords.map((kw) => (
                  <span className="keyword-tag" key={kw}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="card-modal-kw-group">
              <span className="card-modal-kw-label">简短解释</span>
              <p className="card-modal-desc">{card.upright}</p>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
