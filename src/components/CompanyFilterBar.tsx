"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clsx } from "clsx";
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

  const activeOnly = searchParams.get("activeOnly") === "1";
  const toggleActiveOnly = () => {
    updateParams((params) => {
      if (activeOnly) {
        params.delete("activeOnly");
      } else {
        params.set("activeOnly", "1");
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
                  "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                )}
              >
                {active ?? group.label}
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
                <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex w-48 max-w-[calc(100vw-2rem)] flex-col gap-0.5 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg">
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

        <div className="flex flex-1 items-center gap-2 rounded-full border border-neutral-200 pl-4 pr-1.5 py-1.5 min-w-[200px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
            placeholder="기업명 검색"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={submitSearch}
            aria-label="검색"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-neutral-800"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
        </div>

        <label className="flex w-fit shrink-0 cursor-pointer items-center gap-2 text-sm text-neutral-500">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={toggleActiveOnly}
            className="h-4 w-4 rounded border-neutral-300 text-ink focus:ring-ink"
          />
          채용중인 기업만 보기
        </label>
      </div>
    </div>
  );
}
