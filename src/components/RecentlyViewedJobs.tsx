"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CompanyLogo } from "@/components/CompanyLogo";
import { type RecentlyViewedJob } from "@/components/RecentlyViewedTracker";

const STORAGE_KEY = "uxui-job:recently-viewed-jobs";
const SKELETON_ROWS = 3;

// 로컬 미니 시안 전용: RecentlyViewedTracker가 남긴 localStorage 기록을 마이페이지에서 보여준다.
// 기록이 없을 때도(아직 아무 공고도 안 봤을 때) 섹션 자체는 스켈레톤으로 계속 자리를 차지한다.
export function RecentlyViewedJobs() {
  const [jobs, setJobs] = useState<RecentlyViewedJob[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setJobs(raw ? JSON.parse(raw) : []);
    } catch {
      setJobs([]);
    }
  }, []);

  const hasJobs = jobs !== null && jobs.length > 0;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-ink">최근 본 공고</h2>
      <div className="flex flex-col gap-1">
        {hasJobs
          ? jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
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
    </div>
  );
}
