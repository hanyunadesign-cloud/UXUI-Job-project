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
    showToast(next ? "관심기업으로 등록했어요" : "관심기업에서 해제했어요");
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
  // 버튼 자체는 상태와 무관하게 항상 같은 중립 아웃라인 필로, 상태는 하트 아이콘의
  // 색/채움 여부(회색 아웃라인 ↔ primary 블루 solid)로만 표현한다. 라벨도 "팔로우/팔로잉"
  // 대신 상태와 무관한 "관심기업"으로 고정.
  const Icon = following ? HeartSolid : HeartOutline;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={following}
      aria-label={following ? "관심기업 해제" : "관심기업으로 등록"}
      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors active:scale-[0.95] disabled:cursor-not-allowed hover:bg-neutral-50"
    >
      <Icon className={clsx("h-4 w-4", following ? "text-primary" : "text-neutral-400")} aria-hidden />
      관심기업
    </button>
  );
}
