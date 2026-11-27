"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { clsx } from "clsx";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics";
import { getGuestAppliedJobIds, setGuestApplied } from "@/lib/guestSaves";

// 저장 공고 카드 안에서 "지원완료"를 표시하는 토글 버튼. 카드 전체가 링크라
// 클릭이 상세 페이지 이동으로 번지지 않게 막는다.
export function AppliedToggle({
  kind,
  id,
  initialApplied,
  isLoggedIn,
  onChange,
}: {
  kind: "job" | "external";
  id: string;
  initialApplied: boolean;
  isLoggedIn: boolean;
  onChange?: (applied: boolean) => void;
}) {
  const router = useRouter();
  const showToast = useToast();
  const [applied, setApplied] = useState(initialApplied);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isLoggedIn) return;
    setApplied(getGuestAppliedJobIds().includes(id));
  }, [isLoggedIn, id]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !applied;
    setApplied(next);
    onChange?.(next);
    trackEvent("Saved Job Applied Toggled", { kind, id, applied: next });
    showToast(next ? "지원완료로 표시했어요" : "지원완료 표시를 해제했어요");

    if (!isLoggedIn) {
      setGuestApplied(id, next);
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/saved-jobs/applied", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, id, applied: next }),
        });
        if (!res.ok) throw new Error("failed");
        router.refresh();
      } catch {
        setApplied(!next);
        onChange?.(!next);
        showToast("저장하지 못했어요. 다시 시도해주세요.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={applied}
      className={clsx(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold leading-4 transition-colors disabled:opacity-60",
        applied
          ? "bg-primary text-white hover:bg-primary-strong"
          : "border border-neutral-200 bg-white text-neutral-500 hover:border-primary hover:text-primary"
      )}
    >
      <Check className="h-3 w-3" strokeWidth={2.75} aria-hidden />
      {applied ? "지원완료" : "지원완료 표시"}
    </button>
  );
}
