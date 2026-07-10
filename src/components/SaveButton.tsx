"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { useToast } from "@/components/ToastProvider";

function BookmarkIcon({
  filled,
  size,
  hoverFills,
}: {
  filled: boolean;
  size: number;
  hoverFills: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={clsx(hoverFills && "transition-colors group-hover:fill-current")}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function SaveButton({
  jobId,
  initialSaved,
  size = "md",
}: {
  jobId: string;
  initialSaved: boolean;
  size?: "sm" | "md";
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();

  const toggle = () => {
    const next = !saved;
    setSaved(next);
    showToast(
      next ? "공고가 저장되었습니다" : "공고가 해제되었습니다",
      next ? { label: "보러가기", href: "/mypage" } : undefined
    );
    startTransition(async () => {
      try {
        const res = await fetch("/api/saved-jobs", {
          method: next ? "POST" : "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });
        if (!res.ok) throw new Error("failed");
      } catch {
        setSaved(!next);
      }
    });
  };

  // 배경/보더/패딩 없이 아이콘만 노출. 호버 피드백은 배경이 아니라 아이콘 자체가
  // outline → filled(회색)로 바뀌는 것으로 표현하고, 저장된 상태(검정)는 호버에도 변하지 않는다.
  // 터치 영역은 아이콘이 커져도 접근성 기준(24~44px)을 지키도록 36px(sm)/40px(md)로 유지한다.
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={saved}
      aria-label={saved ? "저장 취소" : "저장하기"}
      className={clsx(
        "group flex shrink-0 items-center justify-end transition-colors disabled:opacity-60",
        size === "md" ? "h-10 w-10" : "h-9 w-9",
        saved ? "text-ink" : "text-neutral-300 hover:text-neutral-500"
      )}
    >
      <BookmarkIcon
        filled={saved}
        hoverFills={!saved}
        size={size === "md" ? 30 : 27}
      />
    </button>
  );
}
