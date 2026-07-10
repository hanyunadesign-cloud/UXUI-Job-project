import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const userId = (session.user as { id: string }).id;
    const preference = await prisma.preference.findUnique({ where: { userId } });
    redirect(preference ? "/jobs" : "/onboarding");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm font-medium tracking-wide text-neutral-400">UXUI JOB</p>
      <h1 className="max-w-md text-3xl font-bold leading-snug text-ink">
        흩어진 UXUI 채용공고를
        <br />
        한 곳에서, 놓치지 않게
      </h1>
      <p className="max-w-sm text-sm leading-relaxed text-neutral-500">
        관심 직무와 산업에 맞는 공고를 모아보고, 공고마다 필요한 역량과 어필 포인트까지
        바로 확인하세요.
      </p>
      <Link href="/login">
        <Button className="mt-2 px-8 py-3 text-base">시작하기</Button>
      </Link>
    </main>
  );
}
