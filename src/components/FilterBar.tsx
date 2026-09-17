"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ChevronDown, Check } from "lucide-react";
import { ROLES, PLATFORMS, INDUSTRIES, STAGES, STAGE_DESCRIPTIONS } from "@/lib/constants";
import { SLIDER_MAX_YEARS } from "@/lib/experience";
import { SortDropdown } from "@/components/SortDropdown";
import { SearchBar } from "@/components/SearchBar";
import { trackEvent } from "@/lib/analytics";
import { ICON_SIZE } from "@/lib/design-tokens";

// 경력 슬라이더의 [최소, 최대] 값에 맞춰 버튼에 표시할 라벨을 만든다.
function experienceLabel(min: number, max: number): string {
  if (min === 0 && max === SLIDER_MAX_YEARS) return "전체";
  if (min === 0 && max === 0) return "신입";
  if (max === SLIDER_MAX_YEARS) return `${min}년 이상`;
  if (min === max) return `${min}년`;
  const left = min === 0 ? "신입" : `${min}년`;
  return `${left} ~ ${max}년`;
}

// 유저가 마지막으로 직접 조정(선택/삭제/초기화)한 필터 상태를 기억해뒀다가, 필터 없이
// 다시 들어왔을 때(다른 탭 다녀오기, 사이트 재방문 등) 복원하는 데 쓰는 키. localStorage라
// 브라우저를 닫거나 다른 날 다시 와도 유지된다. 키워드 검색(companyQuery)·정렬(sort)은
// "필터"가 아니라 그때그때의 의도라 대상에서 뺀다.
//
// 저장값은 항상 이 키가 "존재하는지 여부"로 두 가지를 구분한다:
//   - 키가 없음(null)            → 유저가 이 기기에서 필터를 한 번도 만진 적 없음
//                                    → 온보딩 관심사 기본값을 적용(있으면)
//   - 키가 있음(빈 문자열 포함)   → 유저가 마지막으로 남긴 상태 그대로 복원(빈 문자열이면
//                                    "마지막에 필터를 초기화했다"는 뜻 → 필터 없이 보여줌)
// 그래서 초기화 시에도 removeItem이 아니라 빈 문자열을 저장해야, 다음에 다시 왔을 때
// 온보딩 기본값이 부활하지 않고 "필터 없음" 상태가 그대로 유지된다.
const FILTER_PARAM_KEYS = ["experienceMin", "experienceMax", "stage", "industry", "platform", "role"] as const;
const FILTERS_STORAGE_KEY = "uxui-job:jobs-filters";

function extractFilterParams(params: URLSearchParams): URLSearchParams {
  const filtered = new URLSearchParams();
  FILTER_PARAM_KEYS.forEach((key) => {
    params.getAll(key).forEach((value) => filtered.append(key, value));
  });
  return filtered;
}

// 항상 저장한다(필터가 하나도 없어도 빈 문자열로 저장) — "초기화했다"는 사실 자체를
// 남겨야 다음 방문에서 온보딩 기본값이 되살아나지 않는다.
function persistFilters(params: URLSearchParams) {
  const filtered = extractFilterParams(params);
  localStorage.setItem(FILTERS_STORAGE_KEY, filtered.toString());
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

export function FilterBar({
  defaultFilters,
}: {
  // 로그인 유저의 온보딩 관심사 설정값. URL에도 저장된 필터도 없을 때만 최후순위로
  // 적용되는 기본값이다(공유 링크·직접 선택·이전에 저장한 필터가 항상 우선한다).
  defaultFilters?: { role: string[]; platform: string[]; industry: string[]; stage: string[] };
}) {
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

  // 필터 없이(공유 링크 등이 아닌 맨 URL로) 들어왔을 때만, 우선순위대로 기본값을
  // 복원한다: 1) 유저가 이 기기에서 마지막으로 남긴 필터 상태(있으면, 빈 상태 포함)
  // > 2) 온보딩 관심사 설정(한 번도 만진 적 없을 때만). 이미 URL에 필터가 담겨
  // 있으면(공유 링크·직접 선택 등) 그 값을 존중하고 절대 덮어쓰지 않는다.
  //
  // searchParams(정확히는 그 문자열 표현)를 의존성에 넣어서, 같은 라우트 안에서
  // 파라미터 없는 /jobs로 다시 이동할 때도(예: GNB "UXUI Job" 로고 클릭 — 컴포넌트가
  // 리마운트되지 않고 그대로 재사용됨) 매번 복원 로직이 다시 돌게 한다. 무한 루프
  // 걱정은 없다: 복원해서 파라미터가 채워지면 hasAnyFilterParam이 true가 되어 바로
  // 반환하고, "필터 없음" 상태를 저장해둔 경우엔 빈 값 그대로 두고 끝난다.
  useEffect(() => {
    const hasAnyFilterParam = FILTER_PARAM_KEYS.some((key) => searchParams.has(key));
    if (hasAnyFilterParam) return;

    // null이 아니면(빈 문자열이라도) 유저가 이미 한 번 이상 필터를 만졌다는 뜻이라,
    // 그 상태를 그대로 복원한다 — 온보딩 기본값으로 되돌리지 않는다.
    const saved = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (saved !== null) {
      if (!saved) return; // 마지막 상태가 "필터 없음"이었으면 그대로 둔다.
      const params = new URLSearchParams(searchParams.toString());
      new URLSearchParams(saved).forEach((value, key) => params.append(key, value));
      router.replace(`${pathname}?${params.toString()}`);
      return;
    }

    if (!defaultFilters) return;
    const hasAnyDefault =
      defaultFilters.role.length > 0 ||
      defaultFilters.platform.length > 0 ||
      defaultFilters.industry.length > 0 ||
      defaultFilters.stage.length > 0;
    if (!hasAnyDefault) return;

    const params = new URLSearchParams(searchParams.toString());
    defaultFilters.role.forEach((v) => params.append("role", v));
    defaultFilters.platform.forEach((v) => params.append("platform", v));
    defaultFilters.industry.forEach((v) => params.append("industry", v));
    defaultFilters.stage.forEach((v) => params.append("stage", v));
    persistFilters(params);
    router.replace(`${pathname}?${params.toString()}`);
    // defaultFilters·router는 안정적인 값이라 재실행 기준에서 뺀다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), pathname]);

  const openDropdown = (key: string) => {
    if (openGroup === key) {
      setOpenGroup(null);
      return;
    }
    trackEvent("Job Filter Dropdown Opened", { key });
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
    persistFilters(params);
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
    persistFilters(params);
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleStaged = (key: string, value: string) => {
    setStaged((prev) => {
      const isAdding = !prev.includes(value);
      const next = isAdding ? [...prev, value] : prev.filter((v) => v !== value);
      trackEvent("Job Filter Option Clicked", { key, value, checked: isAdding });
      commitToUrl(key, next);
      return next;
    });
  };

  const toggleSelectAll = (key: string, allValues: string[]) => {
    setStaged((prev) => {
      const checked = prev.length !== allValues.length;
      const next = checked ? allValues : [];
      trackEvent("Job Filter Select All Clicked", { key, checked });
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
        // 활성화되면 카테고리명("규모") 대신 실제로 고른 값을 버튼에 그대로 보여준다.
        // 여러 개 골랐을 땐 첫 값 + "외 N"으로 요약한다.
        const displayLabel = isExperience
          ? experienceLabel(committedExpMin, committedExpMax)
          : active.length > 1
            ? `${active[0]} 외 ${active.length - 1}`
            : active[0];
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
                "flex h-8 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium shadow-sm transition-colors active:scale-[0.95]",
                isActive
                  ? "border-primary bg-blue-50 text-primary"
                  : "border-transparent bg-white text-neutral-500 hover:bg-neutral-50 hover:text-ink"
              )}
            >
              {isActive ? displayLabel : group.label}
              <ChevronDown className={ICON_SIZE.sm} strokeWidth={1.75} aria-hidden />
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
                      onPointerUp={() =>
                        trackEvent("Job Filter Experience Slider Dragged", {
                          min: expStaged[0],
                          max: expStaged[1],
                        })
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
                      onPointerUp={() =>
                        trackEvent("Job Filter Experience Slider Dragged", {
                          min: expStaged[0],
                          max: expStaged[1],
                        })
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
                          <Check aria-hidden strokeWidth={2.5} className="h-3.5 w-3.5 shrink-0" />
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
            // 빈 문자열로 "명시적으로 초기화했다"를 남긴다 — 그래야 다음 방문에서
            // 온보딩 기본값이 되살아나지 않고 "필터 없음" 상태가 그대로 유지된다.
            localStorage.setItem(FILTERS_STORAGE_KEY, "");
            router.push(pathname);
          }}
          className="ml-1 text-xs font-medium text-neutral-400 underline underline-offset-2 hover:text-ink"
        >
          필터 초기화
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <SearchBar paramKey="companyQuery" placeholder="기업, 직무명을 검색해보세요" />
        <SortDropdown />
      </div>
    </div>
  );
}
