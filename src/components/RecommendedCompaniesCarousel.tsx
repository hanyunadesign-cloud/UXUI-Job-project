"use client";

import { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CompanyCard, type CompanyCardData } from "@/components/CompanyCard";

// 기존 그리드(2열 → sm 3열 → lg 4열)와 같은 개수가 한 화면에 딱 맞게 보이도록,
// 카드 너비를 "(100% - 그 개수만큼의 gap) / 개수"로 계산해 잘린 카드가 안 보이게 한다.
const CARD_WIDTH_CLASS =
  "w-[calc((100%-1rem)/2)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]";

export function RecommendedCompaniesCarousel({
  companies,
  followedIds,
  isLoggedIn,
}: {
  companies: CompanyCardData[];
  followedIds: Set<string>;
  isLoggedIn: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-lg font-bold text-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/gift.svg" alt="" className="h-6 w-6" aria-hidden />
          추천 기업
        </h2>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="이전 추천 기업"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100 active:scale-[0.92]"
          >
            <ChevronLeftIcon className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="다음 추천 기업"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100 active:scale-[0.92]"
          >
            <ChevronRightIcon className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-visible flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
      >
        {companies.map((company) => (
          <div key={company.id} className={CARD_WIDTH_CLASS}>
            <CompanyCard
              company={company}
              following={followedIds.has(company.id)}
              isLoggedIn={isLoggedIn}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
