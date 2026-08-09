import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { CompanyLogo } from "@/components/CompanyLogo";
import { BackButton } from "@/components/BackButton";
import { TrackPageView } from "@/components/TrackPageView";
import { AppealJobPanel } from "@/components/AppealJobPanel";
import { ExternalSourceLinkButton } from "@/components/ExternalSourceLinkButton";
import type { CompanyAnalysisData } from "@/components/CompanyAnalysisCard";
import type { AppealPoint } from "@/lib/appeal-points-data";

export const dynamic = "force-dynamic";

// appealPoints는 Prisma Json 컬럼이라 타입이 unknown — 저장 시점에 이미 title/body/
// sourceQuote 형태로 검증해서 넣었지만, 혹시 모를 형식 오류에 대비해 여기서도 다시 한번
// 최소한의 형태만 확인한다(런타임에서 깨지는 것보다 조용히 빈 배열로 처리하는 게 낫다).
function parseAppealPoints(value: unknown): AppealPoint[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (p): p is AppealPoint =>
      typeof p === "object" &&
      p !== null &&
      typeof (p as AppealPoint).title === "string" &&
      typeof (p as AppealPoint).body === "string" &&
      typeof (p as AppealPoint).sourceQuote === "string"
  );
}

export default async function ExternalJobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?source=auth_gate");
  const userId = (session.user as { id: string }).id;

  const job = await prisma.externalJobSave.findUnique({ where: { id: params.id } });
  // 다른 유저 소유의 링크는 id를 알아도 볼 수 없게 한다.
  if (!job || job.userId !== userId) notFound();

  // 회사명이 우리 DB의 Company와 겹치면 그 로고를 빌려와 보여준다.
  const matchedCompany = await prisma.company.findUnique({
    where: { name: job.companyName },
    select: { logo: true },
  });

  // "기업 정보" 탭을 보여줄 만큼 데이터가 채워져 있는지(이 기능 배포 이전에 저장된 링크는
  // 새 컬럼이 전부 null이라 예전처럼 단순 2단 레이아웃으로 보여준다).
  const hasCompanyContent = Boolean(
    job.domainPrimary && job.domainSecondary && job.domainKeywords.length === 3 && job.problemLede && job.problemRest
  );
  const appealPoints = parseAppealPoints(job.appealPoints);

  const companyData: CompanyAnalysisData | undefined = hasCompanyContent
    ? {
        companyUrl: null,
        designBlogUrl: null,
        domainPrimary: job.domainPrimary!,
        domainSecondary: job.domainSecondary!,
        domainKeywords: job.domainKeywords as [string, string, string],
        problemLede: job.problemLede!,
        problemRest: job.problemRest!,
      }
    : undefined;

  return (
    <div className="flex flex-col gap-8">
      <TrackPageView
        name="External Job Detail Viewed"
        props={{ externalJobId: job.id, companyName: job.companyName }}
        dwellEventName="External Job Detail Time Spent"
        scrollDepthEventName="External Job Detail Scroll Depth"
      />
      <BackButton />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <CompanyLogo
            src={matchedCompany?.logo ?? null}
            alt={job.companyName}
            initial={job.companyName.slice(0, 1)}
            size={56}
          />
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-neutral-500">{job.companyName}</p>
            <h1 className="text-2xl font-bold text-ink">{job.title}</h1>
            <Badge>링크로 추가한 공고</Badge>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <ExternalSourceLinkButton
            externalJobId={job.id}
            companyName={job.companyName}
            sourceUrl={job.sourceUrl}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        {hasCompanyContent ? (
          <AppealJobPanel
            jobId={job.id}
            companyName={job.companyName}
            stage={job.stage ?? ""}
            companyData={companyData}
            points={appealPoints}
            description={job.description}
          />
        ) : (
          <>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold text-ink">공고 내용</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                {job.description}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold text-ink">AI 분석</h2>
              <div className="flex flex-col gap-8">
                <div>
                  <p className="mb-2 text-xs font-medium text-neutral-400">핵심 역량 키워드</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.coreKeywords.map((keyword) => (
                      <Badge key={keyword} tone="ink">{keyword}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-neutral-400">이력서/포트폴리오 어필 포인트</p>
                  <p className="text-sm leading-relaxed text-ink">{job.resumeTip}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
