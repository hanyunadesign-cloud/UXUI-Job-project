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

  const selectSingle = (key: string, value: string) => {
    updateParams((params) => {
      const current = params.get(key);
      if (current === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    setOpenGroup(null);
  };

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
          const active = searchParams.get(group.key);
          const isOpen = openGroup === group.key;

          return (
            <div key={group.key} className="relative">
              <button
                type="button"
                onClick={() => setOpenGroup(isOpen ? null : group.key)}
                className={clsx(
                  "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors active:scale-[0.95]",
                  active
                    ? "border-primary bg-blue-50 text-primary"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                )}
              >
                {active ?? group.label}
                <ChevronDownIcon
                  aria-hidden
                  className={clsx("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
                />
              </button>

              {isOpen && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex w-48 max-w-[calc(100vw-2rem)] flex-col gap-0.5 rounded-2xl border border-neutral-200 bg-white p-2 shadow-dropdown">
                  {group.options.map((option) => {
                    const isSelected = active === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => selectSingle(group.key, option)}
                        className={clsx(
                          "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                          isSelected
                            ? "bg-blue-50 font-medium text-primary"
                            : "text-neutral-600 hover:bg-neutral-50"
                        )}
                      >
                        {option}
                        {isSelected && <CheckIcon aria-hidden className="h-4 w-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="ml-auto flex h-[47px] w-full items-center gap-2 rounded-full border border-neutral-200 bg-white pl-4 pr-[7.5px] sm:w-72">
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
          <button
            type="button"
            onClick={submitSearch}
            aria-label="검색"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-strong active:scale-[0.92]"
          >
            <MagnifyingGlassIcon className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
