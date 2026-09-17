import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FilterBar } from "@/components/FilterBar";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { OnboardingSuccessModal } from "./OnboardingSuccessModal";
import { matchesExperienceRange, SLIDER_MAX_YEARS } from "@/lib/experience";
import { getApplicationStatus } from "@/lib/dday";
import { TrackPageView } from "@/components/TrackPageView";
import { LoginSuccessTracker } from "@/components/LoginSuccessTracker";
import { TrackSearchResultCount } from "@/components/TrackSearchResultCount";

export const dynamic = "force-dynamic";

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toNumber(value: string | string[] | undefined, fallback: number): number {
  if (typeof value !== "string") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// 마감일 없는(상시채용) 공고들은 같은 회사끼리 연속 등록된 경우가 많아서, 마감임박순
// 정렬에서 그냥 두면 한 회사 공고가 줄줄이 뭉쳐 보인다. 회사별 큐를 만들어 한 바퀴씩
// 돌아가며 하나씩 뽑아 섞는다 — 각 회사 내부의 상대 순서(최신순)는 그대로 유지한 채
// 회사 간 순서만 균등하게 분산시키는 라운드로빈 방식.
function interleaveByCompany<T extends { companyName: string }>(items: T[]): T[] {
  const queues = new Map<string, T[]>();
  for (const item of items) {
    const queue = queues.get(item.companyName);
    if (queue) queue.push(item);
    else queues.set(item.companyName, [item]);
  }

  const result: T[] = [];
  let remaining = items.length;
  while (remaining > 0) {
    for (const queue of queues.values()) {
      const next = queue.shift();
      if (next) {
        result.push(next);
        remaining -= 1;
      }
    }
  }
  return result;
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
  const experienceMin = toNumber(searchParams.experienceMin, 0);
  const experienceMax = toNumber(searchParams.experienceMax, SLIDER_MAX_YEARS);
  const hasExperienceFilter = experienceMin > 0 || experienceMax < SLIDER_MAX_YEARS;
  const companyQuery =
    typeof searchParams.companyQuery === "string" ? searchParams.companyQuery.trim() : "";
  const sort = searchParams.sort === "deadline" ? "deadline" : "latest";

  // 마감된 지 30일(D+30)이 지난 공고는 목록에서 완전히 숨긴다(정렬로 맨 뒤에 두는 것과 별개).
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // DB가 원격(서울) 리전에 있어 왕복 지연이 크므로, 서로 의존하지 않는 조회는 병렬로 묶는다.
  const [matchedJobs, savedJobsList, preference] = await Promise.all([
    prisma.job.findMany({
      where: {
        archivedAt: null,
        AND: [
          { OR: [{ applicationDeadline: null }, { applicationDeadline: { gte: thirtyDaysAgo } }] },
          // 검색창 안내 문구가 "기업, 직무명을 검색하세요"라 회사명뿐 아니라 공고 제목도 같이 매칭한다.
          ...(companyQuery
            ? [
                {
                  OR: [
                    { companyName: { contains: companyQuery, mode: "insensitive" as const } },
                    { title: { contains: companyQuery, mode: "insensitive" as const } },
                  ],
                },
              ]
            : []),
        ],
        ...(roles.length && { role: { in: roles } }),
        ...(platforms.length && { platforms: { hasSome: platforms } }),
        ...(industries.length && { industries: { hasSome: industries } }),
        ...(stages.length && { stage: { in: stages } }),
      },
      include: { analysis: { select: { taskKeywords: true } } },
      orderBy: { postedAt: "desc" },
    }),
    userId
      ? prisma.savedJob.findMany({ where: { userId }, select: { jobId: true } })
      : Promise.resolve([]),
    userId ? prisma.preference.findUnique({ where: { userId } }) : Promise.resolve(null),
  ]);

  // experienceLevel은 "3~10년" 같은 자유 형식 텍스트라 Prisma where로 바로 못 걸러서,
  // 조회 후 구간 매칭(matchesExperienceRange)으로 한 번 더 필터링한다.
  const jobs = hasExperienceFilter
    ? matchedJobs.filter((job) =>
        matchesExperienceRange(job.experienceLevel, experienceMin, experienceMax)
      )
    : matchedJobs;

  let sortedJobs = jobs;

  if (sort === "deadline") {
    // 마감일이 빠른 순, 마감일이 없는(상시채용) 공고는 맨 뒤로 — 상시채용 그룹 안에서는
    // 회사별로 뭉치지 않게 interleaveByCompany로 섞는다.
    const withDeadline = jobs
      .filter((job) => job.applicationDeadline)
      .sort((a, b) => a.applicationDeadline!.getTime() - b.applicationDeadline!.getTime());
    const withoutDeadline = interleaveByCompany(jobs.filter((job) => !job.applicationDeadline));
    sortedJobs = [...withDeadline, ...withoutDeadline];
  }
  // sort === "latest"는 jobs가 이미 postedAt desc로 조회돼 있어 별도 재정렬 없이 그대로 쓴다.

  // 정렬 기준(최신순/마감임박순)과 무관하게, 지원마감된 공고는 항상 맨 뒤로 보낸다.
  // 각 그룹 안에서는 위에서 이미 적용한 정렬 순서를 그대로 유지한다(stable sort).
  const openJobs = sortedJobs.filter((job) => !getApplicationStatus(job.applicationDeadline).closed);
  const closedJobs = sortedJobs.filter((job) => getApplicationStatus(job.applicationDeadline).closed);
  sortedJobs = [...openJobs, ...closedJobs];

  const savedJobIds = new Set(savedJobsList.map((s) => s.jobId));

  return (
    <div className="flex flex-col gap-8">
      <OnboardingSuccessModal initialOpen={searchParams.onboarded === "1"} />
      {searchParams.loginSuccess === "1" && <LoginSuccessTracker isNewUser={false} />}
      <TrackPageView
        name="Jobs List Viewed"
        dwellEventName="Jobs List Time Spent"
        scrollDepthEventName="Jobs List Scroll Depth"
      />
      <TrackSearchResultCount
        eventName="Job Search Result Count"
        resultCount={jobs.length}
        activeParamKeys={[
          "companyQuery",
          "role",
          "platform",
          "industry",
          "stage",
          "experienceMin",
          "experienceMax",
        ]}
      />

      <h1 className="text-xl font-bold text-ink">
        <span className="text-primary">{jobs.length}개</span>의 공고가 열려있어요
      </h1>

      <FilterBar
        defaultFilters={
          preference
            ? {
                role: preference.roles,
                platform: preference.platforms,
                industry: preference.industries,
                stage: preference.stages,
              }
            : undefined
        }
      />

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
              // 등록 후 24시간 이내 공고에는 NEW 뱃지를 붙인다. 실제로 본 유저에게는
              // NewBadge 컴포넌트가 localStorage 기록을 보고 알아서 숨긴다.
              isNew={Date.now() - job.postedAt.getTime() < 24 * 60 * 60 * 1000}
              source="jobs_list"
            />
          ))}
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
}
