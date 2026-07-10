"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";

export function EmailAlertToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = !enabled;
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
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60",
        enabled
          ? "border-ink bg-ink text-white"
          : "border-neutral-300 bg-white text-ink hover:bg-neutral-50"
      )}
    >
      {enabled ? "알림 받는 중" : "이메일로 알림 받기"}
    </button>
  );
}
