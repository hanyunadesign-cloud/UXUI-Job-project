import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "./OnboardingWizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id: string }).id;
  const existing = await prisma.preference.findUnique({ where: { userId } });
  if (existing) redirect("/jobs");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <OnboardingWizard />
    </main>
  );
}
