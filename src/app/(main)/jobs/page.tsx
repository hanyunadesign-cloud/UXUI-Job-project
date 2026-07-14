import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FilterBar } from "@/components/FilterBar";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { OnboardingSuccessModal } from "./OnboardingSuccessModal";
import { computeMatchScore } from "@/lib/matching";
import { matchesExperienceLevel } from "@/lib/experience";

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
  const experienceLevels = toArray(searchParams.experience);
  const sort =
    searchParams.sort === "deadline"
      ? "deadline"
      : searchParams.sort === "latest"
        ? "latest"
        : "match";

  const matchedJobs = await prisma.job.findMany({
    where: {
      archivedAt: null,
      ...(roles.length && { role: { in: roles } }),
      ...(platforms.length && { platforms: { hasSome: platforms } }),
      ...(industries.length && { industry: { in: industries } }),
      ...(stages.length && { stage: { in: stages } }),
    },
    include: { analysis: { select: { taskKeywords: true } } },
    orderBy: { postedAt: "desc" },
  });

  // experienceLevel은 "3~10년" 같은 자유 형식 텍스트라 Prisma where로 바로 못 걸러서,
  // 조회 후 구간 매칭(matchesExperienceLevel)으로 한 번 더 필터링한다.
  const jobs = experienceLevels.length
    ? matchedJobs.filter((job) =>
        experienceLevels.some((level) =>
          matchesExperienceLevel(job.experienceLevel, level)
        )
      )
    : matchedJobs;

  let sortedJobs = jobs;

  if (sort === "deadline") {
    // 마감일이 빠른 순, 마감일이 없는(상시채용) 공고는 맨 뒤로.
    sortedJobs = [...jobs].sort((a, b) => {
      if (!a.applicationDeadline && !b.applicationDeadline) return 0;
      if (!a.applicationDeadline) return 1;
      if (!b.applicationDeadline) return -1;
      return a.applicationDeadline.getTime() - b.applicationDeadline.getTime();
    });
  } else if (sort === "match" && userId) {
    // 매칭순: 온보딩 선호도와 겹치는 정도로 점수를 매겨 내림차순. 동점은 안정 정렬로 최신 등록순 유지.
    // 선호도가 없으면(비로그인·온보딩 미완료) 모든 점수가 0이 되어 자연스럽게 최신순으로 대체된다.
    const preference = await prisma.preference.findUnique({ where: { userId } });
    sortedJobs = [...jobs].sort(
      (a, b) => computeMatchScore(b, preference) - computeMatchScore(a, preference)
    );
  }
  // sort === "latest"이거나 비로그인 상태의 "match"는 위 매칭순 로직을 타지 않고, jobs가
  // 이미 postedAt desc로 조회돼 있어 sortedJobs = jobs 그대로가 곧 최신순이 된다.

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
        <h1 className="text-xl font-bold text-ink">채용 공고</h1>
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
              isLoggedIn={Boolean(userId)}
            />
          ))}
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
}
