import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-20 text-center">
      <p className="text-base font-medium text-ink">{title}</p>
      {description && <p className="text-sm text-neutral-500">{description}</p>}
      {action}
    </div>
  );
}
