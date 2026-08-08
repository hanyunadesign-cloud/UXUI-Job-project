import Link from "next/link";
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
import { JobSummaryCard } from "@/components/JobSummaryCard";
import { AppealJobPanel } from "@/components/AppealJobPanel";

export const dynamic = "force-dynamic";

// "이렇게 어필하세요" + "공고 요약" + "기업 정보" 탭 — Vercel 시범 적용 대상 5개 공고.
// 아직 Gemini 파이프라인에 연결 안 했고, 이 5건만 손으로 검증한 문구로 먼저 확인한다.
// (AppealPointsCard.tsx/CompanyAnalysisCard.tsx의 콘텐츠 맵과 반드시 같은 id 목록을 유지)
const APPEAL_JOB_IDS = new Set([
  "cms6d6b7e00024l8qf69w38zy", // 토스인슈어런스
  "cmsk1ir4u0002qae1xik22zn3", // 아정당
  "cmsk1j36a0007qae1rernnein", // 네이버웹툰
  "cmsjzgwqj000cx7fc1x7py9zs", // 한패스
  "cmsjzdz1v000hmmwnyot0wp88", // 엑스에이아이(xAI)
]);

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
  const isAppealPointsPilot = APPEAL_JOB_IDS.has(job.id);
  // 상단 배지 줄(직군/업종/스테이지/플랫폼)은 "기업 정보" 탭 내용과 겹쳐서, 어필 포인트
  // 시범 적용 대상 5개 공고에서는 빼고 그만큼 헤더-본문 간격을 넓힌다(아정당에서 먼저
  // 확인해본 방식을 나머지 4개에도 동일 적용).
  const hideTopBadges = isAppealPointsPilot;

  return (
    <div className={`flex flex-col ${hideTopBadges ? "gap-10" : "gap-8"}`}>
      <TrackPageView
        name="Job Detail Viewed"
        props={{ jobId: job.id, companyName: job.companyName, saved }}
        dwellEventName="Job Detail Time Spent"
        scrollDepthEventName="Job Detail Scroll Depth"
      />
      <MarkJobViewed jobId={job.id} />
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
              <Link
                href={`/companies/${job.companyId}`}
                className="w-fit text-sm text-neutral-500 hover:text-ink hover:underline"
              >
                {job.companyName}
              </Link>
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
          isAppealPointsPilot ? "lg:gap-x-6" : ""
        }`}
      >
        {isAppealPointsPilot ? (
          <AppealJobPanel
            jobId={job.id}
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

        {isAppealPointsPilot ? null : (
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
