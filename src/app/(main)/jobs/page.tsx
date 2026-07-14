import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FilterBar } from "@/components/FilterBar";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { OnboardingSuccessModal } from "./OnboardingSuccessModal";
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
  const sort = searchParams.sort === "latest" ? "latest" : "deadline";

  // DB가 원격(서울) 리전에 있어 왕복 지연이 크므로, 서로 의존하지 않는 조회는 병렬로 묶는다.
  const [matchedJobs, savedJobsList] = await Promise.all([
    prisma.job.findMany({
      where: {
        archivedAt: null,
        ...(roles.length && { role: { in: roles } }),
        ...(platforms.length && { platforms: { hasSome: platforms } }),
        ...(industries.length && { industry: { in: industries } }),
        ...(stages.length && { stage: { in: stages } }),
      },
      include: { analysis: { select: { taskKeywords: true } } },
      orderBy: { postedAt: "desc" },
    }),
    userId
      ? prisma.savedJob.findMany({ where: { userId }, select: { jobId: true } })
      : Promise.resolve([]),
  ]);

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
  }
  // sort === "latest"는 jobs가 이미 postedAt desc로 조회돼 있어 별도 재정렬 없이 그대로 쓴다.

  const savedJobIds = new Set(savedJobsList.map((s) => s.jobId));

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
