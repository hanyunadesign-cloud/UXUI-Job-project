import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CompanyCard } from "@/components/CompanyCard";
import { RecommendedCompaniesCarousel } from "@/components/RecommendedCompaniesCarousel";
import { CompanyFilterBar } from "@/components/CompanyFilterBar";
import { ActiveOnlyCheckbox } from "@/components/ActiveOnlyCheckbox";
import { FollowingOnlyCheckbox } from "@/components/FollowingOnlyCheckbox";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { getApplicationStatus } from "@/lib/dday";
import { computeCompanyMatchScore } from "@/lib/matching";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 16;
// 가로 스크롤 캐러셀이라 한 화면에 다 안 들어올 만큼 넉넉히 보여준다.
const RECOMMENDED_COUNT = 8;

// 기본 정렬 우선순위: 대기업 → 유니콘 → 중견기업 → 에이전시 → 스타트업.
const STAGE_PRIORITY: Record<string, number> = {
  대기업: 0,
  유니콘: 1,
  중견기업: 2,
  에이전시: 3,
  스타트업: 4,
};

function stageRank(stage: string): number {
  return STAGE_PRIORITY[stage] ?? 5;
}

// 이 회사들은 규모 등급과 무관하게 지정된 순서 그대로 맨 위에 고정 노출한다.
const PINNED_TOP_COMPANIES = ["네이버", "카카오", "현대자동차", "크래프톤", "쿠팡"];

function companyRank(company: { name: string; stage: string }): number {
  const pinnedIndex = PINNED_TOP_COMPANIES.indexOf(company.name);
  if (pinnedIndex !== -1) return pinnedIndex - PINNED_TOP_COMPANIES.length;
  return stageRank(company.stage);
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const stages = toArray(searchParams.stage);
  const industries = toArray(searchParams.industry);
  const jobQuery =
    typeof searchParams.jobQuery === "string" ? searchParams.jobQuery.trim() : "";
  const activeOnly = searchParams.activeOnly === "1";
  const followingOnly = searchParams.followingOnly === "1";
  const page = Math.max(1, Number(searchParams.page) || 1);

  const [companies, preference, followsList] = await Promise.all([
    prisma.company.findMany({
      include: { jobs: { select: { title: true, archivedAt: true, applicationDeadline: true } } },
      orderBy: { createdAt: "asc" },
    }),
    userId ? prisma.preference.findUnique({ where: { userId } }) : Promise.resolve(null),
    userId
      ? prisma.follow.findMany({ where: { userId }, select: { companyId: true } })
      : Promise.resolve([]),
  ]);

  const withOpenJobs = companies.map((company) => {
    const openJobsCount = company.jobs.filter(
      (job) => !job.archivedAt && !getApplicationStatus(job.applicationDeadline).closed
    ).length;
    return { ...company, hasOpenJobs: openJobsCount > 0, openJobsCount };
  });

  // 추천 기업: 온보딩 선호도(관심 산업/규모)와 겹치는 정도로 정렬하고, 동점이면 현재 채용중인
  // 공고가 많은 기업을 우선한다. 선호도가 없는 유저(비로그인 포함)는 점수가 모두 0이라
  // 자연스럽게 채용중인 공고가 많은 기업 순으로 대체된다.
  const recommended = [...withOpenJobs]
    .sort((a, b) => {
      const scoreDiff =
        computeCompanyMatchScore(b, preference) - computeCompanyMatchScore(a, preference);
      if (scoreDiff !== 0) return scoreDiff;
      return b.openJobsCount - a.openJobsCount;
    })
    .slice(0, RECOMMENDED_COUNT);

  const followedIds = new Set(followsList.map((f) => f.companyId));

  const filtered = withOpenJobs
    .filter((company) => {
      if (stages.length && !stages.includes(company.stage)) return false;
      if (industries.length && !industries.includes(company.industry)) return false;
      if (activeOnly && !company.hasOpenJobs) return false;
      if (followingOnly && !followedIds.has(company.id)) return false;
      if (
        jobQuery &&
        !company.jobs.some((job) => job.title.toLowerCase().includes(jobQuery.toLowerCase()))
      )
        return false;
      return true;
    })
    .sort((a, b) => companyRank(a) - companyRank(b));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const currentSearchParams = new URLSearchParams();
  stages.forEach((s) => currentSearchParams.append("stage", s));
  industries.forEach((i) => currentSearchParams.append("industry", i));
  if (jobQuery) currentSearchParams.set("jobQuery", jobQuery);
  if (activeOnly) currentSearchParams.set("activeOnly", "1");
  if (followingOnly) currentSearchParams.set("followingOnly", "1");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-ink">기업 정보</h1>
        <p className="mt-1 text-sm text-neutral-500">
          관심 기업을 팔로우하고, 주요 IT 업계 현황을 한눈에 파악하세요.
        </p>
      </div>

      {recommended.length > 0 && (
        <RecommendedCompaniesCarousel
          companies={recommended}
          followedIds={followedIds}
          isLoggedIn={Boolean(userId)}
        />
      )}

      <div className="my-2 border-t border-neutral-200" />

      <CompanyFilterBar />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-500">
          검색 결과 <span className="font-semibold text-ink">{filtered.length}</span>건
        </p>
        <div className="flex items-center gap-4">
          <ActiveOnlyCheckbox />
          <FollowingOnlyCheckbox isLoggedIn={Boolean(userId)} />
        </div>
      </div>

      {pageItems.length === 0 ? (
        <EmptyState
          title="조건에 맞는 기업이 없어요"
          description="필터를 초기화하고 다시 찾아보세요."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {pageItems.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              following={followedIds.has(company.id)}
              isLoggedIn={Boolean(userId)}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/companies"
        searchParams={currentSearchParams}
      />
    </div>
  );
}
