import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { SaveButton } from "@/components/SaveButton";
import { CompanyLogo } from "@/components/CompanyLogo";
import { AnalysisPanel } from "@/components/AnalysisPanel";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { analysis: true },
  });

  if (!job) notFound();

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const saved = userId
    ? Boolean(
        await prisma.savedJob.findUnique({
          where: { userId_jobId: { userId, jobId: job.id } },
        })
      )
    : false;

  return (
    <div className="flex flex-col gap-8">
      <Link href="/jobs" className="w-fit text-sm text-neutral-400 hover:text-ink">
        ← 홈으로
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <CompanyLogo
            src={job.companyLogo}
            alt={job.companyName}
            initial={job.companyName.slice(0, 1)}
            size={56}
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-500">{job.companyName}</p>
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
          <SaveButton jobId={job.id} initialSaved={saved} />
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
            <Button>지원 페이지로 이동</Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-neutral-200 p-6">
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
        />
      </div>
    </div>
  );
}
