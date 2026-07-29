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
  STAGE_DESCRIPTIONS,
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
    key: "stage",
    label: "규모",
    options: STAGES.map((v) => ({ value: v as string, description: STAGE_DESCRIPTIONS[v] })),
  },
  {
    key: "industry",
    label: "산업",
    options: INDUSTRIES.map((v) => ({ value: v as string, description: undefined })),
  },
  {
    key: "platform",
    label: "매체",
    options: PLATFORMS.map((v) => ({ value: v as string, description: undefined })),
  },
  {
    key: "role",
    label: "업무",
    options: ROLES.map((v) => ({ value: v as string, description: undefined })),
  },
] as const;

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  // 드롭다운이 열려있는 동안의 임시 선택 상태. "적용"을 눌러야만 실제 URL(필터)에 반영된다.
  const [staged, setStaged] = useState<string[]>([]);
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

  const openDropdown = (key: string) => {
    if (openGroup === key) {
      setOpenGroup(null);
      return;
    }
    setStaged(searchParams.getAll(key));
    setOpenGroup(key);
  };

  // 선택 즉시 URL(필터)에 반영한다. staged는 드롭다운을 열어둔 채로 체크 상태를
  // 보여주기 위한 용도로만 남겨두고, 커밋 자체는 매 클릭마다 바로 일어난다.
  const commitToUrl = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    values.forEach((v) => params.append(key, v));
    trackEvent("Job Filter Changed", { key, values });
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleStaged = (key: string, value: string) => {
    setStaged((prev) => {
      const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      commitToUrl(key, next);
      return next;
    });
  };

  const toggleSelectAll = (key: string, allValues: string[]) => {
    setStaged((prev) => {
      const next = prev.length === allValues.length ? [] : allValues;
      commitToUrl(key, next);
      return next;
    });
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
        const allValues = group.options.map((o) => o.value);

        return (
          <div key={group.key} className="relative">
            <button
              type="button"
              onClick={() => openDropdown(group.key)}
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
              <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex w-64 max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-neutral-200 bg-white shadow-dropdown">
                <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto p-2">
                  {group.options.map((option) => {
                    const isSelected = staged.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleStaged(group.key, option.value)}
                        className={clsx(
                          "flex items-start justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
                          isSelected ? "font-medium text-primary" : "text-neutral-600 hover:bg-neutral-50"
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

                <div className="flex items-center gap-1.5 border-t border-neutral-100 p-2">
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(group.key, allValues)}
                    className="flex-1 rounded-xl bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200"
                  >
                    전체 선택
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenGroup(null)}
                    className="flex-1 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-strong"
                  >
                    적용
                  </button>
                </div>
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
