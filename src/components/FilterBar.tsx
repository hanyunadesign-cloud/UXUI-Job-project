"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ROLES, PLATFORMS, INDUSTRIES, STAGES } from "@/lib/constants";
import { SortDropdown } from "@/components/SortDropdown";

const FILTER_GROUPS = [
  { key: "role", label: "직무", options: ROLES },
  { key: "platform", label: "플랫폼", options: PLATFORMS },
  { key: "industry", label: "도메인", options: INDUSTRIES },
  { key: "stage", label: "스테이지", options: STAGES },
] as const;

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    if (current.includes(value)) {
      current.filter((v) => v !== value).forEach((v) => params.append(key, v));
    } else {
      [...current, value].forEach((v) => params.append(key, v));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters = FILTER_GROUPS.some((g) => searchParams.getAll(g.key).length > 0);

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-6"
    >
      {FILTER_GROUPS.map((group) => {
        const active = searchParams.getAll(group.key);
        const isOpen = openGroup === group.key;

        return (
          <div key={group.key} className="relative">
            <button
              type="button"
              onClick={() => setOpenGroup(isOpen ? null : group.key)}
              className={clsx(
                "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active.length > 0
                  ? "border-ink bg-ink text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
              )}
            >
              {group.label}
              {active.length > 0 && <span>{active.length}</span>}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={clsx("shrink-0", isOpen && "rotate-180")}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex w-56 max-w-[calc(100vw-2rem)] flex-col gap-0.5 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg">
                {group.options.map((option) => {
                  const isSelected = active.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggle(group.key, option)}
                      className={clsx(
                        "flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                        isSelected
                          ? "bg-neutral-100 font-medium text-ink"
                          : "text-neutral-600 hover:bg-neutral-50"
                      )}
                    >
                      {option}
                      {isSelected && <span aria-hidden>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setOpenGroup(null);
            router.push(pathname);
          }}
          className="ml-1 text-xs font-medium text-neutral-400 underline underline-offset-2 hover:text-ink"
        >
          필터 초기화
        </button>
      )}

      <SortDropdown />
    </div>
  );
}
