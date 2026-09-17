import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { LogoutButton } from "@/components/LogoutButton";
import { RecentlyViewedJobs } from "@/components/RecentlyViewedJobs";
import { TrackPageView } from "@/components/TrackPageView";
import { PreferenceEditLink } from "@/components/PreferenceEditLink";

// 로컬 미니 시안 전용: "마이페이지"는 관심사 설정/알림 같은 계정 설정 전용 페이지다.
// 저장한 공고 목록은 GNB "저장 공고"(/mypage)에서 따로 본다 — 서로 다른 탭.
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?source=auth_gate");

  const userId = (session.user as { id: string }).id;
  const preference = await prisma.preference.findUnique({ where: { userId } });

  const preferenceGroups = preference
    ? [
        { label: "관심 직무", values: preference.roles },
        { label: "매체", values: preference.platforms },
        { label: "산업", values: preference.industries },
        { label: "규모", values: preference.stages },
      ].filter((group) => group.values.length > 0)
    : [];

  return (
    <div className="flex flex-col gap-8">
      <TrackPageView name="Profile Page Viewed" dwellEventName="Profile Page Time Spent" />
      <h1 className="text-xl font-bold text-ink">마이페이지</h1>

      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">관심사 설정</h2>
          {preferenceGroups.length > 0 && (
            <PreferenceEditLink label="재설정" hasExistingPreference />
          )}
        </div>

        {preferenceGroups.length > 0 ? (
          <div className="flex flex-col gap-3">
            {preferenceGroups.map(({ label, values }) => (
              <div key={label} className="flex items-start gap-3">
                <p className="w-16 shrink-0 pt-1 text-xs text-neutral-400">{label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {values.map((value) => (
                    <Badge key={value}>{value}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">아직 설정한 관심사가 없어요.</p>
            <PreferenceEditLink label="설정하러 가기" hasExistingPreference={false} />
          </div>
        )}
      </div>

      <RecentlyViewedJobs />

      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5">
        <div>
          <p className="text-sm font-semibold text-ink">서비스 의견</p>
          <p className="text-xs text-neutral-400">불편했던 점이나 바라는 기능을 남겨주세요.</p>
        </div>
        <Link
          href="/feedback"
          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-primary-strong transition-colors hover:bg-blue-100"
        >
          의견 보내기
        </Link>
      </div>

      <LogoutButton />
    </div>
  );
}
