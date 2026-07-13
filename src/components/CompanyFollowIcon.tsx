"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useToast } from "@/components/ToastProvider";

function HeartIcon({
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
      <path d="M12 21s-6.7-4.35-9.3-8.2C1 10.1 1.6 6.6 4.5 5.1c2.3-1.2 4.8-.4 6.2 1.4l1.3 1.6 1.3-1.6c1.4-1.8 3.9-2.6 6.2-1.4 2.9 1.5 3.5 5 1.8 7.7C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

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
        "group flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-60",
        following ? "text-ink" : "text-neutral-300 hover:text-neutral-500"
      )}
    >
      <HeartIcon filled={following} hoverFills={!following} size={20} />
    </button>
  );
}
