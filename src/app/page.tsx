import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { TrackPageView } from "@/components/TrackPageView";

export const dynamic = "force-dynamic";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const userId = (session.user as { id: string }).id;
    const preference = await prisma.preference.findUnique({ where: { userId } });
    // 로그인 페이지에서 signIn()의 callbackUrl에 실어 보낸 entrySource를 그대로 이어받아,
    // 최종 목적지까지 전달한다(랜딩에서 바로 로그인했는지 vs 게스트로 둘러보다 로그인
    // 유도 모달을 거쳐 왔는지 구분하기 위함).
    const entrySource =
      typeof searchParams.entrySource === "string" ? searchParams.entrySource : "unknown";
    // 이 분기는 사실상 구글 로그인 콜백(callbackUrl: "/")으로만 도달하므로, 로그인 성공을
    // 확인하는 신호로 쓸 수 있게 쿼리 파라미터를 붙여 보낸다. 목적지 페이지에서
    // LoginSuccessTracker가 이걸 읽고 이벤트를 보낸 뒤 URL에서 지운다.
    redirect(
      preference
        ? `/jobs?loginSuccess=1&isNewUser=0&entrySource=${entrySource}`
        : `/onboarding?loginSuccess=1&isNewUser=1&entrySource=${entrySource}`
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <TrackPageView name="Landing Page Viewed" dwellEventName="Landing Page Time Spent" />
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
      <Link href="/login?source=landing_direct">
        <Button className="mt-2 px-8 py-3 text-base">시작하기</Button>
      </Link>
    </main>
  );
}
