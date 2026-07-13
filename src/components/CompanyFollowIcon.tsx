"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics";

// 카드 그리드처럼 좁은 공간에서 기업을 빠르게 팔로우/해제하기 위한 아이콘 전용 토글.
// FollowButton(알약형)과 API/로그인 리다이렉트 동작은 동일하되, JobCard의 SaveButton과
// 같은 아이콘 전환 방식(아웃라인 → 채워짐)으로 시각적 일관성을 맞춘다.
export function CompanyFollowIcon({
  companyId,
  initialFollowing,
  isLoggedIn,
}: {
  companyId: string;
  initialFollowing: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();

  const toggle = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const next = !following;
    setFollowing(next);
    trackEvent(next ? "Company Followed" : "Company Unfollowed", { companyId, surface: "card" });
    showToast(next ? "이 기업을 팔로우했어요" : "팔로우를 취소했어요");
    startTransition(async () => {
      try {
        const res = await fetch("/api/follows", {
          method: next ? "POST" : "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyId }),
        });
        if (!res.ok) throw new Error("failed");
      } catch {
        setFollowing(!next);
      }
    });
  };

  // 카드 모서리의 독립 토글 아이콘이라 시스템 규칙상 24px(h-6 w-6) 고정.
  const Icon = following ? HeartSolid : HeartOutline;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      disabled={isPending}
      aria-pressed={following}
      aria-label={following ? "팔로우 취소" : "팔로우하기"}
      className={clsx(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors active:scale-[0.92] disabled:opacity-60",
        following ? "text-primary" : "text-neutral-300 hover:text-neutral-500"
      )}
    >
      <Icon className="h-6 w-6" aria-hidden />
    </button>
  );
}
