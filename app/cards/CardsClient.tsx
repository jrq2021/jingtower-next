"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { searchCards, getCardSceneText } from "@/lib/cards";
import { trackEvent } from "@/lib/analytics/client";
import { TarotCardImage } from "@/components/TarotCardImage";
import { CardDetailModal } from "@/components/CardDetailModal";
import type { CardFilter } from "@/lib/cards";
import type { MajorCard } from "@/lib/types";

const FILTERS: { key: CardFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "love", label: "爱情" },
  { key: "career", label: "事业" },
  { key: "state", label: "状态" },
  { key: "action", label: "行动" },
];

export function CardsClient() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CardFilter>("all");
  const [modalCard, setModalCard] = useState<MajorCard | null>(null);

  const openModal = useCallback((card: MajorCard) => setModalCard(card), []);
  const closeModal = useCallback(() => setModalCard(null), []);

  useEffect(() => {
    trackEvent("page_view", { page: "/cards" });
  }, []);

  const searched = useMemo(() => searchCards(query), [query]);
  const displayCards = searched;

  const sceneLabel: Record<CardFilter, string> = {
    all: "正位",
    love: "爱情",
    career: "事业",
    state: "状态",
    action: "行动",
  };

  return (
    <>
      <section className="page-hero compact">
        <h1>塔罗牌义库</h1>
        <p>
          22 张大阿卡纳，每张牌都是自我探索的一面镜子。
          不是词典，是重新认识自己与做出行动复盘的入口。
        </p>
      </section>

      <section className="library-tools" aria-label="牌义筛选">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索牌名或关键词：月亮、迷雾、选择..."
          aria-label="搜索牌名或关键词"
        />
        <div>
          {FILTERS.map(({ key, label }) => (
            <button
              className={key === filter ? "guide-chip active" : "guide-chip"}
              key={key}
              onClick={() => setFilter(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {displayCards.length === 0 ? (
        <section className="library-empty">
          <p>没有找到匹配的牌。试试其他关键词。</p>
          <button
            className="button ghost"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            type="button"
          >
            清空筛选
          </button>
        </section>
      ) : (
        <section className="library-grid">
          {displayCards.map((card) => {
            const sceneText = getCardSceneText(card, filter);
            return (
              <article className="meaning-card" key={card.id}>
                <div className="meaning-card-top">
                  <span className="card-number">
                    {String(card.number).padStart(2, "0")}
                  </span>
                  <h2>{card.name}</h2>
                </div>
                <div
                  className="meaning-card-image"
                  onClick={() => openModal(card)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openModal(card);
                    }
                  }}
                  aria-label={`查看 ${card.name} 大图`}
                >
                  <TarotCardImage card={card} revealed={true} size="sm" />
                </div>
                <div className="meaning-keywords">
                  {card.keywords.map((kw) => (
                    <span className="keyword-tag" key={kw}>
                      {kw}
                    </span>
                  ))}
                </div>
                <div className="meaning-scene">
                  <span className="meaning-scene-label">
                    {sceneLabel[filter]}
                  </span>
                  <p>{sceneText}</p>
                </div>
                <Link
                  className="meaning-action"
                  href="/#room"
                  onClick={() =>
                    trackEvent("card_entry_click", {
                      metadata: {
                        cardName: card.name,
                        cardNumber: card.number,
                      },
                    })
                  }
                >
                  用这张牌开一次牌
                </Link>
              </article>
            );
          })}
        </section>
      )}

      <section className="library-footer">
        <p>牌义库帮助你理解每张牌的能量，但真正的答案在你心里。</p>
        <div className="library-related">
          <span className="library-related-title">相关入口</span>
          <div className="library-related-links">
            <Link href="/love-tarot">爱情塔罗</Link>
            <Link href="/career-tarot">事业塔罗</Link>
            <Link href="/daily-tarot">每日塔罗</Link>
            <Link href="/spreads">牌阵库</Link>
            <Link href="/tarot-guides">入门指南</Link>
          </div>
        </div>
        <Link className="button primary" href="/#room">
          回到牌室，开始抽牌
        </Link>
      </section>

      <CardDetailModal
        card={modalCard}
        open={modalCard !== null}
        onClose={closeModal}
      />
    </>
  );
}
