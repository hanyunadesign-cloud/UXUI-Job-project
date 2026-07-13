"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useToast } from "@/components/ToastProvider";

function HeartIcon({ filled }: { filled: boolean }) {
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
      <path d="M12 21s-6.7-4.35-9.3-8.2C1 10.1 1.6 6.6 4.5 5.1c2.3-1.2 4.8-.4 6.2 1.4l1.3 1.6 1.3-1.6c1.4-1.8 3.9-2.6 6.2-1.4 2.9 1.5 3.5 5 1.8 7.7C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

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

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={following}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-colors active:scale-[0.95] disabled:cursor-not-allowed",
        following
          ? "border border-primary bg-blue-50 text-primary hover:bg-blue-100"
          : "bg-primary text-white hover:bg-primary-strong"
      )}
    >
      <HeartIcon filled={following} />
      {following ? "팔로잉" : "팔로우"}
    </button>
  );
}
