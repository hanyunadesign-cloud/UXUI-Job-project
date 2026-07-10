import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "ink" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        tone === "neutral" && "border-neutral-200 bg-neutral-50 text-neutral-600",
        tone === "ink" && "border-ink bg-ink text-white",
        className
      )}
      {...props}
    />
  );
}
