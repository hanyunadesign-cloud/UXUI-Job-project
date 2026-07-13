import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CompanyCard } from "@/components/CompanyCard";
import { CompanyFilterBar } from "@/components/CompanyFilterBar";
import { ActiveOnlyCheckbox } from "@/components/ActiveOnlyCheckbox";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { getApplicationStatus } from "@/lib/dday";
import { computeCompanyMatchScore } from "@/lib/matching";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 16;
const RECOMMENDED_COUNT = 4;

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const stage = typeof searchParams.stage === "string" ? searchParams.stage : undefined;
  const industry =
    typeof searchParams.industry === "string" ? searchParams.industry : undefined;
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const activeOnly = searchParams.activeOnly === "1";
  const page = Math.max(1, Number(searchParams.page) || 1);

  const [companies, preference] = await Promise.all([
    prisma.company.findMany({
      include: { jobs: { select: { archivedAt: true, applicationDeadline: true } } },
      orderBy: { createdAt: "asc" },
    }),
    userId ? prisma.preference.findUnique({ where: { userId } }) : Promise.resolve(null),
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

  const filtered = withOpenJobs.filter((company) => {
    if (stage && company.stage !== stage) return false;
    if (industry && company.industry !== industry) return false;
    if (activeOnly && !company.hasOpenJobs) return false;
    if (q && !company.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const followedIds = userId
    ? new Set(
        (
          await prisma.follow.findMany({
            where: { userId },
            select: { companyId: true },
          })
        ).map((f) => f.companyId)
      )
    : new Set<string>();

  const currentSearchParams = new URLSearchParams();
  if (stage) currentSearchParams.set("stage", stage);
  if (industry) currentSearchParams.set("industry", industry);
  if (q) currentSearchParams.set("q", q);
  if (activeOnly) currentSearchParams.set("activeOnly", "1");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">관심기업과 업계현황을 파악하세요</h1>
        </div>
        <Link
          href="/mypage?tab=following"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-neutral-500 hover:text-ink"
        >
          나의 관심기업 보기
          <ArrowRightIcon className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {recommended.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="flex items-center gap-1.5 text-lg font-bold text-ink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/gift.svg" alt="" className="h-6 w-6" aria-hidden />
            추천 기업
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recommended.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                following={followedIds.has(company.id)}
                isLoggedIn={Boolean(userId)}
              />
            ))}
          </div>
        </div>
      )}

      <CompanyFilterBar />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-500">
          검색 결과 <span className="font-semibold text-ink">{filtered.length}</span>건
        </p>
        <ActiveOnlyCheckbox />
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
