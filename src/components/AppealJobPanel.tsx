"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { JobContentTabs } from "@/components/JobContentTabs";
import { AppealPointsCard } from "@/components/AppealPointsCard";
import type { CompanyAnalysisData } from "@/components/CompanyAnalysisCard";
import type { AppealPoint } from "@/lib/appeal-points-data";

// "이렇게 어필하세요" 포인트 클릭 → "공고 내용" 탭으로 전환 + 근거 문장 밑줄 + 스크럴 이동을
// 위해 JobContentTabs/AppealPointsCard가 공유해야 하는 상태(탭, 활성 인용문)를 여기서 들고
// 있는다. 부모(page.tsx)는 서버 컴포넌트라 상태를 못 들고 있어서 이 클라이언트 래퍼가 필요.
//
// div.contents로 감싸서 이 컴포넌트의 두 자식이 부모의 CSS Grid(lg:grid-cols-[1.4fr_1fr])에
// 직접 참여하게 한다 — 안 그러면 이 컴포넌트 자체가 grid item 하나로 잡혀서 레이아웃이 깨진다.
export function AppealJobPanel({
  jobId,
  companyName,
  stage,
  companyData,
  points,
  description,
  summary,
}: {
  jobId: string;
  companyName: string;
  stage: string;
  // 마이페이지 "링크로 추가" 공고용 — 저장 시점에 AI가 만든 기업 정보/어필 포인트를 직접
  // 넘긴다. 넘기면 CompanyAnalysisCard/AppealPointsCard가 하드코딩 맵 대신 이 값을 쓴다.
  companyData?: CompanyAnalysisData;
  points?: AppealPoint[];
  description: string;
  summary?: ReactNode;
}) {
  const [tab, setTab] = useState<"content" | "company">("content");
  const [activeQuote, setActiveQuote] = useState<string | null>(null);
  const quoteRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeQuote) {
      quoteRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeQuote]);

  // 두 패널 바깥을 누르면 선택(파란 테두리 + 밑줄)을 해제한다. display:contents인
  // containerRef도 실제 DOM 노드라 contains() 판정에 문제없이 쓸 수 있다.
  useEffect(() => {
    if (!activeQuote) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setActiveQuote(null);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [activeQuote]);

  const handleSelectQuote = (quote: string) => {
    setTab("content");
    setActiveQuote(quote);
  };

  return (
    <div ref={containerRef} className="contents">
      <JobContentTabs
        companyName={companyName}
        stage={stage}
        companyData={companyData}
        description={description}
        summary={summary}
        tab={tab}
        onTabChange={setTab}
        activeQuote={activeQuote}
        quoteRef={quoteRef}
      />
      <AppealPointsCard
        jobId={jobId}
        points={points}
        activeQuote={activeQuote}
        onSelectQuote={handleSelectQuote}
      />
    </div>
  );
}
