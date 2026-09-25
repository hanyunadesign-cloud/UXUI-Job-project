"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { SortDropdown } from "@/components/SortDropdown";
import { SearchBar } from "@/components/SearchBar";
import { trackEvent } from "@/lib/analytics";

// AS-IS 아카이브 전용: 2026-07-29 이전 구버전 필터 라벨/순서/옵션을 그대로 재현한다.
// 현재 @/lib/constants.ts는 신버전 값(업무/매체/산업/규모)이라 여기서는 하드코딩한다.
const FILTER_GROUPS = [
  {
    key: "experience",
    label: "경력",
    options: [
      { value: "신입", description: "인턴 또는 실무 경험 없음" },
      { value: "주니어", description: "기초적인 업무 수행\n(1~3년차에 준하는 실력)" },
      { value: "미들", description: "준수한 이해도, 프로젝트 전담\n(3~7년차에 준하는 실력)" },
      { value: "시니어", description: "높은 이해도, 다수로 구성된 팀 리드\n(7~15년차에 준하는 실력)" },
      { value: "C레벨", description: "전문가 수준, 임원급 의사결정권" },
    ],
  },
  {
    key: "role",
    label: "직무",
    options: [
      { value: "GUI 디자인", description: undefined },
      { value: "UXUI 디자인", description: undefined },
      { value: "프로덕트 디자인", description: undefined },
      { value: "UX 라이팅", description: undefined },
      { value: "UX 리서치", description: undefined },
    ],
  },
  {
    key: "platform",
    label: "플랫폼",
    options: [
      { value: "웹", description: undefined },
      { value: "앱", description: undefined },
      { value: "태블릿", description: undefined },
      { value: "워치/웨어러블", description: undefined },
      { value: "모빌리티", description: undefined },
      { value: "가전", description: undefined },
      { value: "VR/AR", description: undefined },
    ],
  },
  {
    key: "industry",
    label: "도메인",
    options: [
      { value: "커머스", description: undefined },
      { value: "핀테크", description: undefined },
      { value: "SNS", description: undefined },
      { value: "여행/로컬", description: undefined },
      { value: "B2B SaaS", description: undefined },
      { value: "헬스케어", description: undefined },
      { value: "모빌리티", description: undefined },
      { value: "게임", description: undefined },
    ],
  },
  {
    key: "stage",
    label: "스테이지",
    options: [
      { value: "스타트업", description: undefined },
      { value: "유니콘", description: undefined },
      { value: "중견 기업", description: undefined },
      { value: "대기업", description: undefined },
      { value: "에이전시", description: undefined },
    ],
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
