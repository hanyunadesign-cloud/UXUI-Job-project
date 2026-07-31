import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import { CompanyLogo } from "@/components/CompanyLogo";
import { CandidateJobActions } from "@/components/CandidateJobActions";

export const dynamic = "force-dynamic";

// 스케줄 클라우드 에이전트가 "애매하다"고 판단해 올린 공고 검토 화면. 소유자 계정 외에는
// 존재 자체를 노출하지 않는다(로그인 안 했거나 다른 계정이면 404).
export default async function CandidateJobsPage() {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) notFound();

  const candidates = await prisma.candidateJob.findMany({
    orderBy: { discoveredAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-ink">검토 대기 공고</h1>
        <p className="mt-1 text-sm text-neutral-500">
          스케줄 에이전트가 UXUI 직군인지 애매하다고 판단한 공고예요. 승인하면 바로 채용목록에 발행돼요.
        </p>
      </div>

      {candidates.length === 0 ? (
        <p className="text-sm text-neutral-400">검토 대기 중인 공고가 없어요.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6"
            >
              <div className="flex items-start gap-4">
                <CompanyLogo
                  src={candidate.companyLogo}
                  alt={candidate.companyName}
                  initial={candidate.companyName.slice(0, 1)}
                  size={48}
                />
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-sm text-neutral-500">{candidate.companyName}</p>
                  <h2 className="text-base font-semibold text-ink">{candidate.title}</h2>
                  <a
                    href={candidate.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-xs text-neutral-400 hover:text-ink hover:underline"
                  >
                    {candidate.applyUrl}
                  </a>
                </div>
                <CandidateJobActions candidateId={candidate.id} />
              </div>

              {candidate.aiNote && (
                <p className="rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600">
                  <span className="font-semibold">왜 애매하다고 판단했는지: </span>
                  {candidate.aiNote}
                </p>
              )}

              <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-600">
                {candidate.description.slice(0, 800)}
                {candidate.description.length > 800 && "…"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
