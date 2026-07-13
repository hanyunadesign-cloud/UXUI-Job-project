import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { clsx } from "clsx";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/JobCard";
import { ExternalJobCard } from "@/components/ExternalJobCard";
import { ExternalJobAddRow } from "@/components/ExternalJobAddRow";
import { CompanyFollowCard } from "@/components/CompanyFollowCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { EmailAlertToggle } from "./EmailAlertToggle";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "saved", label: "저장한 공고" },
  { key: "following", label: "팔로잉 회사" },
] as const;

export default async function MyPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id: string }).id;
  const activeTab = searchParams.tab === "following" ? "following" : "saved";

  const [preference, savedJobs, externalJobs, follows] = await Promise.all([
    prisma.preference.findUnique({ where: { userId } }),
    activeTab === "saved"
      ? prisma.savedJob.findMany({
          where: { userId },
          include: { job: { include: { analysis: { select: { taskKeywords: true } } } } },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    activeTab === "saved"
      ? prisma.externalJobSave.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    activeTab === "following"
      ? prisma.follow.findMany({
          where: { userId },
          include: { company: true },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  // 저장한 공고(우리 DB)와 링크로 추가한 공고(외부)를 최신순으로 한 그리드에 섞어서 보여준다.
  const combinedSaved = [
    ...savedJobs.map((sj) => ({ kind: "saved" as const, createdAt: sj.createdAt, data: sj.job })),
    ...externalJobs.map((ej) => ({ kind: "external" as const, createdAt: ej.createdAt, data: ej })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 border-b border-neutral-200">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key === "saved" ? "/mypage" : "/mypage?tab=following"}
              className={clsx(
                "-mb-px border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-ink text-ink"
                  : "border-transparent text-neutral-400 hover:text-ink"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {activeTab === "saved" ? (
          <>
            <ExternalJobAddRow />
            <p className="text-sm text-neutral-500">{combinedSaved.length}개 저장됨</p>
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
                {combinedSaved.map((item) =>
                  item.kind === "saved" ? (
                    <JobCard
                      key={`saved-${item.data.id}`}
                      job={{ ...item.data, taskKeywords: item.data.analysis?.taskKeywords ?? [] }}
                      saved
                    />
                  ) : (
                    <ExternalJobCard key={`external-${item.data.id}`} job={item.data} />
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-neutral-500">{follows.length}개 팔로잉</p>
            {follows.length === 0 ? (
              <EmptyState
                title="아직 팔로우한 기업이 없어요"
                description="관심 있는 기업을 팔로우하면 새 공고를 알림으로 받아볼 수 있어요."
                action={
                  <Link href="/jobs">
                    <Button variant="secondary" className="mt-2">
                      채용공고 보러가기
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {follows.map(({ company }) => (
                  <CompanyFollowCard key={company.id} company={company} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* MVP 단계에서는 실제 발송 로직이 아직 없어 프로덕션에서는 숨기고, 로컬 개발 환경에서만
          계속 작업할 수 있도록 노출한다. process.env.VERCEL은 Vercel 플랫폼에서 자동으로
          설정되는 값이라 로컬에는 존재하지 않는다. */}
      {!process.env.VERCEL && (
        <div className="border-t border-neutral-200 pt-10">
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-ink">채용공고 알림</h2>
              <p className="mt-1 text-sm text-neutral-500">
                관심 조건에 맞는 새 공고를 이메일로 받아보세요.
              </p>
            </div>
            <EmailAlertToggle initialEnabled={preference?.emailOptIn ?? false} />
          </div>
        </div>
      )}
    </div>
  );
}
