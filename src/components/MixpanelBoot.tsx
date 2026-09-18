"use client";

import { Suspense, useEffect, useRef } from "react";
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
  const prevStatusRef = useRef(status);

  useEffect(() => {
    if (status !== "authenticated") return;
    const user = session.user as { id?: string; email?: string | null; name?: string | null };
    if (!user.id) return;
    identifyUser(user.id, { $email: user.email ?? undefined, $name: user.name ?? undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    // "unauthenticated"는 로그아웃 직후뿐 아니라, 한 번도 로그인 안 한 게스트가 처음
    // 접속했을 때(loading -> unauthenticated)도 잡힌다. 실제로 로그인 상태였다가
    // 로그아웃으로 전환된 경우에만 리셋해야, 게스트의 방문 기록이 매번 끊기지 않는다.
    if (prevStatusRef.current === "authenticated" && status === "unauthenticated") {
      resetAnalyticsUser();
    }
    prevStatusRef.current = status;
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
