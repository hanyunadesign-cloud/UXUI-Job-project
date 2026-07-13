"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

function ThumbsUpIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 10v11H3V10zM7 10l4-7a2 2 0 0 1 2 2v5h5.5a2 2 0 0 1 1.94 2.5l-1.67 6.5A2 2 0 0 1 16.83 21H7" />
    </svg>
  );
}

function ThumbsDownIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 14V3h4v11zM17 14l-4 7a2 2 0 0 1-2-2v-5H5.5a2 2 0 0 1-1.94-2.5l1.67-6.5A2 2 0 0 1 7.17 3H17" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type Choice = "helpful" | "unhelpful";

export function FeedbackWidget({
  jobId,
  isLoggedIn,
}: {
  jobId: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  // 페이지를 새로고침/재방문하면 항상 위젯이 다시 뜨도록, 제출 여부는 서버에서 초기값을 받지 않고
  // 이번 세션에서 실제로 제출했을 때만 true가 되는 순수 클라이언트 상태로 관리한다.
  const [submitted, setSubmitted] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setChoice(null);
    setComment("");
  };

  const selectChoice = (next: Choice) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    // 같은 버튼을 다시 누르면 토글로 선택 해제, 다른 버튼을 누르면 전환하며 입력 중이던 내용은 비운다.
    if (choice === next) {
      reset();
    } else {
      setChoice(next);
      setComment("");
    }
  };

  // 선택된 상태(choice가 있고 아직 제출 전)에서 위젯 바깥을 클릭하면 선택을 초기화한다.
  useEffect(() => {
    if (!choice || submitted) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        reset();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [choice, submitted]);

  const submit = async () => {
    if (!choice || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helpful: choice === "helpful", comment: comment.trim() }),
      });
      if (!res.ok) throw new Error("failed");
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
      <p className="mb-3 text-sm text-neutral-500">이 기능이 도움이 됐나요?</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => selectChoice("helpful")}
          aria-pressed={choice === "helpful"}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            choice === "helpful"
              ? "bg-ink text-white"
              : "border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <ThumbsUpIcon filled={choice === "helpful"} />
          도움됐어요
        </button>
        <button
          type="button"
          onClick={() => selectChoice("unhelpful")}
          aria-pressed={choice === "unhelpful"}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            choice === "unhelpful"
              ? "bg-ink text-white"
              : "border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <ThumbsDownIcon filled={choice === "unhelpful"} />
          아쉬워요
        </button>
      </div>

      {choice && (
        <div className="mt-3 flex items-center gap-2 rounded-full border border-neutral-300 pl-4 pr-1.5 py-1.5">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder={
              choice === "helpful" ? "어떤 점이 도움됐나요?" : "어떤 점이 아쉬웠나요?"
            }
            disabled={isSubmitting}
            autoFocus
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-neutral-400 focus:outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={submit}
            disabled={isSubmitting}
            aria-label="피드백 전송"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            <SendIcon />
          </button>
        </div>
      )}
    </div>
  );
}
