"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { ArrowsUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { trackEvent } from "@/lib/analytics";

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "deadline", label: "마감임박순" },
] as const;

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = searchParams.get("sort") === "deadline" ? "deadline" : "latest";
  const currentOption = SORT_OPTIONS.find((o) => o.value === current) ?? SORT_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const select = (value: string) => {
    trackEvent("Sort Changed", { sort: value });
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 hover:border-neutral-300"
      >
        {/* 보이지 않는 사이저: "마감임박순" + 필터 버튼과 동일한 gap-1.5 규칙으로 버튼 너비를
            CSS가 자연스럽게 계산하게 한다(임의의 px 값 없음). 실제로 렌더링되는 아래 span과
            같은 그리드 셀(col/row 1)에 겹쳐 두면, 트랙 너비는 항상 이 사이저 기준으로 고정된다. */}
        <span
          aria-hidden
          className="invisible col-start-1 row-start-1 flex items-center gap-1.5 whitespace-nowrap"
        >
          마감임박순
          <ArrowsUpDownIcon aria-hidden className="h-4 w-4 shrink-0" />
        </span>
        <span
          className={clsx(
            "col-start-1 row-start-1 flex items-center whitespace-nowrap",
            current === "deadline" ? "gap-1.5" : "justify-between"
          )}
        >
          {currentOption.label}
          <ArrowsUpDownIcon aria-hidden className="h-4 w-4 shrink-0" />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 flex w-36 flex-col gap-0.5 rounded-2xl border border-neutral-200 bg-white p-2 shadow-dropdown">
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.value === current;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => select(option.value)}
                className={clsx(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                  isSelected
                    ? "bg-blue-50 font-medium text-primary"
                    : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                {option.label}
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
}
