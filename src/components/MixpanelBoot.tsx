"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { trackPageView, identifyUser, resetAnalyticsUser } from "@/lib/analytics";

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    trackPageView(query ? `${pathname}?${query}` : pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}

function IdentifyOnAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    const user = session.user as { id?: string; email?: string | null; name?: string | null };
    if (!user.id) return;
    identifyUser(user.id, { $email: user.email ?? undefined, $name: user.name ?? undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") resetAnalyticsUser();
  }, [status]);

  return null;
}

// Providers.tsx 안에서 앱 전체를 감싸는 위치에 한 번만 마운트한다. useSearchParams는
// Suspense 경계가 필요해 페이지뷰 트래커만 따로 감쌌다.
export function MixpanelBoot() {
  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <IdentifyOnAuth />
    </>
  );
}
