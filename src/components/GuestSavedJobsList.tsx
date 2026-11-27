"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { JobCard, type JobCardData } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { getGuestAppliedJobIds, getGuestSavedJobIds } from "@/lib/guestSaves";
import { SortDropdown } from "@/components/SortDropdown";
import { sortSavedJobs } from "@/lib/sortSavedJobs";

type GuestJob = JobCardData & { postedAt: Date };

// 게스트(비로그인)용 저장 공고 목록. 서버는 localStorage를 모르니 클라이언트에서
// jobId 목록을 읽어 /api/saved-jobs/guest로 실제 공고 데이터를 받아온다.
export function GuestSavedJobsList() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") === "deadline" ? "deadline" : "latest";
  const [jobs, setJobs] = useState<GuestJob[] | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  useEffect(() => {
    setAppliedIds(getGuestAppliedJobIds());
  }, []);

  const sorted = useMemo(
    () =>
      jobs
        ? sortSavedJobs(
            jobs.map((job) => ({ ...job, applied: appliedIds.includes(job.id) })),
            sort
          )
        : [],
    [jobs, appliedIds, sort]
  );

  useEffect(() => {
    const ids = getGuestSavedJobIds();
    if (ids.length === 0) {
      setJobs([]);
      return;
    }
    // 가장 최근에 저장한 게 앞에 오도록(toggleGuestSavedJobId는 뒤에 append한다).
    const ordered = [...ids].reverse();
    fetch(`/api/saved-jobs/guest?ids=${ordered.join(",")}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: (Omit<GuestJob, "applicationDeadline" | "postedAt"> & { applicationDeadline: string | null; postedAt: string })[]) =>
        setJobs(
          data.map((job) => ({
            ...job,
            applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline) : null,
            postedAt: new Date(job.postedAt),
          }))
        )
      )
      .catch(() => setJobs([]));
  }, []);

  if (jobs === null) return null;

  if (jobs.length === 0) {
    return (
      <EmptyState
        title="아직 저장한 공고가 없어요"
        description="마음에 드는 공고를 저장해보세요. 로그인하면 계속 보관돼요."
        action={
          <Link href="/jobs">
            <Button variant="secondary" className="mt-2">
              채용공고 보러가기
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          {jobs.length}개 저장됨 · 지원완료 {sorted.filter((job) => job.applied).length}개
        </p>
        <SortDropdown />
      </div>
      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            saved
            isLoggedIn={false}
            source="mypage_saved"
            applied={job.applied}
          />
        ))}
      </div>
    </>
  );
}
