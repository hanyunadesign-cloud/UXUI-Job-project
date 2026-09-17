"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics";

// 로컬 미니 시안 전용: 마이페이지에 온보딩 때 설정한 "이메일 알림" 값을 보여주고
// 바로 바꿀 수 있게 한다(기존 /api/onboarding PATCH를 그대로 재사용).
export function EmailOptInToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    trackEvent("Email Opt-in Toggled", { emailOptIn: next });
    startTransition(async () => {
      try {
        const res = await fetch("/api/onboarding", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailOptIn: next }),
        });
        if (!res.ok) throw new Error("failed");
        showToast(next ? "이메일 알림을 켰어요" : "이메일 알림을 껐어요");
      } catch {
        setEnabled(!next);
        showToast("변경하지 못했어요. 다시 시도해주세요.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      role="switch"
      aria-checked={enabled}
      className={clsx(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60",
        enabled ? "bg-primary" : "bg-neutral-200"
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          enabled ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
