import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FilterBar } from "@/components/FilterBar";
import { SortDropdown } from "@/components/SortDropdown";
import { JobCard } from "@/components/JobCard";
import { NewJobsCarousel } from "@/components/NewJobsCarousel";
import { EmptyState } from "@/components/EmptyState";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { OnboardingSuccessModal } from "./OnboardingSuccessModal";
import { matchesExperienceLevel } from "@/lib/experience";
import { getApplicationStatus } from "@/lib/dday";
import { TrackPageView } from "@/components/TrackPageView";
import { LoginSuccessTracker } from "@/components/LoginSuccessTracker";
import { TrackSearchResultCount } from "@/components/TrackSearchResultCount";

export const dynamic = "force-dynamic";

// 가로 스크롤 캐러셀이라 한 화면에 다 안 들어올 만큼 넉넉히 보여준다.
const NEW_JOBS_COUNT = 12;

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
  const companyQuery =
    typeof searchParams.companyQuery === "string" ? searchParams.companyQuery.trim() : "";
  const sort = searchParams.sort === "deadline" ? "deadline" : "latest";

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // DB가 원격(서울) 리전에 있어 왕복 지연이 크므로, 서로 의존하지 않는 조회는 병렬로 묶는다.
  const [matchedJobs, savedJobsList, newJobs] = await Promise.all([
    prisma.job.findMany({
      where: {
        archivedAt: null,
        ...(roles.length && { role: { in: roles } }),
        ...(platforms.length && { platforms: { hasSome: platforms } }),
        ...(industries.length && { industries: { hasSome: industries } }),
        ...(stages.length && { stage: { in: stages } }),
        ...(companyQuery && { companyName: { contains: companyQuery, mode: "insensitive" } }),
      },
      include: { analysis: { select: { taskKeywords: true } } },
      orderBy: { postedAt: "desc" },
    }),
    userId
      ? prisma.savedJob.findMany({ where: { userId }, select: { jobId: true } })
      : Promise.resolve([]),
    // 이번주 새공고 캐러셀: 현재 적용된 필터/검색과 무관하게 최근 7일 등록 공고를 항상 보여준다.
    prisma.job.findMany({
      where: { archivedAt: null, postedAt: { gte: sevenDaysAgo } },
      include: { analysis: { select: { taskKeywords: true } } },
      orderBy: { postedAt: "desc" },
      take: NEW_JOBS_COUNT,
    }),
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

  // 정렬 기준(최신순/마감임박순)과 무관하게, 지원마감된 공고는 항상 맨 뒤로 보낸다.
  // 각 그룹 안에서는 위에서 이미 적용한 정렬 순서를 그대로 유지한다(stable sort).
  const openJobs = sortedJobs.filter((job) => !getApplicationStatus(job.applicationDeadline).closed);
  const closedJobs = sortedJobs.filter((job) => getApplicationStatus(job.applicationDeadline).closed);
  sortedJobs = [...openJobs, ...closedJobs];

  const savedJobIds = new Set(savedJobsList.map((s) => s.jobId));

  // 마감된 공고는 "새공고"로서 의미가 없으니 캐러셀에서는 제외한다.
  const openNewJobs = newJobs.filter((job) => !getApplicationStatus(job.applicationDeadline).closed);

  return (
    <div className="flex flex-col gap-8">
      <OnboardingSuccessModal initialOpen={searchParams.onboarded === "1"} />
      {searchParams.loginSuccess === "1" && <LoginSuccessTracker isNewUser={false} />}
      <TrackPageView name="Jobs List Viewed" dwellEventName="Jobs List Time Spent" />
      <TrackSearchResultCount
        eventName="Job Search Result Count"
        resultCount={jobs.length}
        activeParamKeys={[
          "companyQuery",
          "role",
          "platform",
          "industry",
          "stage",
          "experience",
        ]}
      />

      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-bold text-ink">채용 공고</h1>
        <p className="text-sm text-neutral-500">{jobs.length}개의 공고</p>
      </div>

      {openNewJobs.length > 0 && (
        <>
          <NewJobsCarousel
            jobs={openNewJobs.map((job) => ({ ...job, taskKeywords: job.analysis?.taskKeywords ?? [] }))}
            savedJobIds={savedJobIds}
            isLoggedIn={Boolean(userId)}
          />
          <div className="border-t border-neutral-200" />
        </>
      )}

      <FilterBar />

      <div className="flex justify-end">
        <SortDropdown />
      </div>

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
