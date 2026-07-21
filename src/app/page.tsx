import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RootPage({
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

  // 랜딩페이지/로그인 게이트 없이, 비로그인 방문자도 바로 채용 목록으로 보낸다.
  redirect("/jobs");
}
