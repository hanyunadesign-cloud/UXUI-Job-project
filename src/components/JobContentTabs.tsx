"use client";

import { type ReactNode, type RefObject } from "react";
import { clsx } from "clsx";
import { CompanyAnalysisCard } from "@/components/CompanyAnalysisCard";

// "공고 내용" / "기업 정보" 탭.
// tab/activeQuote는 AppealJobPanel이 관리한다 — "이렇게 어필하세요" 포인트를 클릭했을 때
// 이 탭을 "공고 내용"으로 전환하고, 근거 문장을 찾아 밑줄+스크롤해야 해서 상태를 끌어올렸다.
export function JobContentTabs({
  companyName,
  stage,
  description,
  summary,
  tab,
  onTabChange,
  activeQuote,
  quoteRef,
}: {
  companyName: string;
  stage: string;
  description: string;
  summary?: ReactNode;
  tab: "content" | "company";
  onTabChange: (tab: "content" | "company") => void;
  activeQuote: string | null;
  quoteRef: RefObject<HTMLSpanElement>;
}) {
  const quoteIndex = activeQuote ? description.indexOf(activeQuote) : -1;

  return (
    <div className="rounded-2xl bg-white p-6">
      <div className="mb-5 flex items-center gap-1 border-b border-neutral-100">
        <button
          type="button"
          onClick={() => onTabChange("content")}
          className={clsx(
            "-mb-px border-b-2 px-3 pb-2.5 text-sm font-semibold transition-colors",
            tab === "content"
              ? "border-primary text-ink"
              : "border-transparent text-neutral-400 hover:text-ink"
          )}
        >
          공고 내용
        </button>
        <button
          type="button"
          onClick={() => onTabChange("company")}
          className={clsx(
            "-mb-px border-b-2 px-3 pb-2.5 text-sm font-semibold transition-colors",
            tab === "company"
              ? "border-primary text-ink"
              : "border-transparent text-neutral-400 hover:text-ink"
          )}
        >
          기업 정보
        </button>
      </div>

      {/* 두 탭 콘텐츠를 항상 같은 grid 셀에 겹쳐 렌더링해서, 카드 높이가 항상 더 긴 쪽
          ("공고 내용")에 맞춰지게 한다. display:none 대신 invisible을 써야 grid 크기
          계산에 계속 포함된다 — 안 그러면 탭 전환마다 카드 높이가 들쭉날쭉해진다. 같은
          이유로 activeQuote 밑줄 대상 span도 항상 DOM에 남아있어야 탭이 "기업 정보"에
          있는 상태에서도 ref로 스크롤 위치를 계산할 수 있다. */}
      <div className="grid">
        <div
          className={clsx("col-start-1 row-start-1", tab !== "content" && "invisible")}
          aria-hidden={tab !== "content"}
        >
          {summary}
          <p className="whitespace-pre-wrap text-sm leading-relaxed tracking-[-0.005em] text-neutral-700">
            {quoteIndex >= 0 && activeQuote ? (
              <>
                {description.slice(0, quoteIndex)}
                <span
                  ref={quoteRef}
                  className="rounded bg-blue-50 underline decoration-2 decoration-primary underline-offset-2"
                >
                  {activeQuote}
                </span>
                {description.slice(quoteIndex + activeQuote.length)}
              </>
            ) : (
              description
            )}
          </p>
        </div>
        <div
          className={clsx("col-start-1 row-start-1", tab !== "company" && "invisible")}
          aria-hidden={tab !== "company"}
        >
          <CompanyAnalysisCard companyName={companyName} stage={stage} />
        </div>
      </div>
    </div>
  );
}
