"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { CompanyLogo } from "@/components/CompanyLogo";
import { type RecentlyViewedJob } from "@/components/RecentlyViewedTracker";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "uxui-job:recently-viewed-jobs";
const SKELETON_ROWS = 3;
const PAGE_SIZE = 6;

// 로컬 미니 시안 전용: RecentlyViewedTracker가 남긴 localStorage 기록을 마이페이지에서 보여준다.
// 기록이 없을 때도(아직 아무 공고도 안 봤을 때) 섹션 자체는 스켈레톤으로 계속 자리를 차지한다.
export function RecentlyViewedJobs() {
  const [jobs, setJobs] = useState<RecentlyViewedJob[] | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setJobs(raw ? JSON.parse(raw) : []);
    } catch {
      setJobs([]);
    }
  }, []);

  const hasJobs = jobs !== null && jobs.length > 0;
  const totalPages = hasJobs ? Math.ceil(jobs.length / PAGE_SIZE) : 1;
  const visibleJobs = hasJobs ? jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-ink">최근 본 공고</h2>
      <div className="flex flex-col gap-1">
        {hasJobs
          ? visibleJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                onClick={() => trackEvent("Recently Viewed Job Clicked", { jobId: job.id })}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-50"
              >
                <CompanyLogo
                  src={job.companyLogo}
                  alt={job.companyName}
                  initial={job.companyName.slice(0, 1)}
                  size={36}
                />
                <div className="min-w-0">
                  <p className="truncate text-xs text-neutral-500">{job.companyName}</p>
                  <p className="truncate text-sm font-medium text-ink">{job.title}</p>
                </div>
              </Link>
            ))
          : Array.from({ length: SKELETON_ROWS }, (_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-neutral-100" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
                  <div className="h-3.5 w-40 animate-pulse rounded bg-neutral-100" />
                </div>
              </div>
            ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                trackEvent("Recently Viewed Pagination Clicked", { page: p });
                setPage(p);
              }}
              className={clsx(
                "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                p === page ? "bg-primary text-white" : "text-neutral-400 hover:bg-neutral-50 hover:text-ink"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
