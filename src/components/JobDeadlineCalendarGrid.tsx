"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { CompanyLogo } from "@/components/CompanyLogo";
import { ICON_SIZE } from "@/lib/design-tokens";

// 로컬 미니 시안 전용 — 배포판(origin/main)에는 없음.

export type CalendarJobSummary = {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string | null;
  role: string;
  deadlineLabel: string;
  saved: boolean;
  isCustom?: boolean;
  url?: string;
};

export type WeekCell = {
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
};

type CustomEntry = {
  id: string;
  title: string;
  companyName: string;
  url: string;
  year: number;
  month: number; // 1-12
  day: number;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

const STORAGE_KEY = "uxui-job:calendar-custom-entries";

function loadCustomEntries(): CustomEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCustomEntries(entries: CustomEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage 접근 불가(프라이빗 모드 등)여도 화면 동작 자체는 계속되게 조용히 무시한다.
  }
}

function customEntryMatchesDay(entry: CustomEntry, year: number, month: number, day: number) {
  return entry.year === year && entry.month === month && entry.day === day;
}

function toSummary(entry: CustomEntry): CalendarJobSummary {
  return {
    id: entry.id,
    title: entry.title,
    companyName: entry.companyName || "개인 일정",
    companyLogo: null,
    role: "",
    deadlineLabel: "",
    saved: false,
    isCustom: true,
    url: entry.url || undefined,
  };
}

const VIEW_FILTER_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "jobs", label: "공고 전체" },
  { value: "saved", label: "관심 공고" },
  { value: "custom", label: "개인 일정" },
] as const;

type ViewFilterValue = (typeof VIEW_FILTER_OPTIONS)[number]["value"];

const VISIBLE_COUNT = 2;
const CHIPS_AREA_HEIGHT = 94;

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

type SelectedJob = { job: CalendarJobSummary; day: number };
type AddForm = { day: number };

export type UpcomingDeadlineJob = {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string | null;
  deadlineLabel: string;
  urgent: boolean;
};

export function JobDeadlineCalendarGrid({
  year,
  month,
  prevMonthParam,
  nextMonthParam,
  weeks,
  jobsByDay,
  isLoggedIn,
  upcomingDeadlineJobs,
}: {
  year: number;
  month: number;
  prevMonthParam: string;
  nextMonthParam: string;
  weeks: WeekCell[][];
  jobsByDay: Record<number, CalendarJobSummary[]>;
  isLoggedIn: boolean;
  upcomingDeadlineJobs: UpcomingDeadlineJob[];
}) {
  const [customEntries, setCustomEntries] = useState<CustomEntry[]>([]);
  const [viewFilter, setViewFilter] = useState<ViewFilterValue>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const [selectedJob, setSelectedJob] = useState<SelectedJob | null>(null);
  const [addForm, setAddForm] = useState<AddForm | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomEntries(loadCustomEntries());
  }, []);

  useEffect(() => {
    if (!filterOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [filterOpen]);

  function closeOverlays() {
    setSelectedJob(null);
    setAddForm(null);
  }

  function expandDay(day: number) {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.add(day);
      return next;
    });
  }

  function openAddForm(day: number) {
    setSelectedJob(null);
    setAddForm({ day });
  }

  function openJobPreview(job: CalendarJobSummary, day: number) {
    setAddForm(null);
    setSelectedJob({ job, day });
  }

  function handleAddSubmit(values: { title: string; companyName: string; url: string; date: string }) {
    const [entryYear, entryMonth, entryDay] = values.date.split("-").map(Number);
    const entry: CustomEntry = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: values.title.trim(),
      companyName: values.companyName.trim(),
      url: values.url.trim(),
      year: entryYear,
      month: entryMonth,
      day: entryDay,
    };
    const next = [...customEntries, entry];
    setCustomEntries(next);
    saveCustomEntries(next);
    setAddForm(null);
  }

  function handleDeleteCustom(id: string) {
    const next = customEntries.filter((e) => e.id !== id);
    setCustomEntries(next);
    saveCustomEntries(next);
    setSelectedJob(null);
  }

  const fabDefaultDay = weeks.flat().find((c) => c.isToday)?.day ?? 1;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-ink">
            {year}년 {month}월 일정
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href={`/calendar?month=${prevMonthParam}`}
              aria-label="이전 달"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 hover:text-ink"
            >
              <ChevronLeft className={ICON_SIZE.sm} strokeWidth={1.75} aria-hidden />
            </Link>
            <Link
              href={`/calendar?month=${nextMonthParam}`}
              aria-label="다음 달"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 hover:text-ink"
            >
              <ChevronRight className={ICON_SIZE.sm} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </div>

        <div ref={filterRef} className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className="grid h-8 rounded-lg bg-white px-3 text-sm font-medium text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 hover:text-ink"
          >
            {/* 정렬 버튼과 동일한 사이징 트릭: 가장 긴 라벨 기준으로 너비를 고정해
                옵션이 바뀌어도 버튼 너비가 흔들리지 않게 한다. */}
            <span
              aria-hidden
              className="invisible col-start-1 row-start-1 flex items-center gap-1.5 whitespace-nowrap"
            >
              개인 일정
              <ChevronDown className={ICON_SIZE.sm} strokeWidth={1.75} aria-hidden />
            </span>
            <span className="col-start-1 row-start-1 flex items-center justify-between whitespace-nowrap">
              {VIEW_FILTER_OPTIONS.find((o) => o.value === viewFilter)?.label}
              <ChevronDown className={ICON_SIZE.sm} strokeWidth={1.75} aria-hidden />
            </span>
          </button>
          {filterOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-36 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-dropdown">
              {VIEW_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setViewFilter(opt.value);
                    setFilterOpen(false);
                  }}
                  className={clsx(
                    "flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-50",
                    viewFilter === opt.value ? "font-semibold text-primary" : "text-neutral-600"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-300" aria-hidden />
          진행중인 공고 마감일
        </span>
        {isLoggedIn && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
            관심 등록한 공고
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="border-r border-neutral-100 py-2 text-center text-xs font-medium text-neutral-400 last:border-r-0"
              >
                {label}
              </div>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-neutral-100 last:border-b-0">
              {week.map((cell, ci) => {
                const jobsForDay = cell.inCurrentMonth ? jobsByDay[cell.day] ?? [] : [];
                const customForDay = cell.inCurrentMonth
                  ? customEntries.filter((e) => customEntryMatchesDay(e, year, month, cell.day)).map(toSummary)
                  : [];
                const dayJobs =
                  viewFilter === "jobs"
                    ? jobsForDay
                    : viewFilter === "saved"
                      ? jobsForDay.filter((job) => job.saved)
                      : viewFilter === "custom"
                        ? customForDay
                        : [...jobsForDay, ...customForDay];

                const isExpanded = expandedDays.has(cell.day);
                const visible = isExpanded ? dayJobs : dayJobs.slice(0, VISIBLE_COUNT);
                const hiddenCount = dayJobs.length - VISIBLE_COUNT;

                return (
                  <div
                    key={ci}
                    onDoubleClick={() => {
                      if (!cell.inCurrentMonth) return;
                      openAddForm(cell.day);
                    }}
                    onContextMenu={(e) => {
                      if (!cell.inCurrentMonth) return;
                      e.preventDefault();
                      openAddForm(cell.day);
                    }}
                    className={clsx(
                      "flex h-[130px] flex-col overflow-hidden border-r border-neutral-100 p-1.5 last:border-r-0",
                      !cell.inCurrentMonth && "bg-neutral-50/60"
                    )}
                  >
                    <div className="mb-1 flex justify-end">
                      <span
                        className={clsx(
                          "flex h-5 w-5 items-center justify-center text-xs",
                          cell.isToday
                            ? "rounded-full bg-primary font-semibold text-white"
                            : cell.inCurrentMonth
                              ? "text-neutral-500"
                              : "text-neutral-300"
                        )}
                      >
                        {cell.day}
                      </span>
                    </div>

                    <div
                      style={{ height: CHIPS_AREA_HEIGHT }}
                      className="flex flex-col gap-1 overflow-y-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {visible.map((job) => (
                        <button
                          key={job.id}
                          type="button"
                          onClick={() => openJobPreview(job, cell.day)}
                          className={clsx(
                            "flex w-full items-center gap-1 truncate rounded-md px-1.5 py-1 text-left text-[11px] leading-tight outline-none transition-colors",
                            job.isCustom
                              ? "bg-amber-50 text-amber-900 hover:bg-amber-100"
                              : job.saved
                                ? "bg-primary text-white hover:bg-primary-strong"
                                : "bg-blue-50 text-primary hover:bg-blue-100"
                          )}
                        >
                          <span className="truncate">
                            {job.isCustom ? job.title : `${job.companyName} · ${job.title}`}
                          </span>
                        </button>
                      ))}
                      {!isExpanded && hiddenCount > 0 && (
                        <button
                          type="button"
                          onClick={() => expandDay(cell.day)}
                          className="w-full rounded-md px-1.5 py-1 text-left text-[11px] font-medium text-neutral-400 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                        >
                          +{hiddenCount}개 더
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex w-80 shrink-0 flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
          {addForm ? (
            // day가 바뀔 때마다 새로 마운트해서 이전 날짜에 입력하던 내용 없이
            // 깨끗한 폼(날짜만 새 day로)으로 시작하게 한다.
            <AddEntryForm
              key={addForm.day}
              defaultDate={`${year}-${pad2(month)}-${pad2(addForm.day)}`}
              onCancel={closeOverlays}
              onSubmit={handleAddSubmit}
            />
          ) : selectedJob ? (
            <JobPreview
              job={selectedJob.job}
              onBack={closeOverlays}
              onDeleteCustom={handleDeleteCustom}
            />
          ) : (
            <UpcomingDeadlineList month={month} jobs={upcomingDeadlineJobs} />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => openAddForm(fabDefaultDay)}
        aria-label="새 일정 추가"
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-dropdown transition-opacity duration-300 hover:bg-primary-strong active:scale-[0.92]"
      >
        <Plus className={ICON_SIZE.md} aria-hidden />
      </button>
    </div>
  );
}

function BackRow({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="flex items-center gap-1 text-xs font-medium text-neutral-400 transition-colors hover:text-ink"
    >
      <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      {label}
    </button>
  );
}

function UpcomingDeadlineList({ month, jobs }: { month: number; jobs: UpcomingDeadlineJob[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-ink">{month}월 곧 마감되는 공고</h2>
      {jobs.length === 0 ? (
        <p className="text-xs text-neutral-400">이번 달엔 마감 예정인 공고가 없어요.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center gap-2.5 rounded-xl border border-neutral-100 p-2.5 transition-colors hover:bg-neutral-50"
            >
              <CompanyLogo
                src={job.companyLogo}
                alt={job.companyName}
                initial={job.companyName.slice(0, 1)}
                size={36}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-neutral-500">{job.companyName}</p>
                <p className="truncate text-sm font-semibold text-ink">{job.title}</p>
              </div>
              <span
                className={clsx(
                  "shrink-0 text-xs font-semibold",
                  job.urgent ? "text-negative" : "text-primary-strong"
                )}
              >
                {job.deadlineLabel}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function JobPreview({
  job,
  onBack,
  onDeleteCustom,
}: {
  job: CalendarJobSummary;
  onBack: () => void;
  onDeleteCustom: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <BackRow onBack={onBack} label="목록으로" />

      {job.isCustom ? (
        <div className="flex flex-col gap-2">
          {job.companyName && job.companyName !== "개인 일정" && (
            <p className="truncate text-xs text-neutral-500">{job.companyName}</p>
          )}
          <p className="text-sm font-semibold text-ink">{job.title}</p>
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="truncate text-xs text-primary hover:underline"
            >
              {job.url}
            </a>
          )}
          <button
            type="button"
            onClick={() => onDeleteCustom(job.id)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            일정 삭제
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <CompanyLogo
              src={job.companyLogo}
              alt={job.companyName}
              initial={job.companyName.slice(0, 1)}
              size={36}
            />
            <div className="min-w-0">
              <p className="truncate text-xs text-neutral-500">{job.companyName}</p>
              <p className="truncate text-sm font-semibold text-ink">{job.title}</p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center rounded-lg border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500">
            {job.role}
          </span>
          <p className="text-xs text-neutral-600">{job.deadlineLabel}</p>
          <Link
            href={`/jobs/${job.id}`}
            className="w-full rounded-lg bg-primary py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-primary-strong"
          >
            공고 자세히 보기
          </Link>
        </div>
      )}
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-xs font-medium text-neutral-500">
      {children}
      {required && <span className="ml-0.5 text-red-400">*</span>}
    </label>
  );
}

function AddEntryForm({
  defaultDate,
  onCancel,
  onSubmit,
}: {
  defaultDate: string;
  onCancel: () => void;
  onSubmit: (values: { title: string; companyName: string; url: string; date: string }) => void;
}) {
  const [date, setDate] = useState(defaultDate);
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [url, setUrl] = useState("");

  const inputClass =
    "rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs text-ink outline-none placeholder:text-neutral-400 focus:border-primary";

  return (
    <div className="flex flex-col gap-2.5">
      <BackRow onBack={onCancel} label="목록으로" />

      <div className="flex flex-col gap-1">
        <FieldLabel required>날짜</FieldLabel>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1">
        <FieldLabel required>제목</FieldLabel>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예) OO 회사 지원 마감"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1">
        <FieldLabel>기업명</FieldLabel>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="선택 입력"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1">
        <FieldLabel>링크</FieldLabel>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="선택 입력, https://..."
          className={inputClass}
        />
      </div>
      <button
        type="button"
        disabled={!title.trim() || !date}
        onClick={() => onSubmit({ title, companyName, url, date })}
        className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
      >
        추가
      </button>
    </div>
  );
}
