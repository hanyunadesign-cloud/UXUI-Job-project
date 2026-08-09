"use client";

import { Info } from "lucide-react";
import { clsx } from "clsx";
import { APPEAL_POINTS, type AppealPoint } from "@/lib/appeal-points-data";

export function AppealPointsCard({
  jobId,
  activeQuote,
  onSelectQuote,
  points: directPoints,
}: {
  jobId: string;
  activeQuote: string | null;
  onSelectQuote: (quote: string) => void;
  // 마이페이지 "링크로 추가" 공고처럼 job.id가 APPEAL_POINTS에 없는 경우, 저장 시점에 AI가
  // 만든 포인트를 여기로 직접 넘겨서 같은 카드 UI를 재사용한다.
  points?: AppealPoint[];
}) {
  const points = directPoints ?? APPEAL_POINTS[jobId];
  if (!points || points.length === 0) return null;

  return (
    // "공고 내용" 버튼을 누르면 스크롤이 아래로 이동하는데, sticky가 없으면 이 패널
    // 자체가 화면 밖으로 같이 밀려나서 근거 문장을 밑줄 표시해도 정작 이 패널이 안
    // 보이는 문제가 있었다. lg 2단 레이아웃에서만 상단에 고정되게 한다.
    <div className="rounded-2xl bg-white p-6 lg:sticky lg:top-6 lg:self-start">
      <div className="mb-5 flex items-center gap-1.5">
        <h2 className="text-sm font-semibold tracking-[-0.01em] text-ink">이렇게 어필하세요</h2>
        {/* CSS만으로 동작하는 호버 툴팁이라 클라이언트 컴포넌트 전환 없이 구현 가능 */}
        <div className="group relative flex items-center">
          <Info aria-hidden className="h-3 w-3 text-neutral-300" />
          <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 break-keep rounded-xl bg-ink px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-dropdown transition-opacity group-hover:opacity-100">
            채용공고 원문과 기업 정보를 바탕으로 AI가 분석한 내용이에요.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {points.map((point, index) => {
          const isActive = activeQuote === point.sourceQuote;
          return (
            <div
              key={point.title}
              className={clsx(
                "rounded-xl bg-neutral-50 p-[28px] transition-colors",
                isActive && "ring-2 ring-primary ring-inset"
              )}
            >
              <div className="mb-2 flex items-center gap-1.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p title={point.title} className="min-w-0 truncate text-sm font-semibold tracking-[-0.005em] text-ink">
                  {point.title}
                </p>
              </div>
              <p className="text-sm leading-relaxed tracking-[-0.005em] text-neutral-700">{point.body}</p>
              <button
                type="button"
                onClick={() => onSelectQuote(point.sourceQuote)}
                className="mt-3 text-xs font-semibold text-primary hover:underline"
              >
                공고 내용
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
