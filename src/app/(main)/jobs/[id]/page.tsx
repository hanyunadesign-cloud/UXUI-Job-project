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

  return (
    <div className="flex flex-col gap-8">
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
            <div className="flex flex-wrap gap-1.5">
              <Badge>{job.role}</Badge>
              <Badge>{job.industry}</Badge>
              <Badge>{job.stage}</Badge>
              {job.platforms.map((platform) => (
                <Badge key={platform}>{platform}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <SaveButton jobId={job.id} initialSaved={saved} isLoggedIn={Boolean(userId)} />
          <ApplyButton jobId={job.id} applyUrl={job.applyUrl} companyName={job.companyName} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-ink">공고 내용</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
            {job.description}
          </p>
        </div>

        <AnalysisPanel
          jobId={job.id}
          initialAnalysis={
            job.analysis
              ? { coreKeywords: job.analysis.coreKeywords, resumeTip: job.analysis.resumeTip }
              : null
          }
          isLoggedIn={Boolean(userId)}
        />
      </div>
    </div>
  );
}
