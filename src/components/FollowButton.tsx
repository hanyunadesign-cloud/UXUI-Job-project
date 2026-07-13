"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useToast } from "@/components/ToastProvider";

export function FollowButton({
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

  // 텍스트와 나란히 붙는 인라인 아이콘이라 시스템 규칙상 16px(h-4 w-4) 고정.
  const Icon = following ? HeartSolid : HeartOutline;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={following}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors active:scale-[0.95] disabled:cursor-not-allowed",
        following
          ? "border border-primary bg-blue-50 text-primary hover:bg-blue-100"
          : "bg-primary text-white hover:bg-primary-strong"
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {following ? "팔로잉" : "팔로우"}
    </button>
  );
}
