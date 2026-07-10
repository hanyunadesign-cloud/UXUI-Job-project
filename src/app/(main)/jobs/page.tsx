import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FilterBar } from "@/components/FilterBar";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { OnboardingSuccessModal } from "./OnboardingSuccessModal";
import { computeMatchScore } from "@/lib/matching";

export const dynamic = "force-dynamic";

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const roles = toArray(searchParams.role);
  const platforms = toArray(searchParams.platform);
  const industries = toArray(searchParams.industry);
  const stages = toArray(searchParams.stage);
  const sort = searchParams.sort === "deadline" ? "deadline" : "match";

  const jobs = await prisma.job.findMany({
    where: {
      ...(roles.length && { role: { in: roles } }),
      ...(platforms.length && { platforms: { hasSome: platforms } }),
      ...(industries.length && { industry: { in: industries } }),
      ...(stages.length && { stage: { in: stages } }),
    },
    include: { analysis: { select: { taskKeywords: true } } },
    orderBy: { postedAt: "desc" },
  });

  let sortedJobs = jobs;

  if (sort === "deadline") {
    // 마감일이 빠른 순, 마감일이 없는(상시채용) 공고는 맨 뒤로.
    sortedJobs = [...jobs].sort((a, b) => {
      if (!a.applicationDeadline && !b.applicationDeadline) return 0;
      if (!a.applicationDeadline) return 1;
      if (!b.applicationDeadline) return -1;
      return a.applicationDeadline.getTime() - b.applicationDeadline.getTime();
    });
  } else if (userId) {
    // 매칭순: 온보딩 선호도와 겹치는 정도로 점수를 매겨 내림차순. 동점은 안정 정렬로 최신 등록순 유지.
    // 선호도가 없으면(비로그인·온보딩 미완료) 모든 점수가 0이 되어 자연스럽게 최신순으로 대체된다.
    const preference = await prisma.preference.findUnique({ where: { userId } });
    sortedJobs = [...jobs].sort(
      (a, b) => computeMatchScore(b, preference) - computeMatchScore(a, preference)
    );
  }

  const savedJobIds = userId
    ? new Set(
        (
          await prisma.savedJob.findMany({
            where: { userId },
            select: { jobId: true },
          })
        ).map((s) => s.jobId)
      )
    : new Set<string>();

  return (
    <div className="flex flex-col gap-8">
      <OnboardingSuccessModal initialOpen={searchParams.onboarded === "1"} />

      <div>
        <h1 className="text-xl font-bold text-ink">채용공고</h1>
        <p className="mt-1 text-sm text-neutral-500">{jobs.length}개의 공고</p>
      </div>

      <FilterBar />

      {sortedJobs.length === 0 ? (
        <EmptyState
          title="조건에 맞는 공고가 없어요"
          description="필터를 초기화하고 다시 찾아보세요."
        />
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {sortedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={{ ...job, taskKeywords: job.analysis?.taskKeywords ?? [] }}
              saved={savedJobIds.has(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
