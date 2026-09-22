import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { ApplyButton } from "@/components/ApplyButton";
import { SaveButton } from "@/components/SaveButton";
import { CompanyLogo } from "@/components/CompanyLogo";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { BackButton } from "@/components/BackButton";
import { TrackPageView } from "@/components/TrackPageView";
import { MarkJobViewed } from "@/components/MarkJobViewed";
import { RecentlyViewedTracker } from "@/components/RecentlyViewedTracker";
import { JobSummaryCard } from "@/components/JobSummaryCard";
import { AppealJobPanel } from "@/components/AppealJobPanel";
import { APPEAL_POINTS, type AppealPoint } from "@/lib/appeal-points-data";
import type { CompanyAnalysisData } from "@/components/CompanyAnalysisCard";
import { TrackedLink } from "@/components/TrackedLink";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  // getServerSession은 JWT를 로컬에서 검증할 뿐 DB를 안 타서 사실상 즉시 끝난다. 먼저
  // 받아두면, DB가 원격(서울) 리전이라 왕복이 느린 job/saved 조회 두 개를 병렬로 묶을 수 있다.
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const [job, savedRecord] = await Promise.all([
    prisma.job.findUnique({
      where: { id: params.id },
      include: { analysis: true },
    }),
    userId
      ? prisma.savedJob.findUnique({
          where: { userId_jobId: { userId, jobId: params.id } },
        })
      : Promise.resolve(null),
  ]);

  if (!job) notFound();

  const saved = Boolean(savedRecord);
  // "이렇게 어필하세요" + "공고 요약" + "기업 정보" 탭은 콘텐츠가 있을 때만 보여준다.
  // 1순위: appeal-points-data.ts(사람이 직접 검증한 콘텐츠). 2순위: JobAnalysis.appealPoints
  // (자동 수집 파이프라인이 AI로 채운 캐시 — 당근/쿠팡/미소/Bjak처럼 사람이 손으로 못 채우는
  // 공고용 폴백). 이 데이터를 "use client" 파일(AppealPointsCard.tsx)이 아니라 순수 모듈에서
  // 가져오는 게 중요하다 — 서버 컴포넌트가 "use client" 모듈의 일반 값 export를 import하면
  // 실제 값이 아니라 Next.js 클라이언트 레퍼런스를 받게 돼서 모든 job.id가 truthy로 오판되는
  // 버그가 있었다.
  const staticPoints = APPEAL_POINTS[job.id];
  const aiPoints = job.analysis?.appealPoints as AppealPoint[] | null | undefined;
  const points = staticPoints ?? (aiPoints && aiPoints.length > 0 ? aiPoints : undefined);
  const hasAppealContent = Boolean(points && points.length > 0);
  // companyData: 손으로 검증한 공고(staticPoints 있음)는 CompanyAnalysisCard의 하드코딩 맵을
  // companyName으로 조회해서 쓰고, AI 폴백 공고만 JobAnalysis에 캐시된 기업 정보를 직접 넘긴다.
  const analysis = job.analysis;
  const aiCompanyData: CompanyAnalysisData | undefined =
    !staticPoints &&
    analysis?.domainPrimary &&
    analysis.domainSecondary &&
    analysis.problemLede &&
    analysis.problemRest &&
    analysis.domainKeywords.length === 3
      ? {
          companyUrl: null,
          designBlogUrl: null,
          domainPrimary: analysis.domainPrimary,
          domainSecondary: analysis.domainSecondary,
          domainKeywords: analysis.domainKeywords as [string, string, string],
          problemLede: analysis.problemLede,
          problemRest: analysis.problemRest,
        }
      : undefined;
  // 상단 배지 줄(직군/업종/스테이지/플랫폼)은 "기업 정보" 탭 내용과 겹쳐서, 어필 포인트가
  // 있는 공고에서는 빼고 그만큼 헤더-본문 간격을 넓힌다.
  const hideTopBadges = hasAppealContent;

  return (
    <div className={`flex flex-col ${hideTopBadges ? "gap-10" : "gap-8"}`}>
      <TrackPageView
        name="Job Detail Viewed"
        props={{ jobId: job.id, companyName: job.companyName, saved }}
        dwellEventName="Job Detail Time Spent"
        scrollDepthEventName="Job Detail Scroll Depth"
      />
      <MarkJobViewed jobId={job.id} />
      <RecentlyViewedTracker
        job={{
          id: job.id,
          title: job.title,
          companyName: job.companyName,
          companyLogo: job.companyLogo,
        }}
      />
      <BackButton />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <CompanyLogo
            src={job.companyLogo}
            alt={job.companyName}
            initial={job.companyName.slice(0, 1)}
            size={56}
          />
          <div className="flex flex-col gap-2">
            {job.companyId ? (
              <TrackedLink
                href={`/companies/${job.companyId}`}
                eventName="Job Detail Company Link Clicked"
                eventProps={{ jobId: job.id, companyId: job.companyId, companyName: job.companyName }}
                className="w-fit text-sm text-neutral-500 hover:text-ink hover:underline"
              >
                {job.companyName}
              </TrackedLink>
            ) : (
              <p className="text-sm text-neutral-500">{job.companyName}</p>
            )}
            <h1 className="text-2xl font-bold text-ink">{job.title}</h1>
            {!hideTopBadges && (
              <div className="flex flex-wrap gap-1.5">
                <Badge>{job.role}</Badge>
                {job.industries.map((industry) => (
                  <Badge key={industry}>{industry}</Badge>
                ))}
                <Badge>{job.stage}</Badge>
                {job.platforms.map((platform) => (
                  <Badge key={platform}>{platform}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <SaveButton jobId={job.id} initialSaved={saved} isLoggedIn={Boolean(userId)} />
          <ApplyButton jobId={job.id} applyUrl={job.applyUrl} companyName={job.companyName} />
        </div>
      </div>

      <div
        className={`grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] ${
          hasAppealContent ? "lg:gap-x-6" : ""
        }`}
      >
        {hasAppealContent ? (
          <AppealJobPanel
            jobId={job.id}
            companyName={job.companyName}
            stage={job.stage}
            companyData={aiCompanyData}
            points={points}
            description={job.description}
            summary={
              <JobSummaryCard
                job={{
                  role: job.role,
                  stage: job.stage,
                  location: job.location,
                  employmentType: job.employmentType,
                  experienceLevel: job.experienceLevel,
                  applicationDeadline: job.applicationDeadline,
                }}
              />
            }
          />
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink">공고 내용</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
              {job.description}
            </p>
          </div>
        )}

        {hasAppealContent ? null : (
          <AnalysisPanel
            jobId={job.id}
            initialAnalysis={
              job.analysis
                ? { coreKeywords: job.analysis.coreKeywords, resumeTip: job.analysis.resumeTip }
                : null
            }
            isLoggedIn={Boolean(userId)}
          />
        )}
      </div>
    </div>
  );
}
