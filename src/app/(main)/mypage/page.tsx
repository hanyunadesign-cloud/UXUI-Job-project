import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { EmailAlertToggle } from "./EmailAlertToggle";

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id: string }).id;

  const [savedJobs, preference] = await Promise.all([
    prisma.savedJob.findMany({
      where: { userId },
      include: { job: { include: { analysis: { select: { taskKeywords: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.preference.findUnique({ where: { userId } }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink">채용공고 알림</h2>
          <p className="mt-1 text-sm text-neutral-500">
            관심 조건에 맞는 새 공고를 이메일로 받아보세요.
          </p>
        </div>
        <EmailAlertToggle initialEnabled={preference?.emailOptIn ?? false} />
      </div>

      <div>
        <h1 className="text-xl font-bold text-ink">저장한 채용공고</h1>
        <p className="mt-1 text-sm text-neutral-500">{savedJobs.length}개 저장됨</p>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          title="아직 저장한 공고가 없어요"
          description="마음에 드는 공고를 저장하고 여기서 모아보세요."
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
          {savedJobs.map(({ job }) => (
            <JobCard
              key={job.id}
              job={{ ...job, taskKeywords: job.analysis?.taskKeywords ?? [] }}
              saved
            />
          ))}
        </div>
      )}
    </div>
  );
}
