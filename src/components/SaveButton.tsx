"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { useToast } from "@/components/ToastProvider";

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

  // 배경/보더/패딩 없이 아이콘만 노출. 터치 영역은 아이콘이 작아도 접근성 기준(24~44px)을
  // 지키도록 36px(sm)/40px(md)로 유지한다. 아이콘 자체는 시스템 규칙상 독립 토글 아이콘
  // 크기(24px, h-6 w-6) 고정.
  const Icon = saved ? BookmarkSolid : BookmarkOutline;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={saved}
      aria-label={saved ? "저장 취소" : "저장하기"}
      className={clsx(
        "flex shrink-0 items-center justify-end transition-colors active:scale-[0.92] disabled:opacity-60",
        size === "md" ? "h-10 w-10" : "h-9 w-9",
        saved ? "text-primary" : "text-neutral-300 hover:text-neutral-500"
      )}
    >
      <Icon className="h-6 w-6" aria-hidden />
    </button>
  );
}
