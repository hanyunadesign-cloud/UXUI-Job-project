import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { CompanyLogo } from "@/components/CompanyLogo";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { FollowButton } from "@/components/FollowButton";
import { BackButton } from "@/components/BackButton";
import { TrackPageView } from "@/components/TrackPageView";
import { getApplicationStatus } from "@/lib/dday";

export const dynamic = "force-dynamic";

export default async function CompanyProfilePage({
  params,
}: {
  params: { id: string };
}) {
  // getServerSession은 DB를 안 타는 로컬 JWT 검증이라 사실상 즉시 끝난다. 먼저 받아두면,
  // DB가 원격(서울) 리전이라 왕복이 느린 company 조회와 병렬로 묶을 수 있다.
  const [company, session] = await Promise.all([
    prisma.company.findUnique({ where: { id: params.id } }),
    getServerSession(authOptions),
  ]);
  if (!company) notFound();

  const userId = (session?.user as { id?: string } | undefined)?.id;

  const [jobs, savedJobsList, followRecord] = await Promise.all([
    prisma.job.findMany({
      where: { companyId: company.id, archivedAt: null },
      include: { analysis: { select: { taskKeywords: true } } },
      orderBy: { postedAt: "desc" },
    }),
    userId
      ? prisma.savedJob.findMany({ where: { userId }, select: { jobId: true } })
      : Promise.resolve([]),
    userId
      ? prisma.follow.findUnique({
          where: { userId_companyId: { userId, companyId: params.id } },
        })
      : Promise.resolve(null),
  ]);

  // 진행 중(상시채용 포함) 공고는 마감 임박 순으로 위에, 지원마감된 공고는 맨 아래로.
  const openJobs = jobs.filter((job) => !getApplicationStatus(job.applicationDeadline).closed);
  const closedJobs = jobs.filter((job) => getApplicationStatus(job.applicationDeadline).closed);

  openJobs.sort((a, b) => {
    if (!a.applicationDeadline && !b.applicationDeadline) return 0;
    if (!a.applicationDeadline) return 1;
    if (!b.applicationDeadline) return -1;
    return a.applicationDeadline.getTime() - b.applicationDeadline.getTime();
  });
  closedJobs.sort(
    (a, b) => (b.applicationDeadline?.getTime() ?? 0) - (a.applicationDeadline?.getTime() ?? 0)
  );
  const sortedJobs = [...openJobs, ...closedJobs];

  const savedJobIds = new Set(savedJobsList.map((s) => s.jobId));
  const isFollowing = Boolean(followRecord);

  // 조사했는데도 값을 찾지 못한 경우를 "정보 없음"과 구분하기 위해, 행 자체를 숨기지 않고
  // 항상 3개 항목을 노출하되 값이 없으면 "-"로 표시한다.
  const infoRows = [
    { label: "사원수", value: company.employeeCount || "-" },
    { label: "설립", value: company.founded || "-" },
    { label: "본사 위치", value: company.headquarters || "-" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <TrackPageView
        name="Company Profile Viewed"
        props={{ companyId: company.id, companyName: company.name }}
      />
      <BackButton />

      <div className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-start">
        <CompanyLogo
          src={company.logo}
          alt={company.name}
          initial={company.name.slice(0, 1)}
          size={64}
        />
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-ink">{company.name}</h1>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge>{company.industry}</Badge>
                <Badge>{company.stage}</Badge>
              </div>
            </div>
            <FollowButton
              companyId={company.id}
              initialFollowing={isFollowing}
              isLoggedIn={Boolean(userId)}
            />
          </div>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 border-t border-neutral-100 pt-4 sm:grid-cols-3">
            {infoRows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs text-neutral-400">{row.label}</dt>
                <dd className="mt-0.5 text-sm text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-ink">채용중인 공고</h2>
        <p className="mt-1 text-sm text-neutral-500">{jobs.length}개의 공고</p>
      </div>

      {sortedJobs.length === 0 ? (
        <EmptyState title="현재 등록된 공고가 없어요" />
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
    </div>
  );
}
