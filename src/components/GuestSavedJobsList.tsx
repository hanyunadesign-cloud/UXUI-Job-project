"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JobCard, type JobCardData } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { getGuestSavedJobIds } from "@/lib/guestSaves";

// 게스트(비로그인)용 저장 공고 목록. 서버는 localStorage를 모르니 클라이언트에서
// jobId 목록을 읽어 /api/saved-jobs/guest로 실제 공고 데이터를 받아온다.
export function GuestSavedJobsList() {
  const [jobs, setJobs] = useState<JobCardData[] | null>(null);

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
      .then((data: (Omit<JobCardData, "applicationDeadline"> & { applicationDeadline: string | null })[]) =>
        setJobs(
          data.map((job) => ({
            ...job,
            applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline) : null,
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
      <p className="text-sm text-neutral-500">{jobs.length}개 저장됨</p>
      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} saved isLoggedIn={false} source="mypage_saved" />
        ))}
      </div>
    </>
  );
}
