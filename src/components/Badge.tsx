import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "ink" }) {
  return (
    <span
      // SOCAR Frame 2.0의 Tag 컴포넌트: 비인터랙티브 라벨은 pill이 아니라 6px 라운드다.
      className={clsx(
        "inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium",
        tone === "neutral" && "border-neutral-200 bg-neutral-50 text-neutral-600",
        tone === "ink" && "border-primary bg-blue-50 text-primary-strong",
        className
      )}
      {...props}
    />
  );
}
