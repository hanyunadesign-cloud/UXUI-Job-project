import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/JobCard";
import { ExternalJobCard } from "@/components/ExternalJobCard";
import { ExternalJobAddRow } from "@/components/ExternalJobAddRow";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { TrackPageView } from "@/components/TrackPageView";
import { GuestSavedJobsList } from "@/components/GuestSavedJobsList";
import { getApplicationStatus } from "@/lib/dday";

// GNB "저장 공고" 탭 전용 페이지. 여기는 저장한 공고만 보여주고, 관심사 설정/이메일
// 알림 같은 "마이페이지" 성격의 내용은 별도 페이지(/profile)에 있다. 공고 저장 자체가
// 게스트도 가능해졌으므로, 비로그인 상태에서도 열리고 그때는 localStorage 기반
// GuestSavedJobsList로 보여준다(링크로 추가한 공고 저장은 여전히 로그인 전용).
export const dynamic = "force-dynamic";

export default async function MyPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return (
      <div className="flex flex-col gap-8">
        <TrackPageView
          name="Mypage Viewed"
          props={{ guest: true }}
          dwellEventName="Mypage Time Spent"
          scrollDepthEventName="Mypage Scroll Depth"
        />
        <h1 className="text-xl font-bold text-ink">저장 공고</h1>
        <GuestSavedJobsList />
      </div>
    );
  }

  const [savedJobs, externalJobs] = await Promise.all([
    prisma.savedJob.findMany({
      where: { userId },
      include: { job: { include: { analysis: { select: { taskKeywords: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.externalJobSave.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // 링크로 추가한 공고는 회사 로고를 따로 안 갖고 있어서, 회사명이 우리 DB의 Company와
  // 겹치면 그 로고를 빌려와 보여준다(안 겹치면 이니셜로 폴백).
  const externalCompanyNames = [...new Set(externalJobs.map((ej) => ej.companyName))];
  const matchedCompanies = externalCompanyNames.length
    ? await prisma.company.findMany({
        where: { name: { in: externalCompanyNames } },
        select: { name: true, logo: true },
      })
    : [];
  const logoByCompanyName = new Map(matchedCompanies.map((c) => [c.name, c.logo]));

  // 원천 공고가 내려가서 archivedAt이 채워진 공고는 다른 목록(예: /jobs)과 동일하게 걸러낸다
  // — "모든 목록 쿼리는 archivedAt: null 조건으로 걸러낸다"는 site-wide 컨벤션(ingest-jobs.ts
  // 참고)을 저장한 공고 목록에도 동일하게 적용. SavedJob.job은 to-one 관계라 Prisma where로
  // 직접 못 걸러서 include 후 여기서 필터링한다.
  const liveSavedJobs = savedJobs.filter((sj) => sj.job.archivedAt === null);

  // 저장한 공고(우리 DB)와 링크로 추가한 공고(외부)를 최신순으로 한 그리드에 섞어서 보여준다.
  // /jobs 목록과 동일하게, 지원마감된 공고는 저장 순서 유지한 채 뒤로 밀어서 일관되게 보여준다.
  const combinedSaved = [
    ...liveSavedJobs.map((sj) => ({ kind: "saved" as const, createdAt: sj.createdAt, data: sj.job })),
    ...externalJobs.map((ej) => ({
      kind: "external" as const,
      createdAt: ej.createdAt,
      data: { ...ej, companyLogo: logoByCompanyName.get(ej.companyName) ?? null },
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const isClosedItem = (item: (typeof combinedSaved)[number]) =>
    item.kind === "saved" && getApplicationStatus(item.data.applicationDeadline).closed;
  const sortedCombinedSaved = [
    ...combinedSaved.filter((item) => !isClosedItem(item)),
    ...combinedSaved.filter(isClosedItem),
  ];

  return (
    <div className="flex flex-col gap-8">
      <TrackPageView
        name="Mypage Viewed"
        dwellEventName="Mypage Time Spent"
        scrollDepthEventName="Mypage Scroll Depth"
      />
      <div className="flex items-baseline gap-2">
        <h1 className="text-xl font-bold text-ink">저장 공고</h1>
        <p className="text-sm text-neutral-500">{combinedSaved.length}개 저장됨</p>
      </div>

      <ExternalJobAddRow />

      {combinedSaved.length === 0 ? (
          <EmptyState
            title="아직 저장한 공고가 없어요"
            description="마음에 드는 공고를 저장하거나, 다른 사이트 공고 링크를 붙여넣어 모아보세요."
            action={
              <Link href="/jobs">
                <Button variant="secondary" className="mt-2">
                  채용공고 보러가기
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {sortedCombinedSaved.map((item) =>
              item.kind === "saved" ? (
                <JobCard
                  key={`saved-${item.data.id}`}
                  job={{ ...item.data, taskKeywords: item.data.analysis?.taskKeywords ?? [] }}
                  saved
                  isLoggedIn
                  source="mypage_saved"
                />
              ) : (
                <ExternalJobCard key={`external-${item.data.id}`} job={item.data} />
              )
            )}
          </div>
        )}
    </div>
  );
}
