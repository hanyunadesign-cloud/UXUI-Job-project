"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { ROLES, PLATFORMS, INDUSTRIES, STAGES, STAGE_DESCRIPTIONS } from "@/lib/constants";
import { SLIDER_MAX_YEARS } from "@/lib/experience";
import { SortDropdown } from "@/components/SortDropdown";
import { SearchBar } from "@/components/SearchBar";
import { trackEvent } from "@/lib/analytics";

// 경력 슬라이더의 [최소, 최대] 값에 맞춰 버튼에 표시할 라벨을 만든다.
function experienceLabel(min: number, max: number): string {
  if (min === 0 && max === SLIDER_MAX_YEARS) return "전체";
  if (min === 0 && max === 0) return "신입";
  if (max === SLIDER_MAX_YEARS) return `${min}년 이상`;
  if (min === max) return `${min}년`;
  const left = min === 0 ? "신입" : `${min}년`;
  return `${left} ~ ${max}년`;
}

const FILTER_GROUPS = [
  {
    key: "experience",
    label: "경력",
    options: [] as { value: string; description?: string }[],
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
  // 경력 슬라이더 전용 임시 상태. 드래그 중에는 URL에 반영하지 않고(매 프레임 네비게이션은
  // 너무 잦다), "적용"을 눌렀을 때만 커밋한다.
  const [expStaged, setExpStaged] = useState<[number, number]>([0, SLIDER_MAX_YEARS]);
  const containerRef = useRef<HTMLDivElement>(null);

  const committedExpMin = Number(searchParams.get("experienceMin") ?? 0);
  const committedExpMax = Number(searchParams.get("experienceMax") ?? SLIDER_MAX_YEARS);

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
    if (key === "experience") {
      setExpStaged([committedExpMin, committedExpMax]);
    } else {
      setStaged(searchParams.getAll(key));
    }
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

  // 경력 슬라이더는 [min, max] 두 값을 한 번에 커밋한다. 전체 범위(0~최댓값)면
  // 필터가 꺼진 상태와 같으므로 파라미터 자체를 지운다.
  const commitExperienceToUrl = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("experienceMin");
    params.delete("experienceMax");
    if (min > 0 || max < SLIDER_MAX_YEARS) {
      params.set("experienceMin", String(min));
      params.set("experienceMax", String(max));
    }
    trackEvent("Job Filter Changed", { key: "experience", values: [`${min}-${max}`] });
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

  const hasExperienceFilter = committedExpMin > 0 || committedExpMax < SLIDER_MAX_YEARS;
  const hasFilters =
    FILTER_GROUPS.some((g) => g.key !== "experience" && searchParams.getAll(g.key).length > 0) ||
    hasExperienceFilter;

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-6"
    >
      {FILTER_GROUPS.map((group) => {
        const isExperience = group.key === "experience";
        const active = searchParams.getAll(group.key);
        const isOpen = openGroup === group.key;
        const isActive = isExperience ? hasExperienceFilter : active.length > 0;
        const allValues = group.options.map((o) => o.value);
        // 두 핸들이 같은 값에 겹쳐 있을 때(0/최댓값 끝뿐 아니라 3~3년처럼 중간값도 포함),
        // 겹친 지점을 클릭/드래그하면 항상 위쪽 z-index의 input이 반응한다. 남은 여유
        // 공간이 더 넓은 쪽(왼쪽 끝에 가까우면 최댓값 핸들, 오른쪽 끝에 가까우면 최솟값
        // 핸들)을 위로 올려서, 사용자가 넓히고 싶을 확률이 더 높은 방향의 핸들이 항상
        // 잡히도록 한다. "핸들이 숨어서 못 옮긴다"는 문제를 모든 값에서 막기 위함.
        const expStackedValue = expStaged[0];
        const expStacked = expStaged[0] === expStaged[1];
        const expMinOnTop = expStacked && expStackedValue > SLIDER_MAX_YEARS - expStackedValue;

        return (
          <div key={group.key} className="relative">
            <button
              type="button"
              onClick={() => openDropdown(group.key)}
              className={clsx(
                "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors active:scale-[0.95]",
                isActive
                  ? "border-primary bg-blue-50 text-primary"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
              )}
            >
              {group.label}
              {isExperience
                ? isActive && <span>{experienceLabel(committedExpMin, committedExpMax)}</span>
                : active.length > 0 && <span>{active.length}</span>}
              <ChevronDownIcon
                aria-hidden
                className={clsx("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
              />
            </button>

            {isOpen && isExperience && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex w-72 max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-neutral-200 bg-white shadow-dropdown">
                <div className="flex flex-col gap-6 p-5">
                  <p className="text-center text-[15px] font-semibold text-primary-strong">
                    {experienceLabel(expStaged[0], expStaged[1])}
                  </p>
                  <div className="relative h-6 w-full">
                    <div className="absolute top-1/2 h-[5px] w-full -translate-y-1/2 rounded-full bg-neutral-200" />
                    <div
                      className="absolute top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-primary"
                      style={{
                        left: `${(expStaged[0] / SLIDER_MAX_YEARS) * 100}%`,
                        right: `${100 - (expStaged[1] / SLIDER_MAX_YEARS) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={SLIDER_MAX_YEARS}
                      step={1}
                      value={expStaged[0]}
                      onChange={(e) =>
                        setExpStaged(([, max]) => [Math.min(Number(e.target.value), max), max])
                      }
                      aria-label="최소 경력"
                      className={clsx("dual-range-thumb", expMinOnTop ? "z-20" : "z-10")}
                    />
                    <input
                      type="range"
                      min={0}
                      max={SLIDER_MAX_YEARS}
                      step={1}
                      value={expStaged[1]}
                      onChange={(e) =>
                        setExpStaged(([min]) => [min, Math.max(Number(e.target.value), min)])
                      }
                      aria-label="최대 경력"
                      className={clsx("dual-range-thumb", expMinOnTop ? "z-10" : "z-20")}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-medium text-neutral-400">
                    <span>신입</span>
                    <span>{SLIDER_MAX_YEARS}년 이상</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 border-t border-neutral-100 p-2">
                  <button
                    type="button"
                    onClick={() => setExpStaged([0, SLIDER_MAX_YEARS])}
                    className="flex-1 rounded-xl bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200"
                  >
                    전체 선택
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      commitExperienceToUrl(expStaged[0], expStaged[1]);
                      setOpenGroup(null);
                    }}
                    className="flex-1 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-strong"
                  >
                    적용
                  </button>
                </div>
              </div>
            )}

            {isOpen && !isExperience && (
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
