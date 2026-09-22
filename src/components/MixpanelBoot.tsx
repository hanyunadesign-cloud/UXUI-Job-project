"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { trackPageView, identifyUser, resetAnalyticsUser } from "@/lib/analytics";
import { getGuestSavedJobIds, clearGuestSavedJobIds } from "@/lib/guestSaves";

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

  // 게스트로 저장해둔 공고를 계정으로 병합한다. 병합 성공 시 localStorage를 비우므로
  // 이후 렌더에서는 빈 배열이라 바로 리턴 — 로그인 상태에서 매번 실행돼도 멱등하다.
  useEffect(() => {
    if (status !== "authenticated") return;
    const guestIds = getGuestSavedJobIds();
    if (guestIds.length === 0) return;
    fetch("/api/saved-jobs/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobIds: guestIds }),
    })
      .then((res) => {
        if (res.ok) clearGuestSavedJobIds();
      })
      .catch(() => {
        // 실패하면 다음 로그인 상태 렌더에서 다시 시도된다(비우지 않았으므로).
      });
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
