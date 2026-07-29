"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics";
import { useLoginPrompt } from "@/hooks/useLoginPrompt";
import { ICON_SIZE } from "@/lib/design-tokens";

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
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();
  const { requireLogin, modal } = useLoginPrompt();

  const toggle = () => requireLogin(isLoggedIn, () => {
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
        trackEvent("Company Follow Failed", {
          companyId,
          action: next ? "follow" : "unfollow",
          surface: "card",
        });
      }
    });
  });

  // 카드 모서리처럼 조밀한 자리의 독립 토글 아이콘이라 ICON_SIZE.md(20px) 고정.
  // 단독 페이지에 크게 놓이는 아이콘(ICON_SIZE.lg)과 달리 카드 안에서는 한 단계 작게 쓴다.
  return (
    <>
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
        <Heart className={ICON_SIZE.md} fill={following ? "currentColor" : "none"} aria-hidden />
      </button>
      {modal}
    </>
  );
}
