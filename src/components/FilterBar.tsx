"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import {
  ROLES,
  PLATFORMS,
  INDUSTRIES,
  STAGES,
  EXPERIENCE_LEVELS,
} from "@/lib/constants";
import { SortDropdown } from "@/components/SortDropdown";
import { SearchBar } from "@/components/SearchBar";
import { trackEvent } from "@/lib/analytics";

const FILTER_GROUPS = [
  {
    key: "experience",
    label: "경력",
    options: EXPERIENCE_LEVELS.map((e) => ({
      value: e.value as string,
      description: e.description as string | undefined,
    })),
  },
  {
    key: "role",
    label: "업무",
    options: ROLES.map((v) => ({ value: v as string, description: undefined })),
  },
  {
    key: "platform",
    label: "매체",
    options: PLATFORMS.map((v) => ({ value: v as string, description: undefined })),
  },
  {
    key: "industry",
    label: "산업",
    options: INDUSTRIES.map((v) => ({ value: v as string, description: undefined })),
  },
  {
    key: "stage",
    label: "규모",
    options: STAGES.map((v) => ({ value: v as string, description: undefined })),
  },
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
    const nowActive = !current.includes(value);
    if (current.includes(value)) {
      current.filter((v) => v !== value).forEach((v) => params.append(key, v));
    } else {
      [...current, value].forEach((v) => params.append(key, v));
    }
    trackEvent("Job Filter Changed", { key, value, active: nowActive });
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
                "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors active:scale-[0.95]",
                active.length > 0
                  ? "border-primary bg-blue-50 text-primary"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
              )}
            >
              {group.label}
              {active.length > 0 && <span>{active.length}</span>}
              <ChevronDownIcon
                aria-hidden
                className={clsx("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
              />
            </button>

            {isOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex w-64 max-w-[calc(100vw-2rem)] flex-col gap-0.5 rounded-2xl border border-neutral-200 bg-white p-2 shadow-dropdown">
                {group.options.map((option) => {
                  const isSelected = active.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggle(group.key, option.value)}
                      className={clsx(
                        "flex items-start justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                        isSelected
                          ? "bg-blue-50 font-medium text-primary"
                          : "text-neutral-600 hover:bg-neutral-50"
                      )}
                    >
                      <span className="flex flex-col gap-0.5">
                        <span>{option.value}</span>
                        {option.description && (
                          <span className="whitespace-pre-line text-xs font-normal text-neutral-400">
                            {option.description}
                          </span>
                        )}
                      </span>
                      {isSelected && (
                        <CheckIcon aria-hidden strokeWidth={2.5} className="h-3.5 w-3.5 shrink-0" />
                      )}
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
            trackEvent("Job Filters Reset");
            setOpenGroup(null);
            router.push(pathname);
          }}
          className="ml-1 text-xs font-medium text-neutral-400 underline underline-offset-2 hover:text-ink"
        >
          필터 초기화
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <SearchBar paramKey="companyQuery" placeholder="기업 검색" />
        <SortDropdown />
      </div>
    </div>
  );
}
