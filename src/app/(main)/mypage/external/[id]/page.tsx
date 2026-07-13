import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { CompanyLogo } from "@/components/CompanyLogo";
import { BackButton } from "@/components/BackButton";

export const dynamic = "force-dynamic";

export default async function ExternalJobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const job = await prisma.externalJobSave.findUnique({ where: { id: params.id } });
  // 다른 유저 소유의 링크는 id를 알아도 볼 수 없게 한다.
  if (!job || job.userId !== userId) notFound();

  return (
    <div className="flex flex-col gap-8">
      <BackButton />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <CompanyLogo src={null} alt={job.companyName} initial={job.companyName.slice(0, 1)} size={56} />
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-neutral-500">{job.companyName}</p>
            <h1 className="text-2xl font-bold text-ink">{job.title}</h1>
            <Badge>링크로 추가한 공고</Badge>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[14px] bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-strong active:scale-[0.92]"
            >
              원문 보기
            </button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
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
      </div>
    </div>
  );
}
