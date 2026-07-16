"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { CheckIcon } from "@heroicons/react/24/outline";
import { trackEvent } from "@/lib/analytics";

export function EmailAlertToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = !enabled;
    trackEvent("Email Alert Toggled", { enabled: next });
    setEnabled(next);
    startTransition(async () => {
      try {
        const res = await fetch("/api/onboarding", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailOptIn: next }),
        });
        if (!res.ok) throw new Error("failed");
      } catch {
        setEnabled(!next);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={enabled}
      className={clsx(
        "inline-flex h-[47px] shrink-0 items-center justify-center gap-1.5 rounded-[14px] px-5 text-sm font-medium transition-colors active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60",
        enabled
          ? "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
          : "bg-primary text-white hover:bg-primary-strong"
      )}
    >
      {enabled && <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />}
      {enabled ? "알림 받는 중" : "이메일로 알림 받기"}
    </button>
  );
}
