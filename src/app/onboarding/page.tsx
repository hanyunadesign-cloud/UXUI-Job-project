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
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id: string }).id;
  const existing = await prisma.preference.findUnique({ where: { userId } });
  if (existing) redirect("/jobs");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <TrackPageView name="Onboarding Page Viewed" dwellEventName="Onboarding Page Time Spent" />
      {searchParams.loginSuccess === "1" && <LoginSuccessTracker isNewUser={true} />}
      <OnboardingWizard />
    </main>
  );
}
