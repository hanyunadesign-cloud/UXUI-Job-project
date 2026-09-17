import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "./OnboardingWizard";
import { TrackPageView } from "@/components/TrackPageView";
import { LoginSuccessTracker } from "@/components/LoginSuccessTracker";

export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?source=auth_gate");

  const userId = (session.user as { id: string }).id;
  const existing = await prisma.preference.findUnique({ where: { userId } });
  // 온보딩 도중 아무 항목도 고르지 않고 끝내버린 유저는 실질적으로 아직 온보딩을
  // 안 한 것과 같으니, 마이페이지 "설정하러 가기"로 다시 들어올 수 있게 통과시킨다.
  const hasRealPreference =
    existing &&
    (existing.roles.length > 0 ||
      existing.platforms.length > 0 ||
      existing.industries.length > 0 ||
      existing.stages.length > 0);
  if (hasRealPreference) redirect("/jobs");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <TrackPageView name="Onboarding Page Viewed" dwellEventName="Onboarding Page Time Spent" />
      {searchParams.loginSuccess === "1" && <LoginSuccessTracker isNewUser={true} />}
      <OnboardingWizard />
    </main>
  );
}
