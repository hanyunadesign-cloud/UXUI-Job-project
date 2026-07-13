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

  // 아이콘(24px, h-6 w-6 고정)을 사방 동일한 패딩으로 감싸 터치 영역을 확보한다.
  // 기존에는 아이콘을 오버사이즈 박스 오른쪽에 justify-end로 붙이는 방식이라 아이콘의
  // 실제 시각적 위치가 카드의 다른 16px(p-4) 기준선과 어긋났다. 패딩 기반으로 바꾸고
  // 카드 쪽 absolute 오프셋에서 이 패딩만큼을 미리 빼서, 아이콘의 실제 가장자리가
  // 카드 콘텐츠의 16px 인셋과 정확히 맞도록 한다.
  const Icon = saved ? BookmarkSolid : BookmarkOutline;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={saved}
      aria-label={saved ? "저장 취소" : "저장하기"}
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full transition-colors active:scale-[0.92] disabled:opacity-60",
        size === "md" ? "p-2" : "p-1.5",
        saved ? "text-primary" : "text-neutral-300 hover:text-neutral-500"
      )}
    >
      <Icon className="h-6 w-6" aria-hidden />
    </button>
  );
}
