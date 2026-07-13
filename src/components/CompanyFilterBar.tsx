"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  ChevronDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { INDUSTRIES, STAGES } from "@/lib/constants";

const DROPDOWNS = [
  { key: "stage", label: "규모", options: STAGES as readonly string[] },
  { key: "industry", label: "산업", options: INDUSTRIES as readonly string[] },
] as const;

export function CompanyFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page"); // 필터가 바뀌면 1페이지부터 다시 보여준다
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleOption = (key: string, value: string) => {
    updateParams((params) => {
      const current = params.getAll(key);
      params.delete(key);
      if (current.includes(value)) {
        current.filter((v) => v !== value).forEach((v) => params.append(key, v));
      } else {
        [...current, value].forEach((v) => params.append(key, v));
      }
    });
  };

  const hasFilters = DROPDOWNS.some((g) => searchParams.getAll(g.key).length > 0);

  const submitSearch = () => {
    updateParams((params) => {
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div ref={containerRef} className="flex flex-wrap items-center gap-2">
        {DROPDOWNS.map((group) => {
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
                <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex w-48 max-w-[calc(100vw-2rem)] flex-col gap-0.5 rounded-2xl border border-neutral-200 bg-white p-2 shadow-dropdown">
                  {group.options.map((option) => {
                    const isSelected = active.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleOption(group.key, option)}
                        className={clsx(
                          "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                          isSelected
                            ? "bg-blue-50 font-medium text-primary"
                            : "text-neutral-600 hover:bg-neutral-50"
                        )}
                      >
                        {option}
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
              setOpenGroup(null);
              const params = new URLSearchParams(searchParams.toString());
              DROPDOWNS.forEach((g) => params.delete(g.key));
              params.delete("page");
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="ml-1 text-xs font-medium text-neutral-400 underline underline-offset-2 hover:text-ink"
          >
            필터 초기화
          </button>
        )}

        <div className="ml-auto flex w-full items-center gap-2 sm:w-auto">
          <div className="flex h-[47px] flex-1 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 sm:w-72 sm:flex-none">
            <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSearch();
              }}
              placeholder="기업명 검색"
              className="flex-1 bg-transparent text-sm font-medium text-ink placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={submitSearch}
            className="flex h-[47px] shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-strong active:scale-[0.95]"
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
}
