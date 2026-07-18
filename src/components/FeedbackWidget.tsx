"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { trackEvent } from "@/lib/analytics";
import { useLoginPrompt } from "@/hooks/useLoginPrompt";

const MIN_SCORE = 1;
const MAX_SCORE = 10;
const TICKS = Array.from({ length: MAX_SCORE }, (_, i) => i + 1);

export function FeedbackWidget({
  jobId,
  isLoggedIn,
}: {
  jobId: string;
  isLoggedIn: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRowRef = useRef<HTMLDivElement>(null);
  const { requireLogin, modal } = useLoginPrompt();
  // 페이지를 새로고침/재방문하면 항상 위젯이 다시 뜨도록, 제출 여부는 서버에서 초기값을 받지 않고
  // 이번 세션에서 실제로 제출했을 때만 true가 되는 순수 클라이언트 상태로 관리한다.
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);

  const reset = () => {
    setScore(null);
    setComment("");
  };

  const valueFromClientX = (clientX: number) => {
    const row = trackRowRef.current;
    if (!row) return MIN_SCORE;
    const rect = row.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(MIN_SCORE + pct * (MAX_SCORE - MIN_SCORE));
  };

  const beginDrag = (clientX: number) =>
    requireLogin(isLoggedIn, () => {
      setDragging(true);
      setScore(valueFromClientX(clientX));
    });

  // 드래그 중에는 트랙 바깥으로 커서가 나가도 값이 계속 갱신되도록 window에 리스너를 건다.
  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: PointerEvent) => setScore(valueFromClientX(e.clientX));
    const handleUp = () => setDragging(false);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  // 선택된 상태(score가 있고 아직 제출 전)에서 위젯 바깥을 클릭하면 선택을 초기화한다.
  useEffect(() => {
    if (score === null || submitted) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        reset();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [score, submitted]);

  const submit = async () => {
    if (!score || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, comment: comment.trim() }),
      });
      if (!res.ok) throw new Error("failed");
      trackEvent("AI Analysis Feedback Submitted", {
        jobId,
        score,
        comment: comment.trim() || undefined,
      });
      setSubmitted(true);
    } catch {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-8 border-t border-neutral-100 pt-6">
        <p className="text-sm text-neutral-400">소중한 의견 감사해요 🙌</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mt-8 border-t border-neutral-100 pt-6">
      <p className="mb-5 text-sm text-neutral-500">
        방금 보신 AI 분석 결과에 대해 얼마나 만족하시나요?
      </p>
      <div
        ref={trackRowRef}
        className="relative flex h-11 touch-none items-center"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).dataset.thumb) return;
          beginDrag(e.clientX);
        }}
      >
        <div className="relative h-1 w-full rounded-full bg-neutral-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{ width: `${score === null ? 0 : ((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100}%` }}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
            {TICKS.map((n) => (
              <span
                key={n}
                className={clsx(
                  "h-2 w-0.5 rounded-full",
                  score !== null && n <= score ? "bg-white" : "bg-neutral-300"
                )}
              />
            ))}
          </div>
        </div>
        {score !== null && (
          <div
            data-thumb="true"
            onPointerDown={(e) => {
              e.stopPropagation();
              beginDrag(e.clientX);
            }}
            className="absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-[2.5px] border-primary bg-white shadow-sm active:cursor-grabbing"
            style={{ left: `${((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100}%` }}
          >
            <span className="absolute bottom-full mb-2.5 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-ink">
              {score}
            </span>
          </div>
        )}
      </div>
      <div className="mt-1 flex justify-between text-xs text-neutral-400">
        <span>1점 매우 불만족</span>
        <span>10점 매우 만족</span>
      </div>

      {score && (
        <div className="mt-3 flex items-center gap-2 rounded-full border border-neutral-300 pl-4 pr-1.5 py-1.5">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="이유를 알려주시면 더 도움이 돼요(선택)"
            disabled={isSubmitting}
            autoFocus
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-neutral-400 focus:outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={submit}
            disabled={isSubmitting}
            aria-label="피드백 전송"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-strong active:scale-[0.92] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:active:scale-100"
          >
            <PaperAirplaneIcon className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
      {modal}
    </div>
  );
}
